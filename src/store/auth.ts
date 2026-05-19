import { create } from 'zustand';
import { DEFAULT_COUNTRY } from '../constants/countries';
import type { AuthState, CountryCode } from '../interfaces/auth';
import { saveSelectedCountry } from '../lib/countryPersistence';

export type { AuthState, CountryCode } from '../interfaces/auth';

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  permissionGateCompleted: false,
  selectedCountry: DEFAULT_COUNTRY,
  appleUserId: null,
  appleFullName: null,
  appleEmail: null,
  setSelectedCountry: (country) => {
    set({ selectedCountry: country });
    // TODO: Sync selected language/country with backend API when available instead of just saving to AsyncStorage
    void saveSelectedCountry(country);
  },
  signInWithApple: ({ userId, fullName, email }) =>
    set({
      isSignedIn: true,
      permissionGateCompleted: false,
      appleUserId: userId,
      appleFullName: fullName,
      appleEmail: email,
    }),
  completePermissionGate: () => set({ permissionGateCompleted: true }),
  signOut: () =>
    set({
      isSignedIn: false,
      permissionGateCompleted: false,
      selectedCountry: DEFAULT_COUNTRY,
      appleUserId: null,
      appleFullName: null,
      appleEmail: null,
    }),
}));
