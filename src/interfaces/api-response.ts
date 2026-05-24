export type IApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type IApiErrorItem = {
  type?: string;
  code?: string;
  message: string;
  param?: unknown;
};

export type IApiErrorResponse = {
  status?: number;
  message?: string;
  errors?: IApiErrorItem[];
};

export type UserApiResult<T> = {
  success: boolean;
  data?: IApiResponse<T>;
  error?: string;
  httpStatus?: number;
};
