import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import type { MediaAsset } from '@/types/domain';
import type { IMediaStorage, NewAssetInput } from './IMediaStorage';

type MinioConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const META_PREFIX = '__meta__';

export class MinioStorage implements IMediaStorage {
  readonly backend = 'minio' as const;
  private client: S3Client;

  constructor(private cfg: MinioConfig) {
    this.client = new S3Client({
      endpoint: cfg.endpoint,
      region: cfg.region,
      credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
      forcePathStyle: true,
    });
  }

  async init() {
    await this.client.send(new ListObjectsV2Command({ Bucket: this.cfg.bucket, MaxKeys: 1 }));
  }

  async save(input: NewAssetInput, file: Blob): Promise<MediaAsset> {
    const id = uuid();
    const storageKey = `${input.playerId}/${id}-${input.filename}`;
    const asset: MediaAsset = { ...input, id, createdAt: Date.now(), storageKey };

    const buffer = new Uint8Array(await file.arrayBuffer());
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.cfg.bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: input.mimeType,
      }),
    );
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.cfg.bucket,
        Key: `${META_PREFIX}/${input.playerId}/${id}.json`,
        Body: new TextEncoder().encode(JSON.stringify(asset)),
        ContentType: 'application/json',
      }),
    );
    return asset;
  }

  async listByPlayer(playerId: string): Promise<MediaAsset[]> {
    const res = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.cfg.bucket,
        Prefix: `${META_PREFIX}/${playerId}/`,
      }),
    );
    const keys = (res.Contents ?? []).map((o) => o.Key!).filter(Boolean);
    const assets = await Promise.all(
      keys.map(async (key) => {
        const obj = await this.client.send(
          new GetObjectCommand({ Bucket: this.cfg.bucket, Key: key }),
        );
        const text = await obj.Body!.transformToString();
        return JSON.parse(text) as MediaAsset;
      }),
    );
    return assets;
  }

  async countByPlayer(playerId: string): Promise<number> {
    const res = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.cfg.bucket,
        Prefix: `${META_PREFIX}/${playerId}/`,
      }),
    );
    return res.KeyCount ?? 0;
  }

  async getUrl(asset: MediaAsset): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.cfg.bucket, Key: asset.storageKey });
    return getSignedUrl(this.client, cmd, { expiresIn: 3600 });
  }

  async delete(assetId: string): Promise<void> {
    const res = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.cfg.bucket,
        Prefix: META_PREFIX,
      }),
    );
    const metaKey = (res.Contents ?? [])
      .map((o) => o.Key!)
      .find((k) => k?.endsWith(`/${assetId}.json`));
    if (!metaKey) return;
    const metaObj = await this.client.send(
      new GetObjectCommand({ Bucket: this.cfg.bucket, Key: metaKey }),
    );
    const asset = JSON.parse(await metaObj.Body!.transformToString()) as MediaAsset;
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.cfg.bucket, Key: asset.storageKey }),
    );
    await this.client.send(new DeleteObjectCommand({ Bucket: this.cfg.bucket, Key: metaKey }));
  }
}
