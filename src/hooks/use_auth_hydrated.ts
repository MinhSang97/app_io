import { useEffect, useState } from 'react';

import { useAuthStore } from '@/src/store/auth';

const HYDRATE_FALLBACK_MS = 500;

/**
 * true khi zustand persist đã rehydrate (hoặc timeout — tránh loading vô hạn).
 */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    const timer = setTimeout(() => {
      setHydrated(true);
    }, HYDRATE_FALLBACK_MS);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return hydrated;
}
