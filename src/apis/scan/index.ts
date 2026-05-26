import type { AxiosError } from 'axios';

import { SCAN_PATHS } from '@/src/config/urls';
import type { IApiResponse, UserApiResult } from '@/src/interfaces/api-response';
import type { Scan } from '@/src/interfaces/scan';
import axiosInstance from '@/src/lib/axios';

import { parseApiErrorMessage } from '../user/parse-api-error';

export type CreateScanParams = {
  images: {
    uri: string;
    name: string;
    type: string;
  }[];
};

export const createScan = async (params: CreateScanParams): Promise<UserApiResult<Scan>> => {
  try {
    const formData = new FormData();
    params.images.forEach((img) => {
      // In React Native, FormData accepts an object with uri, name, type for files
      formData.append('images[]', img as any);
    });

    const response = await axiosInstance.post<IApiResponse<Scan>>(
      SCAN_PATHS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status !== 200 || !response.data?.data?.id) {
      return { success: false, error: 'Không thể phân tích món ăn.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể phân tích món ăn.'),
      httpStatus: err.response?.status,
    };
  }
};

export type ListScansParams = {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
  from_date?: string;
  to_date?: string;
};

export const listScans = async (params?: ListScansParams): Promise<UserApiResult<Scan[]>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<Scan[]>>(SCAN_PATHS.LIST, {
      params,
    });

    if (response.status !== 200) {
      return { success: false, error: 'Không thể tải lịch sử quét.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải lịch sử quét.'),
      httpStatus: err.response?.status,
    };
  }
};

export const getScan = async (id: string): Promise<UserApiResult<Scan>> => {
  try {
    const response = await axiosInstance.get<IApiResponse<Scan>>(`${SCAN_PATHS.GET}/${id}`);

    if (response.status !== 200 || !response.data?.data?.id) {
      return { success: false, error: 'Không thể tải chi tiết quét.' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      error: parseApiErrorMessage(err, 'Không thể tải chi tiết quét.'),
      httpStatus: err.response?.status,
    };
  }
};
