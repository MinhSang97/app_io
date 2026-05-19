import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { ChevronDown, ShieldCheck, Sparkles, Brain, Droplets, Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getLocale, COUNTRY_OPTIONS } from '../src/lib/localization';
import { useAuthStore, CountryCode } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/useAppTheme';

const appleButtonText: Record<CountryCode, string> = {
  vn: 'Đăng nhập bằng Apple',
  us: 'Sign in with Apple',
  gb: 'Sign in with Apple',
  jp: 'Appleでサインイン',
  kr: 'Apple로 로그인',
  cn: '通过 Apple 登录',
  fr: 'Se connecter avec Apple',
  de: 'Mit Apple anmelden',
  es: 'Iniciar sesión con Apple',
  pt: 'Iniciar sessão com a Apple',
  id: 'Masuk dengan Apple',
  th: 'ลงชื่อเข้าใช้ด้วย Apple',
};

export default function LoginScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const setSelectedCountry = useAuthStore((state) => state.setSelectedCountry);
  const signInWithApple = useAuthStore((state) => state.signInWithApple);
  const { colors, isDark } = useAppTheme();
  const locale = getLocale(selectedCountry);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  const benefits = useMemo(() => {
    const icons = [Sparkles, Brain, Droplets];
    return locale.login.benefits.map((item, index) => ({ ...item, icon: icons[index] }));
  }, [locale]);

  const handleAppleSignIn = async () => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        Alert.alert(locale.login.appleUnavailableTitle, locale.login.appleUnavailableMessage);
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const fullName = credential.fullName
        ? `${credential.fullName.givenName ?? ''} ${credential.fullName.familyName ?? ''}`.trim() || null
        : null;

      signInWithApple({
        userId: credential.user,
        fullName,
        email: credential.email,
      });

      router.replace('/scan');
    } catch (error) {
      if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      Alert.alert(locale.login.loginFailedTitle, locale.login.loginFailedMessage);
    }
  };

  return (
    <ScrollView className={`flex-1 px-6 pt-16 ${colors.bg}`}>
      <View className={`rounded-[36px] border p-6 ${colors.card}`}>
        <View className={`h-14 w-14 items-center justify-center rounded-2xl ${isDark ? 'bg-emerald-400/15' : 'bg-emerald-500/10'}`}>
          <ShieldCheck size={28} color={isDark ? '#34d399' : '#059669'} />
        </View>

        <Text className={`mt-6 text-sm uppercase tracking-[0.35em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{locale.login.welcome}</Text>
        <Text className={`mt-3 text-4xl font-bold ${colors.text}`}>{locale.login.title}</Text>
        <Text className={`mt-3 text-base leading-6 ${colors.subText}`}>{locale.login.description}</Text>

        <View className="mt-5">
          <Text className={`mb-2 text-xs font-semibold uppercase tracking-[0.28em] ${colors.subText}`}>
            {locale.login.countryLabel}
          </Text>
          <Pressable
            onPress={() => setCountryPickerOpen(true)}
            className={`flex-row items-center justify-between rounded-2xl border px-4 py-4 ${colors.rowBg} ${colors.borderOnly}`}
          >
            <Text className={`text-base font-semibold ${colors.text}`}>{locale.login.countryOptions[selectedCountry]}</Text>
            <ChevronDown size={18} color={isDark ? '#d4d4d8' : '#71717a'} />
          </Pressable>
        </View>

        <View className="mt-6 gap-3">
          {benefits.map((item) => {
            const Icon = item.icon!;
            return (
              <View key={item.title} className={`flex-row items-start gap-3 rounded-2xl p-4 ${colors.rowBg}`}>
                <View className={`rounded-2xl p-2.5 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`}>
                  <Icon size={18} color={isDark ? '#34d399' : '#059669'} />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold ${colors.text}`}>{item.title}</Text>
                  <Text className={`mt-1 leading-5 ${colors.subText}`}>{item.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="mt-8">
          <Pressable
            onPress={handleAppleSignIn}
            style={{ width: '100%', height: 56, borderRadius: 28 }}
            className={`flex-row items-center justify-center gap-2.5 ${isDark ? 'bg-white active:bg-zinc-200' : 'bg-zinc-950 active:bg-zinc-800'}`}
          >
            <Svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#000' : '#fff'}>
              <Path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </Svg>
            <Text className={`text-xl font-bold tracking-wide ${isDark ? 'text-black' : 'text-white'}`} style={{ fontFamily: 'System' }}>
              {appleButtonText[selectedCountry] || 'Sign in with Apple'}
            </Text>
          </Pressable>
        </View>

        <Text className={`mt-4 text-center text-xs leading-5 ${colors.subText}`}>{locale.login.footer}</Text>
      </View>

      <Modal
        visible={countryPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCountryPickerOpen(false)}
      >
        <Pressable className="flex-1 bg-black/60 px-5 justify-end" onPress={() => setCountryPickerOpen(false)}>
          <Pressable className={`rounded-t-[28px] px-5 pb-8 pt-4 ${colors.bg}`} onPress={() => {}}>
            <View className={`mx-auto mb-3 h-1.5 w-14 rounded-full ${isDark ? 'bg-white/15' : 'bg-black/15'}`} />
            <Text className={`mb-4 text-lg font-bold ${colors.text}`}>{locale.login.countryLabel}</Text>
            <View className="gap-2">
              {COUNTRY_OPTIONS.map((item) => (
                <Pressable
                  key={item.code}
                  onPress={() => {
                    setSelectedCountry(item.code);
                    setCountryPickerOpen(false);
                  }}
                  className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${colors.rowBg}`}
                >
                  <Text className={`text-base font-medium ${colors.text}`}>{item.label}</Text>
                  {selectedCountry === item.code ? <Check size={18} color={isDark ? '#34d399' : '#059669'} /> : null}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
