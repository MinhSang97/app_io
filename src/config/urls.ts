/** API paths & URL helpers — base từ EXPO_PUBLIC_API_URL (đã gồm /api/v1). */

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

const apiBase = process.env.EXPO_PUBLIC_API_URL?.trim();
if (!apiBase) {
  throw new Error('EXPO_PUBLIC_API_URL is not configured');
}

/** Axios baseURL — ví dụ http://192.168.1.153:2003/api/v1 */
export const API_BASE_URL = apiBase;

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
