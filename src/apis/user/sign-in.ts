import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { OAuth2LoginRequest, OAuthLoginUser } from '@/src/interfaces/oauth';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

/** Đăng nhập OAuth2 (Google / Apple) — session cookie do axios `withCredentials` giữ. */
export const sign_in_oauth2 = async (
  body: OAuth2LoginRequest,
): Promise<UserApiResult<OAuthLoginUser>> => {
  try {
    const response = await axiosInstance.post<IApiResponse<OAuthLoginUser>>(
      USER_PATHS.LOGIN_OAUTH2,
      body,
    );

    if (response.status !== 200 || !response.data?.data?.user_id) {
      return { success: false, error: 'Phản hồi đăng nhập không hợp lệ từ server.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError<IApiResponse<OAuthLoginUser>>;
    const message = parseApiErrorMessage(err, 'Đăng nhập thất bại. Vui lòng thử lại.');

    const knownErrors = [
      'User is deleted. Please contact admin',
      'This account is already registered with a password',
      'This email is already registered',
      'user is deleted. Please contact admin',
    ];

    if (knownErrors.some((text) => message.toLowerCase().includes(text.toLowerCase()))) {
      return { success: false, error: message };
    }

    return { success: false, error: message };
  }
};
