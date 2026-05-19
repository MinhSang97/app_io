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
