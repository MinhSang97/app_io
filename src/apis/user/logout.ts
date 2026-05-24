import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { UserApiResult } from '@/src/interfaces/api-response';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

export const logout = async (): Promise<UserApiResult<void>> => {
  try {
    const response = await axiosInstance.post(USER_PATHS.LOGOUT);

    if (response.status !== 200) {
      return { success: false, error: 'Đăng xuất thất bại.' };
    }

    return { success: true };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Đăng xuất thất bại. Vui lòng thử lại.'),
    };
  }
};
