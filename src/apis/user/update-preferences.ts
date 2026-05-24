import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

export const update_user_theme = async (
  theme: number,
): Promise<UserApiResult<void>> => {
  try {
    const response = await axiosInstance.put<IApiResponse<void>>(
      `${USER_PATHS.ME}/theme`,
      { theme },
    );

    if (response.status !== 200) {
      return { success: false, error: 'Không thể cập nhật cấu hình giao diện.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể cập nhật cấu hình giao diện.'),
      httpStatus: err.response?.status,
    };
  }
};

export const update_user_locale = async (
  locale: number,
): Promise<UserApiResult<void>> => {
  try {
    const response = await axiosInstance.put<IApiResponse<void>>(
      `${USER_PATHS.ME}/locale`,
      { locale },
    );

    if (response.status !== 200) {
      return { success: false, error: 'Không thể cập nhật ngôn ngữ.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể cập nhật ngôn ngữ.'),
      httpStatus: err.response?.status,
    };
  }
};
