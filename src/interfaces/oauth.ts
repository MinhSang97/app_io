import type { AuthProvider } from '../constants/auth';

export type GoogleOAuthLoginPayload = {
  code: string;
  nonce: string;
  redirect_uri: string;
};

export type AppleOAuthLoginPayload = {
  identity_token: string;
  apple_user_id: string;
  authorization_code?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
};

export type OAuth2LoginRequest = {
  provider: AuthProvider;
  device_id: string;
  google?: GoogleOAuthLoginPayload;
  apple?: AppleOAuthLoginPayload;
};

export type OAuthLoginUser = {
  user_id: string;
  username: string;
  email: string;
  avatar_link: string;
  role: string;
  csrf_token: string;
};

/** Payload refresh token (cùng shape login response). */
export type RefreshTokenData = OAuthLoginUser;

import type { IApiResponse } from './api-response';

export type ApiSuccessResponse<T> = IApiResponse<T>;

/** Kết quả đăng nhập OAuth — không throw, tránh LogBox/Red Screen trên Expo. */
export type OAuthLoginOutcome =
  | { ok: true; user: OAuthLoginUser }
  | { ok: false; message: string; cancelled?: boolean };
