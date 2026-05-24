import axios from 'axios';

type ApiErrorBody = {
  message?: string;
  error?: string;
  msg?: string;
};

export function getOAuthErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Không kết nối được server. Kiểm tra EXPO_PUBLIC_API_URL và mạng.';
    }

    const body = error.response.data as ApiErrorBody | string | undefined;
    const serverMessage =
      typeof body === 'string'
        ? body
        : body?.message ?? body?.error ?? body?.msg;

    if (error.response.status >= 500) {
      return serverMessage ?? 'Lỗi server. Vui lòng thử lại sau.';
    }

    return serverMessage ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
