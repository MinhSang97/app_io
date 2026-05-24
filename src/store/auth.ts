import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_COUNTRY } from '../constants/countries';
import type { AuthState, CountryCode } from '../interfaces/auth';
import { applyUserPreferencesFromProfile } from '../lib/apply_user_preferences';
import {
  clearAuthSessionSync,
  loadAuthSessionSync,
  saveAuthSessionSync,
} from '../lib/auth_persistence';
import { saveSelectedCountry } from '../lib/country_persistence';
import { createMmkvStateStorage, appMmkv } from '../lib/mmkv_storage';

export type { AuthState, CountryCode } from '../interfaces/auth';

/** Chỉ persist UI prefs — session (csrf/user) chỉ ở io.authSession. */
type AuthPersistedPrefs = Pick<AuthState, 'permissionGateCompleted' | 'selectedCountry'>;

function getInitialAuthPrefsSync() {
  try {
    const raw = appMmkv.getString('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state) {
        return {
          permissionGateCompleted: Boolean(parsed.state.permissionGateCompleted),
          selectedCountry: (parsed.state.selectedCountry || DEFAULT_COUNTRY) as CountryCode,
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    permissionGateCompleted: false,
    selectedCountry: DEFAULT_COUNTRY as CountryCode,
  };
}

const initialPrefs = getInitialAuthPrefsSync();

const initialAuthState = {
  isSignedIn: false,
  isSessionRestoring: false,
  permissionGateCompleted: initialPrefs.permissionGateCompleted,
  selectedCountry: initialPrefs.selectedCountry,
  user: null,
  csrfToken: null,
};

export function applySessionFromDisk(): boolean {
  const stored = loadAuthSessionSync();
  if (!stored) {
    return false;
  }
  useAuthStore.setState({
    isSignedIn: true,
    user: stored.user,
    csrfToken: stored.csrfToken,
  });
  applyUserPreferencesFromProfile(stored.user);
  return true;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialAuthState,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
        void saveSelectedCountry(country);
      },
      setSession: ({ user, csrfToken }) => {
        set({
          isSignedIn: true,
          permissionGateCompleted: false,
          user,
          csrfToken,
        });
        saveAuthSessionSync({ csrfToken: csrfToken.trim(), user });
      },
      setUser: (user) => {
        set({ user });
        const token = get().csrfToken?.trim();
        if (get().isSignedIn && token) {
          saveAuthSessionSync({ csrfToken: token, user });
        }
      },
      setCsrfToken: (csrfToken) => {
        set({ csrfToken });
        const { user, isSignedIn } = get();
        if (isSignedIn && user?.user_id?.trim() && csrfToken?.trim()) {
          saveAuthSessionSync({ csrfToken: csrfToken.trim(), user });
        }
      },
      hydrateFromStorage: ({ user, csrfToken }) => {
        set({
          isSignedIn: true,
          user,
          csrfToken,
        });
        saveAuthSessionSync({ csrfToken: csrfToken.trim(), user });
      },
      setSessionRestoring: (value) => set({ isSessionRestoring: value }),
      completePermissionGate: () => set({ permissionGateCompleted: true }),
      signOut: () => {
        clearAuthSessionSync();
        set({ ...initialAuthState, isSessionRestoring: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createMmkvStateStorage()),
      partialize: (state): AuthPersistedPrefs => ({
        permissionGateCompleted: state.permissionGateCompleted,
        selectedCountry: state.selectedCountry,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as AuthPersistedPrefs),
        isSignedIn: false,
        user: null,
        csrfToken: null,
      }),
      onRehydrateStorage: () => () => {
        applySessionFromDisk();
      },
    },
  ),
);

const REHYDRATE_TIMEOUT_MS = 800;

/** Đọc prefs từ MMKV; không treo nếu hydration đã xong trước khi subscribe. */
export async function waitForAuthRehydration(): Promise<void> {
  applySessionFromDisk();

  if (useAuthStore.persist.hasHydrated()) {
    return;
  }

  await Promise.race([
    Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      applySessionFromDisk();
    }),
    new Promise<void>((resolve) => {
      setTimeout(resolve, REHYDRATE_TIMEOUT_MS);
    }),
  ]);

  applySessionFromDisk();
}
