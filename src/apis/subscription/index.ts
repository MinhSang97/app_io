import type { AxiosError } from 'axios';

import { SUBSCRIPTION_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { SubscriptionPlan, PurchaseSubscriptionParams, PurchaseSubscriptionResult } from '@/src/interfaces/subscription';
import axiosInstance from '@/src/lib/axios';
import { parseApiErrorMessage } from '@/src/apis/user/parse-api-error';

export const listPlans = async (): Promise<UserApiResult<SubscriptionPlan[]>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<SubscriptionPlan[]>>(
      SUBSCRIPTION_PATHS.PLANS
    );

    if (response.status !== 200) {
      return { success: false, error: 'Không thể tải danh sách gói dịch vụ.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải danh sách gói dịch vụ.'),
      httpStatus: err.response?.status,
    };
  }
};

export const purchaseSubscription = async (
  params: PurchaseSubscriptionParams
): Promise<UserApiResult<PurchaseSubscriptionResult>> => {
  try {
    const response = await axiosInstance.post<IApiResponse<any>>(
      SUBSCRIPTION_PATHS.PURCHASE,
      params
    );

    if (response.status !== 200 || !response.data?.data?.id) {
      return { success: false, error: 'Giao dịch nâng cấp thất bại.' };
    }

    const raw = response.data.data;
    const mappedResult: PurchaseSubscriptionResult = {
      subscription_id: raw.id,
      subscription_tier: raw.plan_code,
      expires_at: raw.end_date,
      vip_points_added: raw.vip_points_reward,
    };

    return {
      success: true,
      data: {
        ...response.data,
        data: mappedResult,
      },
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Giao dịch nâng cấp thất bại.'),
      httpStatus: err.response?.status,
    };
  }
};
