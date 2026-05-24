import * as Application from 'expo-application';
import { Platform } from 'react-native';

export async function getDeviceID(): Promise<string> {
  if (Platform.OS === 'ios') {
    // Lấy IDFV của iOS (ổn định khi xóa/cài lại app)
    const idfv = await Application.getIosIdForVendorAsync();
    return idfv ?? 'unknown-ios-device';
  } else if (Platform.OS === 'android') {
    // Lấy Android ID
    try {
      const androidID = Application.getAndroidId();
      return androidID || 'unknown-android-device';
    } catch {
      return 'unknown-android-device';
    }
  }
  return 'unknown-device';
}
