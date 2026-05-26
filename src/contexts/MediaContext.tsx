import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { MediaAsset, MediaKind } from '@/types/domain';
import { useStorageState } from './StorageContext';

type MediaApi = {
  getCount: (playerId: string) => number;
  listByPlayer: (playerId: string) => Promise<MediaAsset[]>;
  upload: (playerId: string, file: File) => Promise<MediaAsset>;
  remove: (asset: MediaAsset) => Promise<void>;
  resolveUrl: (asset: MediaAsset) => Promise<string>;
  ready: boolean;
};

const MediaContext = createContext<MediaApi | null>(null);

function detectKind(file: File): MediaKind {
  if (file.type.startsWith('video/')) return 'video';
  return 'image';
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const storageState = useStorageState();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [version, setVersion] = useState(0);

  const ready = storageState.status === 'ready';

  useEffect(() => {
    // Bump de versión invalida el cache local de counts cuando una mutación
    // (upload/remove) cambia el storage.
    setCounts({});
  }, [version]);

  const refreshCount = useCallback(
    async (playerId: string) => {
      if (storageState.status !== 'ready') return;
      const n = await storageState.storage.countByPlayer(playerId);
      setCounts((prev) => ({ ...prev, [playerId]: n }));
    },
    [storageState],
  );

  const api = useMemo<MediaApi>(
    () => ({
      ready,
      getCount: (playerId) => {
        const known = counts[playerId];
        if (known === undefined && storageState.status === 'ready') {
          void refreshCount(playerId);
        }
        return known ?? 0;
      },
      listByPlayer: async (playerId) => {
        if (storageState.status !== 'ready') return [];
        return storageState.storage.listByPlayer(playerId);
      },
      upload: async (playerId, file) => {
        if (storageState.status !== 'ready') throw new Error('Storage no listo');
        const asset = await storageState.storage.save(
          {
            playerId,
            kind: detectKind(file),
            mimeType: file.type || 'application/octet-stream',
            filename: file.name,
            sizeBytes: file.size,
          },
          file,
        );
        await refreshCount(playerId);
        setVersion((v) => v + 1);
        return asset;
      },
      remove: async (asset) => {
        if (storageState.status !== 'ready') return;
        await storageState.storage.delete(asset.id);
        await refreshCount(asset.playerId);
        setVersion((v) => v + 1);
      },
      resolveUrl: async (asset) => {
        if (storageState.status !== 'ready') throw new Error('Storage no listo');
        return storageState.storage.getUrl(asset);
      },
    }),
    [storageState, counts, refreshCount, ready],
  );

  return <MediaContext.Provider value={api}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia debe usarse dentro de MediaProvider');
  return ctx;
}
