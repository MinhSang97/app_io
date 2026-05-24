import { useColorScheme } from 'react-native';
import { getAppPalette } from '@/src/ui';
import { useThemeStore } from '../store/theme';

export function useAppTheme() {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const selectedTheme = useThemeStore((state) => state.theme);

  const activeScheme = selectedTheme === 'system' 
    ? (systemScheme ?? 'dark') 
    : selectedTheme;

  const isDark = activeScheme === 'dark';
  const palette = getAppPalette(isDark);

  return {
    theme: selectedTheme,
    isDark,
    palette,
    colors: {
      bg: isDark ? 'bg-zinc-950' : 'bg-zinc-50',
      card: isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10',
      text: isDark ? 'text-white' : 'text-zinc-900',
      subText: isDark ? 'text-zinc-400' : 'text-zinc-600',
      border: isDark ? 'border-white/10' : 'border-black/10',
      borderOnly: isDark ? 'border-white/5' : 'border-black/5',
      iconContainer: isDark ? 'bg-zinc-800' : 'bg-zinc-200',
      iconColor: isDark ? '#a1a1aa' : '#71717a',
      emeraldBg: isDark ? 'bg-emerald-400/10 border-emerald-400/20' : 'bg-emerald-500/10 border-emerald-500/20',
      emeraldText: isDark ? 'text-emerald-400' : 'text-emerald-600',
      buttonBg: isDark ? 'bg-emerald-400' : 'bg-emerald-500',
      buttonText: isDark ? 'text-zinc-950' : 'text-white',
      rowBg: isDark ? 'bg-zinc-900' : 'bg-zinc-100',
      closeButtonBg: isDark ? 'bg-white/5 active:bg-white/10' : 'bg-black/5 active:bg-black/10',
    }
  };
}
