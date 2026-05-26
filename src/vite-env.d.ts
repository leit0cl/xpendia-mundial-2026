/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_BACKEND?: 'localforage' | 'minio';
  readonly VITE_MINIO_ENDPOINT?: string;
  readonly VITE_MINIO_REGION?: string;
  readonly VITE_MINIO_BUCKET?: string;
  readonly VITE_MINIO_ACCESS_KEY?: string;
  readonly VITE_MINIO_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
