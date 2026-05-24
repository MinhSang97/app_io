import { hasAuthSessionOnDisk, loadAuthSessionSync } from '@/src/lib/auth_persistence';
import { restoreSessionSync } from '@/src/lib/restore_session_sync';
import { loadPermissionGateCompleted } from '@/src/lib/permission_persistence';
import { useAuthStore } from '@/src/store/auth';

function hasActiveSession(): boolean {
  const { isSignedIn, csrfToken, user } = useAuthStore.getState();
  return Boolean(isSignedIn && csrfToken?.trim() && user?.user_id?.trim());
}

/** Khôi phục session từ io.authSession khi resume app. */
export async function ensureSessionFromStorage(): Promise<boolean> {
  if (hasActiveSession()) {
    return true;
  }

  if (!hasAuthSessionOnDisk()) {
    return false;
  }

  restoreSessionSync();

  if (await loadPermissionGateCompleted()) {
    useAuthStore.getState().completePermissionGate();
  }

  return loadAuthSessionSync() !== null;
}
