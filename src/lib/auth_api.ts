import type { AppleAuthenticationCredential } from 'expo-apple-authentication';

import { sign_in_oauth2 } from '@/src/apis/user/sign-in';
import { AuthProvider } from '../constants/auth';
import type {
  AppleOAuthLoginPayload,
  GoogleOAuthLoginPayload,
  OAuth2LoginRequest,
  OAuthLoginOutcome,
} from '../interfaces/oauth';
import { devLog, devWarn } from './dev_log';
import type { GoogleAuthResult } from './google_auth';
import { getOAuthErrorMessage } from './oauth_errors';

const LOGIN_FAILED_FALLBACK = 'Đăng nhập thất bại. Vui lòng thử lại.';

function isRequestCanceled(error: unknown): boolean {
  return (error as { code?: string })?.code === 'ERR_REQUEST_CANCELED';
}

export function buildAppleOAuthPayload(
  credential: AppleAuthenticationCredential,
): AppleOAuthLoginPayload {
  const payload: AppleOAuthLoginPayload = {
    identity_token: credential.identityToken ?? '',
    apple_user_id: credential.user,
  };

  if (credential.authorizationCode) {
    payload.authorization_code = credential.authorizationCode;
  }
  if (credential.email) {
    payload.email = credential.email;
  }
  if (credential.fullName?.givenName) {
    payload.given_name = credential.fullName.givenName;
  }
  if (credential.fullName?.familyName) {
    payload.family_name = credential.fullName.familyName;
  }

  return payload;
}

export function buildAppleLoginRequest(
  credential: AppleAuthenticationCredential,
  deviceID: string,
): OAuth2LoginRequest {
  return {
    provider: AuthProvider.APPLE,
    device_id: deviceID,
    apple: buildAppleOAuthPayload(credential),
  };
}

function logOAuthRequest(body: OAuth2LoginRequest): void {
  if (body.provider === 1 && body.google) {
    devLog('[OAuth] sign-in (Google)', {
      provider: body.provider,
      device_id: body.device_id,
      google: {
        ...body.google,
        code: `${body.google.code.slice(0, 12)}...`,
        nonce: `${body.google.nonce.slice(0, 12)}...`,
      },
    });
    return;
  }

  if (body.provider === 2 && body.apple) {
    devLog('[OAuth] sign-in (Apple)', {
      provider: body.provider,
      device_id: body.device_id,
      apple: {
        ...body.apple,
        identity_token: body.apple.identity_token
          ? `${body.apple.identity_token.slice(0, 24)}...`
          : '',
      },
    });
  }
}

export async function tryLoginOAuth2(body: OAuth2LoginRequest): Promise<OAuthLoginOutcome> {
  logOAuthRequest(body);

  const result = await sign_in_oauth2(body);
  if (!result.success || !result.data?.data) {
    const message = result.error ?? LOGIN_FAILED_FALLBACK;
    devWarn('[OAuth] login failed:', message);
    return { ok: false, message };
  }

  const user = result.data.data;
  devLog('[OAuth] login success', {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role,
  });
  return { ok: true, user };
}

export function buildGoogleLoginRequest(
  auth: GoogleAuthResult,
  deviceID: string,
): OAuth2LoginRequest {
  const google: GoogleOAuthLoginPayload = {
    code: auth.code,
    nonce: auth.nonce,
    redirect_uri: auth.redirectUri,
  };

  return {
    provider: AuthProvider.GOOGLE,
    device_id: deviceID,
    google,
  };
}

export async function tryLoginWithGoogle(deviceID: string): Promise<OAuthLoginOutcome> {
  try {
    const { signInWithGoogleAsync } = await import('./google_auth');
    const auth = await signInWithGoogleAsync();
    return tryLoginOAuth2(buildGoogleLoginRequest(auth, deviceID));
  } catch (error) {
    if (isRequestCanceled(error)) {
      return { ok: false, message: '', cancelled: true };
    }
    const message = getOAuthErrorMessage(error, LOGIN_FAILED_FALLBACK);
    devWarn('[OAuth] Google sign-in failed:', message);
    return { ok: false, message };
  }
}

export async function tryLoginWithApple(
  credential: AppleAuthenticationCredential,
  deviceID: string,
): Promise<OAuthLoginOutcome> {
  if (!credential.identityToken) {
    return { ok: false, message: 'Thiếu identity token từ Apple.' };
  }
  if (!credential.user) {
    return { ok: false, message: 'Thiếu Apple user id.' };
  }

  return tryLoginOAuth2(buildAppleLoginRequest(credential, deviceID));
}
