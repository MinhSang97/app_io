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
  permissionGateCompleted: boolean;
  selectedCountry: CountryCode;
  appleUserId: string | null;
  appleFullName: string | null;
  appleEmail: string | null;
  setSelectedCountry: (country: CountryCode) => void;
  signInWithApple: (payload: { userId: string; fullName: string | null; email: string | null }) => void;
  completePermissionGate: () => void;
  signOut: () => void;
};
