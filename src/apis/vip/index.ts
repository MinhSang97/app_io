import type { AxiosError } from 'axios';

import { VIP_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { VIPRank, VIPReward, VIPRedemption, RedeemRewardResult } from '@/src/interfaces/vip';
import axiosInstance from '@/src/lib/axios';
import { parseApiErrorMessage } from '@/src/apis/user/parse-api-error';

export const listVipRanks = async (): Promise<UserApiResult<VIPRank[]>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<VIPRank[]>>(VIP_PATHS.RANKS);

    if (response.status !== 200) {
      return { success: false, error: 'Không thể tải danh sách thứ hạng VIP.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải danh sách thứ hạng VIP.'),
      httpStatus: err.response?.status,
    };
  }
};

export const listVipRewards = async (): Promise<UserApiResult<VIPReward[]>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<VIPReward[]>>(VIP_PATHS.REWARDS);

    if (response.status !== 200) {
      return { success: false, error: 'Không thể tải danh sách phần thưởng VIP.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải danh sách phần thưởng VIP.'),
      httpStatus: err.response?.status,
    };
  }
};

export const redeemVipReward = async (
  rewardId: number
): Promise<UserApiResult<RedeemRewardResult>> => {
  try {
    const response = await axiosInstance.post<IApiResponse<RedeemRewardResult>>(
      VIP_PATHS.REDEEM,
      { reward_id: rewardId }
    );

    if (response.status !== 200 || !response.data?.data?.redemption_id) {
      return { success: false, error: 'Đổi phần thưởng thất bại.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Đổi phần thưởng thất bại.'),
      httpStatus: err.response?.status,
    };
  }
};

export const listVipRedemptionHistory = async (): Promise<UserApiResult<VIPRedemption[]>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<VIPRedemption[]>>(VIP_PATHS.HISTORY);

    if (response.status !== 200) {
      return { success: false, error: 'Không thể tải lịch sử đổi quà.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải lịch sử đổi quà.'),
      httpStatus: err.response?.status,
    };
  }
};
