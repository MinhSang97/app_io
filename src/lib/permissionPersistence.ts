import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSION_GATES_KEY = 'io.permissionGateCompleted';

export async function loadPermissionGateCompleted() {
  try {
    const value = await AsyncStorage.getItem(PERMISSION_GATES_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function savePermissionGateCompleted(value: boolean) {
  try {
    await AsyncStorage.setItem(PERMISSION_GATES_KEY, String(value));
  } catch {
    // TODO: replace local persistence with backend user profile sync when API is available.
  }
}
