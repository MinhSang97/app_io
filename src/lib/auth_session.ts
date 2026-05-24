import { logout } from '@/src/apis/user/logout';
import { clearAuthSessionSync } from '@/src/lib/auth_persistence';
import { devWarn } from './dev_log';
import { useAuthStore } from '../store/auth';

/** Gọi API logout rồi xóa session local (kể cả khi API lỗi). */
export async function performSignOut(): Promise<void> {
  const { csrfToken, signOut } = useAuthStore.getState();

  if (csrfToken?.trim()) {
    const result = await logout();
    if (!result.success) {
      devWarn('[Auth] logout API failed:', result.error ?? 'unknown');
    }
  }

  clearAuthSessionSync();
  signOut();
}
