import { appMmkv } from '@/src/lib/mmkv_storage';

// In-memory store — injected manually into Cookie header (iOS ignores XHR cookies).
export const cookieStore: Record<string, string> = {};

const AUTH_COOKIE_NAMES = new Set([
  'fcalories_jwt_access',
  'fcalories_jwt_refresh',
  'fcalories_jwt_session_id',
]);
const COOKIE_STORE_KEY = 'io.authCookies';

export function parseCookiesInto(headers: string | string[], store: Record<string, string>): void {
  const raw = Array.isArray(headers) ? headers : [headers];
  // React Native may concatenate multiple Set-Cookie headers into one string with ", " separator.
  const cookies = raw.flatMap((h) => h.split(/, (?=[a-zA-Z_])/));
  for (const cookie of cookies) {
    const nameValue = cookie.split(';')[0]?.trim();
    if (!nameValue) continue;
    const eqIdx = nameValue.indexOf('=');
    if (eqIdx < 0) continue;
    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();
    if (name) store[name] = value;
  }
}

export function persistAuthCookies(): void {
  const toSave: Record<string, string> = {};
  for (const name of AUTH_COOKIE_NAMES) {
    if (cookieStore[name]) toSave[name] = cookieStore[name];
  }
  if (Object.keys(toSave).length > 0) {
    appMmkv.set(COOKIE_STORE_KEY, JSON.stringify(toSave));
  }
}

/** Restores persisted auth cookies into cookieStore (call on app startup). */
export function restoreAuthCookies(): void {
  try {
    const raw = appMmkv.getString(COOKIE_STORE_KEY);
    if (raw) Object.assign(cookieStore, JSON.parse(raw) as Record<string, string>);
  } catch {
    // ignore corrupt data
  }
}

/** Clears auth cookies from memory and MMKV (call on sign-out). */
export function clearPersistedCookies(): void {
  for (const name of AUTH_COOKIE_NAMES) {
    delete cookieStore[name];
  }
  appMmkv.remove(COOKIE_STORE_KEY);
}
