import '../global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../src/store/auth';
import { getPermissionSnapshot } from '../src/hooks/useMealPermissions';
import { loadPermissionGateCompleted, savePermissionGateCompleted } from '../src/lib/permissionPersistence';
import { loadSelectedCountry } from '../src/lib/countryPersistence';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const setPermissionGateCompleted = useAuthStore((state) => state.completePermissionGate);
  const permissionGateCompleted = useAuthStore((state) => state.permissionGateCompleted);
  const setSelectedCountry = useAuthStore((state) => state.setSelectedCountry);
  const hasCheckedRef = useRef(false);

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

        if (segments[0] === 'permissions' || segments[0] === 'login') {
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
    const rootSegment = segments[0];
    const inAuthGroup = rootSegment === 'login';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isSignedIn, router, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
    </>
  );
}
