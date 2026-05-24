import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { UserInformation } from '@/src/interfaces/user';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

export type SearchUserParams = {
  email: string;
};

export const search_user = async ({
  email,
}: SearchUserParams): Promise<UserApiResult<UserInformation>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<UserInformation>>(USER_PATHS.SEARCH_USER, {
      params: { email },
    });

    if (response.status !== 200 || !response.data?.data?.user_id) {
      return { success: false, error: 'Không tìm thấy người dùng.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Tìm kiếm người dùng thất bại.'),
    };
  }
};
