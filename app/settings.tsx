import { useState } from 'react';
import { router } from 'expo-router';
import { Laptop, Moon, Sun, Check, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, InteractionManager } from 'react-native';
import { getLocale, COUNTRY_OPTIONS } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useThemeStore, ThemeType } from '../src/store/theme';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { update_user_theme, update_user_locale } from '../src/apis/user';
import { THEME_BY_TYPE, LOCALE_BY_COUNTRY } from '../src/constants/user_preferences';
import { BackHeader, radius, Screen, SectionLabel, spacing, SelectField, BottomSheet } from '@/src/ui';


export default function SettingsScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const setSelectedCountry = useAuthStore((state) => state.setSelectedCountry);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { theme, setTheme } = useThemeStore();
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  const themeOptions: { key: ThemeType; label: string; icon: LucideIcon }[] = [
    { key: 'light', label: locale.settingsPage.light, icon: Sun },
    { key: 'dark', label: locale.settingsPage.dark, icon: Moon },
    { key: 'system', label: locale.settingsPage.system, icon: Laptop },
  ];

  const handleSetTheme = (newTheme: ThemeType) => {
    // 1. Cập nhật theme ở local store lập tức để giao diện phản hồi nhanh
    setTheme(newTheme);

    // 2. Đồng bộ lên đĩa và gọi API ở background nếu đã đăng nhập
    if (isSignedIn && user) {
      const themeCode = THEME_BY_TYPE[newTheme];
      setUser({
        ...user,
        theme: themeCode,
      });

      void update_user_theme(themeCode).then((res) => {
        if (!res.success) {
          console.warn('[Settings] Failed to sync theme to backend:', res.error);
        }
      });
    }
  };

  const handleSetCountry = (newCountry: typeof selectedCountry) => {
    if (newCountry === selectedCountry) {
      return;
    }

    setSelectedCountry(newCountry);

    if (isSignedIn && user) {
      const localeCode = LOCALE_BY_COUNTRY[newCountry];
      setUser({
        ...user,
        locale: localeCode,
      });

      void update_user_locale(localeCode).then((res) => {
        if (!res.success) {
          console.warn('[Settings] Failed to sync locale to backend:', res.error);
        }
      });
    }
  };

  return (
    <>
      <Screen palette={palette}>
        <BackHeader palette={palette} title={locale.settingsPage.title} onBack={() => router.back()} />

        <SectionLabel palette={palette} label={locale.settingsPage.themeSection} />

        <View style={styles.options}>
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.key;

            return (
              <Pressable
                key={opt.key}
                onPress={() => handleSetTheme(opt.key)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: isSelected ? palette.accentSoft : palette.cardBg,
                    borderColor: isSelected ? palette.accent : palette.border,
                  },

                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.optionLeft}>
                  <Icon size={20} color={isSelected ? palette.accent : palette.muted} />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? palette.accentText : palette.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={[styles.dot, { backgroundColor: palette.accent }]} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.options}>
          <SelectField
            palette={palette}
            label={locale.settingsPage.languageSection}
            value={locale.login.countryOptions[selectedCountry]}
            onPress={() => setCountryPickerOpen(true)}
          />
        </View>
      </Screen>

      <BottomSheet
        visible={countryPickerOpen}
        palette={palette}
        title={locale.settingsPage.languageSection}
        onClose={() => setCountryPickerOpen(false)}
      >
        {COUNTRY_OPTIONS.map((item) => (
          <Pressable
            key={item.code}
            onPress={() => {
              setCountryPickerOpen(false);
              if (item.code === selectedCountry) {
                return;
              }
              InteractionManager.runAfterInteractions(() => {
                handleSetCountry(item.code);
              });
            }}
            style={({ pressed }) => [
              styles.countryOption,
              { backgroundColor: palette.cardBg, borderColor: palette.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.countryOptionText, { color: palette.text }]}>{item.label}</Text>
            {selectedCountry === item.code ? <Check size={18} color={palette.accent} /> : null}
          </Pressable>
        ))}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  option: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.9,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  countryOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
