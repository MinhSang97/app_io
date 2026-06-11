import type { CountryCode } from '../interfaces/auth';

export const COUNTRY_OPTIONS: Array<{ code: CountryCode; label: string }> = [
  { code: 'vn', label: 'Việt Nam' },
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'jp', label: '日本' },
  { code: 'kr', label: '대한민국' },
  { code: 'cn', label: '中国' },
  { code: 'fr', label: 'France' },
  { code: 'de', label: 'Deutschland' },
  { code: 'es', label: 'España' },
  { code: 'pt', label: 'Portugal' },
  { code: 'id', label: 'Indonesia' },
  { code: 'th', label: 'ประเทศไทย' },
];

export const DEFAULT_COUNTRY: CountryCode = 'vn';

/** BCP 47 tags for `toLocaleDateString` per country selection. */
export const DATE_LOCALE_BY_COUNTRY: Record<CountryCode, string> = {
  vn: 'vi-VN',
  us: 'en-US',
  gb: 'en-GB',
  jp: 'ja-JP',
  kr: 'ko-KR',
  cn: 'zh-CN',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
  id: 'id-ID',
  th: 'th-TH',
};
