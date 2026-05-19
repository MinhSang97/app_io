import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export type MealPermissionsState = {
  cameraGranted: boolean;
  mediaGranted: boolean;
  canAskAgain: boolean;
};

const INITIAL_PERMISSIONS: MealPermissionsState = {
  cameraGranted: false,
  mediaGranted: false,
  canAskAgain: true,
};

function isSamePermissions(a: MealPermissionsState, b: MealPermissionsState) {
  return a.cameraGranted === b.cameraGranted && a.mediaGranted === b.mediaGranted && a.canAskAgain === b.canAskAgain;
}

export async function getPermissionSnapshot(): Promise<MealPermissionsState> {
  const [cameraPermission, mediaPermission] = await Promise.all([
    Camera.getCameraPermissionsAsync(),
    ImagePicker.getMediaLibraryPermissionsAsync(),
  ]);

  return {
    cameraGranted: cameraPermission.status === 'granted',
    mediaGranted: mediaPermission.status === 'granted',
    canAskAgain: cameraPermission.canAskAgain || mediaPermission.canAskAgain,
  };
}

async function requestPermissions(): Promise<MealPermissionsState> {
  const [cameraPermission, mediaPermission] = await Promise.all([
    Camera.requestCameraPermissionsAsync(),
    ImagePicker.requestMediaLibraryPermissionsAsync(),
  ]);

  return {
    cameraGranted: cameraPermission.status === 'granted',
    mediaGranted: mediaPermission.status === 'granted',
    canAskAgain: cameraPermission.canAskAgain || mediaPermission.canAskAgain,
  };
}

export function useMealPermissions() {
  const [permissions, setPermissions] = useState<MealPermissionsState>(INITIAL_PERMISSIONS);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const syncPermissions = useCallback(async () => {
    setChecking(true);
    setLoading(true);
    try {
      const snapshot = await getPermissionSnapshot();
      setPermissions((current) => (isSamePermissions(current, snapshot) ? current : snapshot));
      return snapshot;
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  const ensurePermissions = useCallback(async () => {
    setChecking(true);
    setLoading(true);
    try {
      const result = await requestPermissions();
      setPermissions((current) => (isSamePermissions(current, result) ? current : result));
      return result;
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  return {
    permissions,
    loading,
    checking,
    syncPermissions,
    ensurePermissions,
    hasAllPermissions: permissions.cameraGranted && permissions.mediaGranted,
  };
}
