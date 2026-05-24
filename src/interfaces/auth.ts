import type { UserInformation } from './user';

export type CountryCode =
  | 'vn'
  | 'us'
  | 'gb'
  | 'jp'
  | 'kr'
  | 'cn'
  | 'fr'
  | 'de'
  | 'es'
  | 'pt'
  | 'id'
  | 'th';

export type AuthState = {
  isSignedIn: boolean;
  isSessionRestoring: boolean;
  permissionGateCompleted: boolean;
  selectedCountry: CountryCode;
  user: UserInformation | null;
  csrfToken: string | null;
  setSelectedCountry: (country: CountryCode) => void;
  setSession: (payload: { user: UserInformation; csrfToken: string }) => void;
  setUser: (user: UserInformation) => void;
  setCsrfToken: (csrfToken: string) => void;
  hydrateFromStorage: (payload: { user: UserInformation; csrfToken: string }) => void;
  setSessionRestoring: (value: boolean) => void;
  completePermissionGate: () => void;
  signOut: () => void;
};
