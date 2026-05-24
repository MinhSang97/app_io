import * as AppleAuthentication from 'expo-apple-authentication';
import { Redirect, router } from 'expo-router';
import { Brain, Check, Droplets, ShieldCheck, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getLocale, COUNTRY_OPTIONS } from '../src/lib/localization';
import { useAuthStore, CountryCode } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { getDeviceID } from '../src/lib/device_id';
import { invalidateSession } from '../src/lib/session_refresh';
import { oauthUserToUserInformation } from '../src/lib/session_refresh';
import { saveAuthSessionSync } from '../src/lib/auth_persistence';
import { syncUserProfileFromServer } from '../src/lib/user_profile';
import { tryLoginWithApple, tryLoginWithGoogle } from '../src/lib/auth_api';
import { update_user_locale } from '../src/apis/user';
import { LOCALE_BY_COUNTRY } from '../src/constants/user_preferences';
import { devLog, devWarn } from '../src/lib/dev_log';
import { getOAuthErrorMessage } from '../src/lib/oauth_errors';
import type { OAuthLoginUser } from '../src/interfaces/oauth';
import {
  AuthDivider,
  BottomSheet,
  FeaturePill,
  OAuthButton,
  Screen,
  ScreenHeader,
  SelectField,
  spacing,
} from '@/src/ui';

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

function GoogleIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
      <Path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </Svg>
  );
}

