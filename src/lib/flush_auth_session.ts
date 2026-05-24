import { saveAuthSessionSync } from '@/src/lib/auth_persistence';
import { useAuthStore } from '@/src/store/auth';

/** Ghi session ra MMKV ngay (gọi khi app vào background / trước force-close). */
export function flushAuthSessionToDisk(): void {
  const { isSignedIn, csrfToken, user } = useAuthStore.getState();
  if (!isSignedIn || !csrfToken?.trim() || !user?.user_id?.trim()) {
    return;
  }
  saveAuthSessionSync({ csrfToken: csrfToken.trim(), user });
}
