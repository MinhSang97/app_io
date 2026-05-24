export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export type AppPalette = {
  screenBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  subText: string;
  muted: string;
  rowBg: string;
  border: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  googleBtnBg: string;
  googleBtnBorder: string;
  appleBtnBg: string;
  appleBtnText: string;
  primaryBtnBg: string;
  primaryBtnText: string;
  dangerSoft: string;
  danger: string;
  overlay: string;
  shadow: string;
};

export function getAppPalette(isDark: boolean): AppPalette {
  if (isDark) {
    return {
      screenBg: '#09090b',
      cardBg: '#141416',
      cardBorder: 'rgba(255,255,255,0.08)',
      text: '#fafafa',
      subText: '#a1a1aa',
      muted: '#71717a',
      rowBg: '#1c1c1f',
      border: 'rgba(255,255,255,0.1)',
      accent: '#34d399',
      accentSoft: 'rgba(52,211,153,0.14)',
      accentText: '#6ee7b7',
      googleBtnBg: '#1c1c1f',
      googleBtnBorder: 'rgba(255,255,255,0.12)',
      appleBtnBg: '#fafafa',
      appleBtnText: '#09090b',
      primaryBtnBg: '#34d399',
      primaryBtnText: '#052e1c',
      dangerSoft: 'rgba(248,113,113,0.12)',
      danger: '#f87171',
      overlay: 'rgba(0,0,0,0.65)',
      shadow: '#000000',
    };
  }

  return {
    screenBg: '#f4f4f5',
    cardBg: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.06)',
    text: '#18181b',
    subText: '#52525b',
    muted: '#71717a',
    rowBg: '#f4f4f5',
    border: 'rgba(0,0,0,0.08)',
    accent: '#059669',
    accentSoft: 'rgba(5,150,105,0.1)',
    accentText: '#047857',
    googleBtnBg: '#ffffff',
    googleBtnBorder: 'rgba(0,0,0,0.1)',
    appleBtnBg: '#18181b',
    appleBtnText: '#ffffff',
    primaryBtnBg: '#059669',
    primaryBtnText: '#ffffff',
    dangerSoft: 'rgba(239,68,68,0.08)',
    danger: '#dc2626',
    overlay: 'rgba(0,0,0,0.45)',
    shadow: '#000000',
  };
}
