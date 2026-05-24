import { get_user_information } from '@/src/apis/user/user-information';
import { applyUserPreferencesFromProfile } from '@/src/lib/apply_user_preferences';
import { loadAuthSessionSync, saveAuthSessionSync } from '@/src/lib/auth_persistence';
import type { UserInformation } from '@/src/interfaces/user';
import { tryRefreshSession } from '@/src/lib/session_refresh';
import { useAuthStore } from '@/src/store/auth';

export type FetchUserProfileResult =
  | { ok: true; user: UserInformation }
  | { ok: false; unauthorized: boolean };

export type SyncUserProfileOptions = {
  /** Bỏ qua cache — dùng sau login để lấy profile chuẩn từ server một lần. */
  force?: boolean;
};

function hasValidUser(user: UserInformation | null | undefined): user is UserInformation {
  return Boolean(user?.user_id?.trim());
}

/** Đã có user + csrf trong store và khớp bản lưu local. */
async function hasCachedUserProfile(): Promise<boolean> {
  const { csrfToken, user } = useAuthStore.getState();
  if (!csrfToken?.trim() || !hasValidUser(user)) {
    return false;
  }

  const stored = loadAuthSessionSync();
  return Boolean(stored && stored.user.user_id === user.user_id && stored.csrfToken === csrfToken);
}

/** GET /users/me — không tự refresh; dùng fetchUserProfileWithRefresh khi cần. */
export async function fetchUserProfile(): Promise<FetchUserProfileResult> {
  const result = await get_user_information();
  if (result.success && result.data?.data) {
    return { ok: true, user: result.data.data };
  }

  return { ok: false, unauthorized: result.httpStatus === 401 };
}

/** Gọi /me; nếu 401 thì refresh một lần rồi gọi lại /me. */
export async function fetchUserProfileWithRefresh(): Promise<FetchUserProfileResult> {
  let profile = await fetchUserProfile();
  if (profile.ok) {
    return profile;
  }
  if (!profile.unauthorized) {
    return profile;
  }

  const refreshed = await tryRefreshSession();
  if (!refreshed) {
    return profile;
  }

  profile = await fetchUserProfile();
  return profile;
}

/**
 * Đồng bộ profile từ server.
 * Mặc định dùng cache local nếu đã có — tránh spam /me khi mở app.
 */
export async function syncUserProfileFromServer(
  options?: SyncUserProfileOptions,
): Promise<FetchUserProfileResult> {
  const force = options?.force ?? false;

  if (!force && (await hasCachedUserProfile())) {
    const stored = loadAuthSessionSync();
    if (stored) {
      applyUserPreferencesFromProfile(stored.user);
      return { ok: true, user: stored.user };
    }
  }

  const profile = await fetchUserProfileWithRefresh();
  if (!profile.ok) {
    return profile;
  }

  const csrfToken = useAuthStore.getState().csrfToken?.trim();
  if (!csrfToken) {
    return { ok: false, unauthorized: true };
  }

  const { setUser } = useAuthStore.getState();
  setUser(profile.user);
  applyUserPreferencesFromProfile(profile.user);
  saveAuthSessionSync({ csrfToken, user: profile.user });
  return profile;
}

/** @deprecated Dùng syncUserProfileFromServer */
export const persistUserProfileFromServer = syncUserProfileFromServer;
