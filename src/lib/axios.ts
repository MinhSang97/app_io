import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL, USER_PATHS } from '@/src/config/urls';
import { ensureSessionFromStorage } from '@/src/lib/ensure_session';
import { invalidateSession, tryRefreshSession } from '@/src/lib/session_refresh';
import { useAuthStore } from '@/src/store/auth';
import { cookieStore, parseCookiesInto, persistAuthCookies } from '@/src/lib/cookie_store';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Disable native cookie jar — we handle cookies manually below
  timeout: 30000, // 30s — prevents infinite spinner when server is unreachable
});

/** Returns the current Cookie header string for use in non-Axios requests (e.g. fetch-based SSE). */
export function getCookieHeader(): string {
  return Object.entries(cookieStore)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

axiosInstance.interceptors.response.use((response) => {
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    parseCookiesInto(setCookie, cookieStore);
    persistAuthCookies(); // persist auth cookies across app reloads
  }
  return response;
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
  const cookieString = Object.entries(cookieStore)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  if (cookieString) {
    config.headers.set('Cookie', cookieString);
  }
  if (__DEV__) {
    console.log('[axios] →', config.method?.toUpperCase(), config.baseURL, config.url);
    console.log('[cookie] inject:', cookieString || '(empty)', '| csrf:', csrfToken || '(none)');
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

    let refreshed = false;
    try {
      refreshed = await tryRefreshSession();
    } catch {
      // refresh request timed out or threw — treat as expired session
      await invalidateSession();
      return Promise.reject(error);
    }

    if (refreshed) {
      await new Promise((resolve) => setTimeout(resolve, 50));

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
