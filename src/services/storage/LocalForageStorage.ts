import localforage from 'localforage';
import { v4 as uuid } from 'uuid';
import type { MediaAsset } from '@/types/domain';
import type { IMediaStorage, NewAssetInput } from './IMediaStorage';

const META_STORE = 'mundial-free-meta';
const BLOB_STORE = 'mundial-free-blobs';

export class LocalForageStorage implements IMediaStorage {
  readonly backend = 'localforage' as const;

  private meta = localforage.createInstance({ name: META_STORE });
  private blobs = localforage.createInstance({ name: BLOB_STORE });
  private urlCache = new Map<string, string>();

  async init() {
    await this.meta.ready();
    await this.blobs.ready();
  }

  async save(input: NewAssetInput, file: Blob): Promise<MediaAsset> {
    const id = uuid();
    const storageKey = `${input.playerId}/${id}`;
    const asset: MediaAsset = {
      ...input,
      id,
      createdAt: Date.now(),
      storageKey,
    };
    await this.blobs.setItem(storageKey, file);
    const idx = (await this.meta.getItem<string[]>(input.playerId)) ?? [];
    idx.push(id);
    await this.meta.setItem(input.playerId, idx);
    await this.meta.setItem(`asset:${id}`, asset);
    return asset;
  }

  async listByPlayer(playerId: string): Promise<MediaAsset[]> {
    const ids = (await this.meta.getItem<string[]>(playerId)) ?? [];
    const assets = await Promise.all(ids.map((id) => this.meta.getItem<MediaAsset>(`asset:${id}`)));
    return assets.filter((a): a is MediaAsset => a !== null);
  }

  async countByPlayer(playerId: string): Promise<number> {
    const ids = (await this.meta.getItem<string[]>(playerId)) ?? [];
    return ids.length;
  }

  async getUrl(asset: MediaAsset): Promise<string> {
    const cached = this.urlCache.get(asset.id);
    if (cached) return cached;
    const blob = await this.blobs.getItem<Blob>(asset.storageKey);
    if (!blob) throw new Error(`Blob no encontrado para ${asset.id}`);
    const url = URL.createObjectURL(blob);
    this.urlCache.set(asset.id, url);
    return url;
  }

  async delete(assetId: string): Promise<void> {
    const asset = await this.meta.getItem<MediaAsset>(`asset:${assetId}`);
    if (!asset) return;
    await this.blobs.removeItem(asset.storageKey);
    await this.meta.removeItem(`asset:${assetId}`);
    const idx = (await this.meta.getItem<string[]>(asset.playerId)) ?? [];
    await this.meta.setItem(
      asset.playerId,
      idx.filter((id) => id !== assetId),
    );
    const cached = this.urlCache.get(assetId);
    if (cached) {
      URL.revokeObjectURL(cached);
      this.urlCache.delete(assetId);
    }
  }
}