export default function LoginScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const setSelectedCountry = useAuthStore((state) => state.setSelectedCountry);
  const setSession = useAuthStore((state) => state.setSession);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const permissionGateCompleted = useAuthStore((state) => state.permissionGateCompleted);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = useMemo(() => {
    const icons = [Sparkles, Brain, Droplets];
    return locale.login.benefits.map((item, index) => ({ ...item, icon: icons[index] }));
  }, [locale]);

  if (isSignedIn) {
    return <Redirect href={permissionGateCompleted ? "/scan" : "/permissions"} />;
  }

  const finishSignIn = async (
    loginUser: OAuthLoginUser,
    fallback: { fullName: string | null; email: string | null },
  ): Promise<boolean> => {
    const userID = loginUser?.user_id?.trim();
    const csrfToken = loginUser?.csrf_token?.trim();
    if (!userID || !csrfToken) {
      Alert.alert(locale.login.loginFailedTitle, locale.login.loginFailedMessage);
      return false;
    }

    const user = oauthUserToUserInformation({
      ...loginUser,
      username: (loginUser.username ?? '').trim() || fallback.fullName || loginUser.username,
      email: loginUser.email || fallback.email || '',
    });
    setSession({ user, csrfToken });

    const previousSelectedCountry = selectedCountry;

    const profile = await syncUserProfileFromServer({ force: true });
    if (!profile.ok) {
      await invalidateSession();
      Alert.alert(locale.login.loginFailedTitle, locale.login.loginFailedMessage);
      return false;
    }

    // Nếu locale trên backend khác với quốc gia người dùng chọn trước khi đăng nhập, đồng bộ lên backend
    const currentBackendLocale = profile.user.locale;
    const targetLocaleCode = LOCALE_BY_COUNTRY[previousSelectedCountry];
    if (currentBackendLocale !== targetLocaleCode) {
      const res = await update_user_locale(targetLocaleCode);
      if (res.success) {
        const state = useAuthStore.getState();
        if (state.user) {
          const updatedUser = { ...state.user, locale: targetLocaleCode };
          state.setUser(updatedUser);
          state.setSelectedCountry(previousSelectedCountry);
        }
      } else {
        console.warn('[Login] Failed to sync locale to backend:', res.error);
      }
    }

    const state = useAuthStore.getState();
    if (state.csrfToken?.trim() && state.user?.user_id?.trim()) {
      saveAuthSessionSync({ csrfToken: state.csrfToken.trim(), user: state.user });
    }

    router.replace('/scan');
    return true;

  };

  const handleGoogleSignIn = () => {
    if (isSubmitting) return;

    void (async () => {
      setIsSubmitting(true);
      try {
        devLog('[Login] Google sign-in started');
        const deviceID = await getDeviceID();
        const outcome = await tryLoginWithGoogle(deviceID);
        if (!outcome.ok) {
          if (outcome.cancelled) {
            devLog('[Login] Google sign-in cancelled');
            return;
          }
          Alert.alert(locale.login.loginFailedTitle, outcome.message);
          return;
        }
        await finishSignIn(outcome.user, {
          fullName: (outcome.user.username ?? '').trim() || null,
          email: outcome.user.email || null,
        });
      } catch (error) {
        devWarn('[Login] Google sign-in unexpected error:', getOAuthErrorMessage(error, locale.login.loginFailedMessage));
        Alert.alert(
          locale.login.loginFailedTitle,
          getOAuthErrorMessage(error, locale.login.loginFailedMessage),
        );
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleAppleSignIn = () => {
    if (isSubmitting) return;

    void (async () => {
      setIsSubmitting(true);
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

        devLog('[Apple Sign In] credential:', JSON.stringify(credential, null, 2));

        const deviceID = await getDeviceID();
        const outcome = await tryLoginWithApple(credential, deviceID);
        if (!outcome.ok) {
          if (outcome.cancelled) {
            devLog('[Login] Apple sign-in cancelled');
            return;
          }
          Alert.alert(locale.login.loginFailedTitle, outcome.message);
          return;
        }

        const fullName = credential.fullName
          ? `${credential.fullName.givenName ?? ''} ${credential.fullName.familyName ?? ''}`.trim() || null
          : (outcome.user.username ?? '').trim() || null;

        await finishSignIn(outcome.user, { fullName, email: outcome.user.email || credential.email });
      } catch (error) {
        if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') {
          devLog('[Login] Apple sign-in cancelled');
          return;
        }
        devWarn(
          '[Login] Apple sign-in unexpected error:',
          getOAuthErrorMessage(error, locale.login.loginFailedMessage),
        );
        Alert.alert(
          locale.login.loginFailedTitle,
          getOAuthErrorMessage(error, locale.login.loginFailedMessage),
        );
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const authFooter = (
    <View style={styles.footerInner}>
      <OAuthButton
        palette={palette}
        variant="google"
        label={locale.login.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isSubmitting}
        icon={<GoogleIcon />}
      />
      <AuthDivider label={locale.login.or} palette={palette} />
      <OAuthButton
        palette={palette}
        variant="apple"
        label={appleButtonText[selectedCountry] || 'Sign in with Apple'}
        onPress={handleAppleSignIn}
        disabled={isSubmitting}
        icon={<AppleIcon color={palette.appleBtnText} />}
      />
      <Text style={[styles.footerNote, { color: palette.muted }]}>{locale.login.footer}</Text>
    </View>
  );

  return (
    <>
      <Screen palette={palette} footer={authFooter}>
        <ScreenHeader
          palette={palette}
          eyebrow={locale.login.welcome}
          title={locale.login.title}
          description={locale.login.description}
          right={
            <View style={[styles.brandIcon, { backgroundColor: palette.accentSoft }]}>
              <ShieldCheck size={26} color={palette.accent} />
            </View>
          }
        />

        <SelectField
          palette={palette}
          label={locale.login.countryLabel}
          value={locale.login.countryOptions[selectedCountry]}
          onPress={() => setCountryPickerOpen(true)}
        />

        <View style={styles.featuresRow}>
          {benefits.map((item) => (
            <FeaturePill key={item.title} palette={palette} icon={item.icon!} title={item.title} />
          ))}
        </View>

        <View style={[styles.hintCard, { backgroundColor: palette.accentSoft, borderColor: palette.border }]}>
          <Text style={[styles.hintText, { color: palette.accentText }]}>
            {benefits[0]?.description}
          </Text>
        </View>
      </Screen>

      <BottomSheet
        visible={countryPickerOpen}
        palette={palette}
        title={locale.login.countryLabel}
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
                setSelectedCountry(item.code);
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
  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hintCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  hintText: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerInner: {
    gap: spacing.sm,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.xs,
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
  pressed: {
    opacity: 0.9,
  },
});
