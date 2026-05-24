import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserInformation } from '@/src/interfaces/user';
import { appMmkv } from '@/src/lib/mmkv_storage';

/** Key duy nhất cho phiên đăng nhập — survive reboot / force-close. */
export const AUTH_SESSION_KEY = 'io.authSession';
const AUTH_STORAGE_MIGRATED_KEY = 'io.authSession.migratedToMmkv';

export type PersistedAuthSession = {
  csrfToken: string;
  user: UserInformation;
};

function parseSession(raw: string | undefined): PersistedAuthSession | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as PersistedAuthSession;
    if (!parsed?.csrfToken?.trim() || !parsed?.user?.user_id?.trim()) {
      return null;
    }
    return {
      csrfToken: parsed.csrfToken.trim(),
      user: {
        ...parsed.user,
        locale: parsed.user.locale ?? 1,
        theme: parsed.user.theme ?? 3,
      },
    };
  } catch {
    return null;
  }
}

/** Đọc session đồng bộ từ MMKV. */
export function loadAuthSessionSync(): PersistedAuthSession | null {
  return parseSession(appMmkv.getString(AUTH_SESSION_KEY));
}

export function hasAuthSessionOnDisk(): boolean {
  return loadAuthSessionSync() !== null;
}

export function saveAuthSessionSync(session: PersistedAuthSession): void {
  appMmkv.set(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSessionSync(): void {
  appMmkv.remove(AUTH_SESSION_KEY);
}

/** Migrate session cũ từ AsyncStorage (một lần). */
export async function migrateAuthSessionFromAsyncStorage(): Promise<void> {
  if (appMmkv.getBoolean(AUTH_STORAGE_MIGRATED_KEY)) {
    return;
  }

  if (loadAuthSessionSync()) {
    appMmkv.set(AUTH_STORAGE_MIGRATED_KEY, true);
    return;
  }

  try {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    const session = parseSession(raw ?? undefined);
    if (session) {
      saveAuthSessionSync(session);
    }
  } catch {
    // ignore
  }

  appMmkv.set(AUTH_STORAGE_MIGRATED_KEY, true);
}

export async function loadAuthSession(): Promise<PersistedAuthSession | null> {
  return loadAuthSessionSync();
}

export async function saveAuthSession(session: PersistedAuthSession): Promise<void> {
  saveAuthSessionSync(session);
}

export async function clearAuthSession(): Promise<void> {
  clearAuthSessionSync();
}
