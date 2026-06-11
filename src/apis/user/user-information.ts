import type { AxiosError } from 'axios';

import { USER_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { UserInformation } from '@/src/interfaces/user';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from './parse-api-error';

export const get_user_information = async (): Promise<UserApiResult<UserInformation>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<any>>(USER_PATHS.ME);

    if (response.status !== 200 || !response.data?.data?.user_id) {
      return { success: false, error: 'Không lấy được thông tin người dùng.' };
    }

    const raw = response.data.data;
    const flattened: UserInformation = {
      user_id: raw.user_id,
      username: raw.username,
      phone_number: raw.phone_number,
      email: raw.email,
      avatar_link: raw.avatar_link,
      locale: raw.locale,
      theme: raw.theme,
      role: raw.role,
      subscription_tier: raw.subscription?.subscription_tier,
      subscription_expires_at: raw.subscription?.subscription_expires_at,
      vip_points_earned: raw.vip?.vip_points_earned,
      vip_points_balance: raw.vip?.vip_points_balance,
      vip_rank: raw.vip?.vip_rank,
    };

    return {
      success: true,
      data: {
        ...response.data,
        data: flattened,
      },
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không lấy được thông tin người dùng.'),
      httpStatus: err.response?.status,
    };
  }
};
