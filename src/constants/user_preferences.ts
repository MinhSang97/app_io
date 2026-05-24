import type { CountryCode } from '../interfaces/auth';
import type { ThemeType } from '../store/theme';

/** Khớp entity.Locale trên backend (1=vn … 12=th). */
export const LOCALE_BY_COUNTRY: Record<CountryCode, number> = {
  vn: 1,
  us: 2,
  gb: 3,
  jp: 4,
  kr: 5,
  cn: 6,
  fr: 7,
  de: 8,
  es: 9,
  pt: 10,
  id: 11,
  th: 12,
};

/** Khớp entity.Theme trên backend (1=light, 2=dark, 3=system). */
export const THEME_BY_TYPE: Record<ThemeType, number> = {
  light: 1,
  dark: 2,
  system: 3,
};

const COUNTRY_BY_LOCALE_ENTRIES = Object.entries(LOCALE_BY_COUNTRY) as [CountryCode, number][];

/** Map locale code từ /users/me → CountryCode. */
export const COUNTRY_BY_LOCALE: Record<number, CountryCode> = COUNTRY_BY_LOCALE_ENTRIES.reduce(
  (acc, [country, code]) => {
    acc[code] = country;
    return acc;
  },
  {} as Record<number, CountryCode>,
);

const THEME_BY_CODE_ENTRIES = Object.entries(THEME_BY_TYPE) as [ThemeType, number][];

/** Map theme code từ /users/me → ThemeType. */
export const THEME_BY_CODE: Record<number, ThemeType> = THEME_BY_CODE_ENTRIES.reduce(
  (acc, [type, code]) => {
    acc[code] = type;
    return acc;
  },
  {} as Record<number, ThemeType>,
);
