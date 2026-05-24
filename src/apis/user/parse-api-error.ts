import type { AxiosError } from 'axios';

import type { IApiErrorResponse } from '@/src/interfaces/api-response';

export function parseApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosError<IApiErrorResponse>;
  const errorData = err.response?.data;

  if (errorData?.errors?.[0]?.message) {
    return errorData.errors[0].message;
  }

  if (typeof errorData?.message === 'string' && errorData.message) {
    return errorData.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
