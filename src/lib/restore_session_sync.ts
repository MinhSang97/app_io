import { applyUserPreferencesFromProfile } from '@/src/lib/apply_user_preferences';
import { loadAuthSessionSync } from '@/src/lib/auth_persistence';
import { useAuthStore } from '@/src/store/auth';

/** Khôi phục session từ MMKV — nguồn sự thật duy nhất cho đăng nhập. */
export function restoreSessionSync(): boolean {
  const stored = loadAuthSessionSync();
  if (!stored) {
    return false;
  }

  const { hydrateFromStorage } = useAuthStore.getState();
  hydrateFromStorage(stored);
  applyUserPreferencesFromProfile(stored.user);
  return true;
}
