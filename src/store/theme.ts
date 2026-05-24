import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMmkvStateStorage, appMmkv } from '../lib/mmkv_storage';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

function getInitialThemeSync(): ThemeType {
  try {
    const raw = appMmkv.getString('theme-storage');
    console.log('[ThemeInit] Raw MMKV theme-storage:', raw);
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log('[ThemeInit] Parsed theme-storage:', parsed);
      if (parsed?.state?.theme) {
        console.log('[ThemeInit] Resolved theme:', parsed.state.theme);
        return parsed.state.theme;
      }
    }
  } catch (err) {
    console.error('[ThemeInit] Error reading theme:', err);
  }
  console.log('[ThemeInit] Fallback theme: system');
  return 'system';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getInitialThemeSync(),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => createMmkvStateStorage()),
    }
  )
);
