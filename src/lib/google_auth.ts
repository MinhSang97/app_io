import * as AuthSession from 'expo-auth-session';
import { discovery as googleDiscovery } from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';

import { GOOGLE_OAUTH } from '@/src/config/urls';
import { generateNonce } from '@/src/lib/utils';
import { devLog } from './dev_log';

export type GoogleAuthResult = {
  code: string;
  nonce: string;
  redirectUri: string;
};

export function getGoogleRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    scheme: 'io',
    path: 'oauth2redirect/google',
  });
}

export async function signInWithGoogleAsync(): Promise<GoogleAuthResult> {
  if (!GOOGLE_OAUTH.CLIENT_ID) {
    throw new Error('EXPO_PUBLIC_GOOGLE_CLIENT_ID is not configured');
  }

  const nonce = await generateNonce();
  const redirectUri = getGoogleRedirectUri();
  devLog('[Google Sign In] platform:', Platform.OS);
  devLog('[Google Sign In] redirectUri:', redirectUri);
  devLog('[Google Sign In] clientId:', `${GOOGLE_OAUTH.CLIENT_ID.slice(0, 12)}...`);

  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_OAUTH.CLIENT_ID,
    redirectUri,
    scopes: GOOGLE_OAUTH.SCOPE.split(' '),
    responseType: AuthSession.ResponseType.Code,
    usePKCE: false,
    extraParams: { nonce },
  });

  const result = await request.promptAsync(googleDiscovery);
  devLog('[Google Sign In] prompt result:', result.type);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw Object.assign(new Error('Google sign in cancelled'), { code: 'ERR_REQUEST_CANCELED' });
  }

  if (result.type !== 'success') {
    throw new Error(`Google sign in failed: ${result.type}`);
  }

  const code = result.params.code;
  if (!code || typeof code !== 'string') {
    throw new Error('Google authorization code is missing');
  }

  return { code, nonce, redirectUri };
}
