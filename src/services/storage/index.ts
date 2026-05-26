import type { IMediaStorage } from './IMediaStorage';
import { LocalForageStorage } from './LocalForageStorage';
import { MinioStorage } from './MinioStorage';

export async function createStorageFromEnv(): Promise<IMediaStorage> {
  const backend = (import.meta.env.VITE_STORAGE_BACKEND ?? 'localforage') as
    | 'localforage'
    | 'minio';

  if (backend === 'minio') {
    const storage = new MinioStorage({
      endpoint: import.meta.env.VITE_MINIO_ENDPOINT ?? 'http://localhost:9000',
      region: import.meta.env.VITE_MINIO_REGION ?? 'us-east-1',
      bucket: import.meta.env.VITE_MINIO_BUCKET ?? 'mundial-media',
      accessKeyId: import.meta.env.VITE_MINIO_ACCESS_KEY ?? 'minioadmin',
      secretAccessKey: import.meta.env.VITE_MINIO_SECRET_KEY ?? 'minioadmin',
    });
    try {
      await storage.init();
      return storage;
    } catch (err) {
      console.warn(
        '[storage] MinIO no responde en',
        import.meta.env.VITE_MINIO_ENDPOINT ?? 'http://localhost:9000',
        '— cayendo a localforage. Levanta MinIO con `docker compose up -d` para usar el backend S3.',
      );
      console.debug('[storage] error original:', err);
    }
  }

  const storage = new LocalForageStorage();
  await storage.init();
  return storage;
}

export type { IMediaStorage } from './IMediaStorage';
