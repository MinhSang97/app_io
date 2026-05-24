import { COUNTRY_BY_LOCALE, THEME_BY_CODE } from '@/src/constants/user_preferences';
import type { UserInformation } from '@/src/interfaces/user';
import { useAuthStore } from '@/src/store/auth';
import { useThemeStore } from '@/src/store/theme';

/** Áp locale + theme từ GET /users/me lên store local. */
export function applyUserPreferencesFromProfile(user: UserInformation): void {
  const country = COUNTRY_BY_LOCALE[user.locale];
  if (country) {
    useAuthStore.getState().setSelectedCountry(country);
  }

  const theme = THEME_BY_CODE[user.theme];
  if (theme) {
    useThemeStore.getState().setTheme(theme);
  }
}
