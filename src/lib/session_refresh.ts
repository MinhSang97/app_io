import { refresh_access_token } from '@/src/apis/user/refresh-token';
import type { OAuthLoginUser, RefreshTokenData } from '@/src/interfaces/oauth';
import type { UserInformation } from '@/src/interfaces/user';
import { clearAuthSessionSync } from '@/src/lib/auth_persistence';
import { ensureSessionFromStorage } from '@/src/lib/ensure_session';
import { clearPersistedCookies } from '@/src/lib/cookie_store';
import { useAuthStore } from '@/src/store/auth';

export function oauthUserToUserInformation(
  source: OAuthLoginUser | RefreshTokenData,
  currentUser?: UserInformation | null,
): UserInformation {
  return {
    user_id: source.user_id.trim(),
    username: (source.username ?? '').trim(),
    email: source.email ?? '',
    avatar_link: source.avatar_link ?? '',
    phone_number: currentUser?.phone_number ?? '',
    locale: source.locale ?? currentUser?.locale ?? 1,
    theme: currentUser?.theme ?? 3,
    subscription_tier: currentUser?.subscription_tier,
    subscription_expires_at: currentUser?.subscription_expires_at,
    vip_points_earned: currentUser?.vip_points_earned,
    vip_points_balance: currentUser?.vip_points_balance,
    vip_rank: currentUser?.vip_rank,
    role: currentUser?.role ?? source.role,
  };
}

let refreshInFlight: Promise<boolean> | null = null;

/** Gọi POST /users/refresh, cập nhật csrf + persist. Trả false nếu refresh hết hạn. */
export async function tryRefreshSession(): Promise<boolean> {
  await ensureSessionFromStorage();

  const csrfToken = useAuthStore.getState().csrfToken?.trim();
  if (!csrfToken) {
    return false;
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const result = await refresh_access_token();
    if (!result.success || !result.data?.data) {
      return false;
    }

    const data = result.data.data;
    const csrfToken = data.csrf_token.trim();
    
    const currentUser = useAuthStore.getState().user;
    const user = oauthUserToUserInformation(data, currentUser);

    const { setSession } = useAuthStore.getState();
    setSession({ user, csrfToken });
    return true;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function invalidateSession(): Promise<void> {
  clearAuthSessionSync();
  clearPersistedCookies();
  useAuthStore.getState().signOut();
}
