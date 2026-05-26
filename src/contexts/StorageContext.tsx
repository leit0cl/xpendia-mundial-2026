import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createStorageFromEnv, type IMediaStorage } from '@/services/storage';

type StorageState =
  | { status: 'loading' }
  | { status: 'ready'; storage: IMediaStorage }
  | { status: 'error'; error: Error };

const StorageContext = createContext<StorageState | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorageState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    createStorageFromEnv()
      .then((storage) => {
        if (!cancelled) setState({ status: 'ready', storage });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ status: 'error', error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <StorageContext.Provider value={state}>{children}</StorageContext.Provider>;
}

export function useStorage(): IMediaStorage {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage debe usarse dentro de StorageProvider');
  if (ctx.status !== 'ready') {
    throw new Error('Storage no está listo aún. Usa useStorageState para esperar.');
  }
  return ctx.storage;
}

export function useStorageState() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorageState debe usarse dentro de StorageProvider');
  return ctx;
}
