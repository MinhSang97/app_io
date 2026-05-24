const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV?.trim().toLowerCase() ?? '';

export function isDevelopmentEnv(): boolean {
  if (APP_ENV === 'development' || APP_ENV === 'dev') {
    return true;
  }
  if (APP_ENV === 'production' || APP_ENV === 'prod') {
    return false;
  }
  return __DEV__;
}

export function devLog(...args: unknown[]): void {
  if (isDevelopmentEnv()) {
    console.log(...args);
  }
}

export function devWarn(...args: unknown[]): void {
  if (isDevelopmentEnv()) {
    console.warn(...args);
  }
}

export function devError(...args: unknown[]): void {
  if (isDevelopmentEnv()) {
    console.error(...args);
  }
}
