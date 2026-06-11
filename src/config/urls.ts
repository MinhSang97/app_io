/** API paths & URL helpers */
import Constants from 'expo-constants';

function combinePath<T extends Record<string, string>, K extends keyof T>(
  base: string,
  items: T,
): { [P in K]: string } {
  const normalizedBase = base.replace(/\/$/, '');
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(items)) {
    result[key] = `${normalizedBase}${value.startsWith('/') ? value : `/${value}`}`;
  }
  return result as { [P in K]: string };
}

/**
 * Resolve API base URL:
 * - Có EXPO_PUBLIC_API_URL (dev/prod có domain): dùng luôn.
 * - Không có (local): lấy IP động từ Metro bundler host —
 *   tránh hardcode IP vì đổi mạng/wifi là đổi IP.
 */
function resolveApiBase(): string {
  const envBase = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envBase) return envBase;

  // Local only: detect IP từ Expo Metro host
  const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (metroHost) return `http://${metroHost}/api/v1`;

  throw new Error('EXPO_PUBLIC_API_URL is not configured');
}

const apiBase = resolveApiBase();

if (__DEV__) {
  console.log('[urls] API_BASE_URL =', apiBase);
  console.log('[urls] hostUri =', Constants.expoConfig?.hostUri);
}

/** Axios baseURL — tự động theo IP máy dev hoặc EXPO_PUBLIC_API_URL (prod) */
export const API_BASE_URL = apiBase;

/** AI service đi qua cùng API gateway — cùng base URL */
export const AI_BASE_URL = apiBase;

export const AI_PATHS = {
  ANALYZE_SSE: '/analyzer',
} as const;

/** Path tương đối (dùng với axios baseURL). */
export const USER_PATHS = {
  LOGIN_OAUTH2: '/users/login-oauth2',
  LOGOUT: '/users/logout',
  REFRESH_TOKEN: '/users/refresh',
  ME: '/users/me',
  CALLBACK: '/users/callback',
  SEARCH_USER: '/users/search',
} as const;

/** URL đầy đủ (debug, deep link, mở browser). */
export const USER = combinePath<typeof USER_PATHS, keyof typeof USER_PATHS>(
  API_BASE_URL,
  USER_PATHS,
);

export const GET_CONFIG_PATHS = {
  GET_CONFIG: '/get-config',
} as const;

export const GET_CONFIG = combinePath<typeof GET_CONFIG_PATHS, keyof typeof GET_CONFIG_PATHS>(
  API_BASE_URL,
  GET_CONFIG_PATHS,
);

export const GOOGLE_OAUTH = {
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  RESPONSE_TYPE: 'code',
  SCOPE: 'openid profile email',
} as const;

export enum UserRole {
  Normal = 1,
  Manager,
  Administrator,
  SuperAdmin,
}

export const RoleStrings: { [key in UserRole]: string } = {
  [UserRole.Normal]: 'user',
  [UserRole.Manager]: 'manager',
  [UserRole.Administrator]: 'admin',
  [UserRole.SuperAdmin]: 'superadmin',
};

export function getUserRolePriority(role: UserRole): number {
  switch (role) {
    case UserRole.SuperAdmin:
      return 1;
    case UserRole.Administrator:
      return 2;
    case UserRole.Manager:
      return 3;
    case UserRole.Normal:
      return 4;
    default:
      return 5;
  }
}

export const SCAN_PATHS = {
  CREATE: '/scans',
  LIST: '/scans/list',
  GET: '/scans',
} as const;

export const SCAN = combinePath<typeof SCAN_PATHS, keyof typeof SCAN_PATHS>(
  API_BASE_URL,
  SCAN_PATHS,
);

export const SUBSCRIPTION_PATHS = {
  PLANS: '/subscriptions/list',
  PURCHASE: '/subscriptions/purchase',
} as const;

export const SUBSCRIPTION = combinePath<typeof SUBSCRIPTION_PATHS, keyof typeof SUBSCRIPTION_PATHS>(
  API_BASE_URL,
  SUBSCRIPTION_PATHS,
);

export const VIP_PATHS = {
  RANKS: '/vip-ranks/list',
  REWARDS: '/vip-rewards/list',
  REDEEM: '/vip-rewards/redeem',
  HISTORY: '/vip-rewards/history',
} as const;

export const VIP = combinePath<typeof VIP_PATHS, keyof typeof VIP_PATHS>(
  API_BASE_URL,
  VIP_PATHS,
);

