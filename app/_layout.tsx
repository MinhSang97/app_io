import 'react-native-gesture-handler';

import '../global.css';

import { hasAuthSessionOnDisk } from '../src/lib/auth_persistence';
import { restoreSessionSync } from '../src/lib/restore_session_sync';

// Đọc io.authSession trước render — survive reboot / force-close.
restoreSessionSync();

import * as WebBrowser from 'expo-web-browser';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/auth';
import { getPermissionSnapshot } from '../src/hooks/use_meal_permissions';
import { loadPermissionGateCompleted, savePermissionGateCompleted } from '../src/lib/permission_persistence';
import { loadSelectedCountry } from '../src/lib/country_persistence';
import { bootstrapSession } from '../src/lib/bootstrap_session';
import { ensureSessionFromStorage } from '../src/lib/ensure_session';
import { flushAuthSessionToDisk } from '../src/lib/flush_auth_session';
import { useAuthHydrated } from '../src/hooks/use_auth_hydrated';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

void SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isSessionRestoring = useAuthStore((state) => state.isSessionRestoring);
  const setPermissionGateCompleted = useAuthStore((state) => state.completePermissionGate);
  const permissionGateCompleted = useAuthStore((state) => state.permissionGateCompleted);
  const setSelectedCountry = useAuthStore((state) => state.setSelectedCountry);
  const hasCheckedRef = useRef(false);
  const authHydrated = useAuthHydrated();
  const { isDark, palette } = useAppTheme();

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  useEffect(() => {
    void bootstrapSession();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (authHydrated && !isSessionRestoring) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [authHydrated, isSessionRestoring]);

  useEffect(() => {
    if (authHydrated && !isSessionRestoring) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [authHydrated, isSessionRestoring]);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void ensureSessionFromStorage();
        return;
      }
      if (nextState === 'background' || nextState === 'inactive') {
        flushAuthSessionToDisk();
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const savedCountry = await loadSelectedCountry();
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    })();
  }, [setSelectedCountry]);

  useEffect(() => {
    if (!isSignedIn) {
      hasCheckedRef.current = false;
      return;
    }

    let alive = true;

    (async () => {
      const savedGateCompleted = await loadPermissionGateCompleted();
      if (savedGateCompleted) {
        setPermissionGateCompleted();
      }

      const snapshot = await getPermissionSnapshot();
      const hasAllPermissions = snapshot.cameraGranted && snapshot.mediaGranted;

      if (!alive) return;

      if (hasAllPermissions) {
        if (!savedGateCompleted) {
          setPermissionGateCompleted();
          void savePermissionGateCompleted(true);
        }

        const root = segments[0];
        if (root === 'permissions' || root === 'login' || root === 'index' || root === undefined) {
          router.replace('/scan');
        }
        hasCheckedRef.current = true;
        return;
      }

      if (segments[0] !== 'permissions') {
        router.replace('/permissions');
      }
      hasCheckedRef.current = true;
    })();

    return () => {
      alive = false;
    };
  }, [isSignedIn, permissionGateCompleted, router, segments, setPermissionGateCompleted]);

  useEffect(() => {
    if (!authHydrated || isSessionRestoring) {
      return;
    }

    if (isSignedIn || hasAuthSessionOnDisk()) {
      if (!isSignedIn && hasAuthSessionOnDisk()) {
        restoreSessionSync();
      }
      return;
    }

    const root = segments[0];
    const onLoginScreen = root === 'login' || root === 'index' || root === undefined;
    if (onLoginScreen) {
      return;
    }

    router.replace('/');
  }, [authHydrated, isSignedIn, isSessionRestoring, router, segments]);

  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: palette.accent,
      background: palette.screenBg,
      card: palette.cardBg,
      text: palette.text,
      border: palette.border,
      notification: palette.accent,
    },
  };


  if (!authHydrated || isSessionRestoring) {
    return (
      <ThemeProvider value={navigationTheme}>
        <View style={{ flex: 1, backgroundColor: palette.screenBg }} onLayout={onLayoutRootView}>
          <SafeAreaProvider>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.screenBg }}>
              <ActivityIndicator size="large" color={palette.accent} />
            </View>
          </SafeAreaProvider>
        </View>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: palette.screenBg }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
        </SafeAreaProvider>
      </View>
    </ThemeProvider>
  );
}
