import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL, USER_PATHS } from '@/src/config/urls';
import { ensureSessionFromStorage } from '@/src/lib/ensure_session';
import { invalidateSession, tryRefreshSession } from '@/src/lib/session_refresh';
import { useAuthStore } from '@/src/store/auth';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const SKIP_REFRESH_ON_401: string[] = [
  USER_PATHS.LOGIN_OAUTH2,
  USER_PATHS.REFRESH_TOKEN,
  USER_PATHS.LOGOUT,
];

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function shouldAttemptRefresh(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  return !SKIP_REFRESH_ON_401.some((path) => url.includes(path));
}

axiosInstance.interceptors.request.use((config) => {
  const csrfToken = useAuthStore.getState().csrfToken?.trim();
  if (csrfToken) {
    config.headers.set('X-Csrf-Token', csrfToken);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const requestUrl = config?.url ?? '';

    if (status !== 401 || !config || config._retry || !shouldAttemptRefresh(requestUrl)) {
      return Promise.reject(error);
    }

    await ensureSessionFromStorage();

    const hasSession = Boolean(useAuthStore.getState().csrfToken?.trim());
    if (!hasSession) {
      return Promise.reject(error);
    }

    config._retry = true;
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      const csrfToken = useAuthStore.getState().csrfToken?.trim();
      if (csrfToken) {
        config.headers.set('X-Csrf-Token', csrfToken);
      }
      return axiosInstance.request(config);
    }

    const restored = await ensureSessionFromStorage();
    const stillCached = Boolean(useAuthStore.getState().csrfToken?.trim());
    if (!restored && !stillCached) {
      await invalidateSession();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
export { axiosInstance };
