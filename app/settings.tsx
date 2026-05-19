import { router } from 'expo-router';
import { ArrowLeft, Sun, Moon, Laptop } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useThemeStore, ThemeType } from '../src/store/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';

export default function SettingsScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const { theme, setTheme } = useThemeStore();
  const { colors, isDark } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const themeOptions: { key: ThemeType; label: string; icon: any }[] = [
    { key: 'light', label: locale.settingsPage.light, icon: Sun },
    { key: 'dark', label: locale.settingsPage.dark, icon: Moon },
    { key: 'system', label: locale.settingsPage.system, icon: Laptop },
  ];

  return (
    <View className={`flex-1 px-6 pt-16 ${colors.bg}`}>
      {/* Header */}
      <View className="flex-row items-center gap-4 mb-8">
        <Pressable 
          onPress={() => router.back()} 
          className={`rounded-full p-3 border active:opacity-75 ${colors.closeButtonBg} ${colors.border}`}
        >
          <ArrowLeft size={20} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className={`text-2xl font-bold ${colors.text}`}>{locale.settingsPage.title}</Text>
      </View>

      {/* Theme Section */}
      <Text className={`text-sm font-semibold uppercase tracking-wider mb-4 ${colors.subText}`}>
        {locale.settingsPage.themeSection}
      </Text>

      <View className="gap-3">
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setTheme(opt.key)}
              className={`flex-row items-center justify-between px-5 py-4 rounded-2xl border ${
                isSelected 
                  ? (isDark ? 'bg-emerald-400/10 border-emerald-400' : 'bg-emerald-50 border-emerald-500')
                  : `${colors.rowBg} ${colors.borderOnly}`
              }`}
            >
              <View className="flex-row items-center gap-4">
                <Icon size={20} color={isSelected ? (isDark ? '#34d399' : '#059669') : (isDark ? '#a1a1aa' : '#4b5563')} />
                <Text className={`text-base font-semibold ${
                  isSelected 
                    ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                    : colors.text
                }`}>
                  {opt.label}
                </Text>
              </View>
              {isSelected && (
                <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
