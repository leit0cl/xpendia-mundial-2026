import type { MediaAsset } from '@/types/domain';

export type NewAssetInput = Omit<MediaAsset, 'id' | 'createdAt' | 'storageKey'>;

export interface IMediaStorage {
  readonly backend: 'localforage' | 'minio';
  init(): Promise<void>;
  save(input: NewAssetInput, file: Blob): Promise<MediaAsset>;
  listByPlayer(playerId: string): Promise<MediaAsset[]>;
  countByPlayer(playerId: string): Promise<number>;
  getUrl(asset: MediaAsset): Promise<string>;
  delete(assetId: string): Promise<void>;
}
