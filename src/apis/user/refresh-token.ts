import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { RefreshTokenData } from '@/src/interfaces/oauth';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

/** Làm mới access cookie + csrf (dùng refresh/session cookie, không cần CSRF header). */
export const refresh_access_token = async (): Promise<UserApiResult<RefreshTokenData>> => {
  try {
    const response = await axiosInstance.post<IApiResponse<RefreshTokenData>>(
      USER_PATHS.REFRESH_TOKEN,
      {},
    );

    const data = response.data?.data;
    if (response.status !== 200 || !data?.csrf_token?.trim()) {
      return { success: false, error: 'Không làm mới được phiên đăng nhập.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Phiên đăng nhập đã hết hạn.'),
      httpStatus: err.response?.status,
    };
  }
};
