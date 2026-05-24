import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { UserInformation } from '@/src/interfaces/user';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

export const get_user_information = async (): Promise<UserApiResult<UserInformation>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<UserInformation>>(USER_PATHS.ME);

    if (response.status !== 200 || !response.data?.data?.user_id) {
      return { success: false, error: 'Không lấy được thông tin người dùng.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không lấy được thông tin người dùng.'),
      httpStatus: err.response?.status,
    };
  }
};
