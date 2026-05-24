import { appMmkv } from '@/src/lib/mmkv_storage';
import { migrateAuthSessionFromAsyncStorage, hasAuthSessionOnDisk } from '@/src/lib/auth_persistence';
import { restoreSessionSync } from '@/src/lib/restore_session_sync';
import { useAuthStore, waitForAuthRehydration } from '@/src/store/auth';
import { API_BASE_URL } from '@/src/config/urls';

/** Khôi phục phiên khi cold start — MMKV sync, không gọi API. */
export async function bootstrapSession(): Promise<void> {

  const { setSessionRestoring } = useAuthStore.getState();
  const needsMigration = !appMmkv.getBoolean('io.authSession.migratedToMmkv') && !hasAuthSessionOnDisk();

  if (needsMigration) {
    setSessionRestoring(true);
  }

  try {
    restoreSessionSync();
    await migrateAuthSessionFromAsyncStorage();
    restoreSessionSync();
    await waitForAuthRehydration();
    restoreSessionSync();

    // Trigger quyền truy cập mạng nội bộ (Local Network) trên iOS trước khi hoàn thành loading.
    // Gọi đến api healthz vô hại để kích hoạt hộp thoại hệ thống mà không spam backend.
    try {
      const healthUrl = API_BASE_URL.replace(/\/v1\/?$/, '') + '/healthz';
      await Promise.race([
        fetch(healthUrl).catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    } catch {
      // ignore
    }
  } finally {
    if (needsMigration) {
      useAuthStore.getState().setSessionRestoring(false);
    }
  }
}

