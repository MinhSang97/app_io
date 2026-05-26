import { Platform, Alert } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.EnergyConsumed,
    ],
    write: [],
  },
} as HealthKitPermissions;

interface DailyHealthData {
  date: string;
  steps: number;
  active_energy_burned: number;
  dietary_energy: number;
}

const getDailySteps = (options: any): Promise<{ date: string; value: number }[]> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !AppleHealthKit.getDailyStepCountSamples) {
      return resolve([]);
    }
    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err || !results) {
        resolve([]);
      } else {
        const formatted = results.map((r: any) => {
          const localDate = new Date(r.startDate);
          const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
          return { date: dateStr, value: r.value || 0 };
        });
        resolve(formatted);
      }
    });
  });
};

const getDailyActiveEnergy = (options: any): Promise<{ date: string; value: number }[]> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !AppleHealthKit.getActiveEnergyBurned) {
      return resolve([]);
    }
    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (err || !results) {
        resolve([]);
      } else {
        const dailyMap: Record<string, number> = {};
        if (Array.isArray(results)) {
          for (const sample of results) {
            const localDate = new Date(sample.startDate);
            const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + (sample.value || 0);
          }
        }
        const formatted = Object.entries(dailyMap).map(([date, value]) => ({ date, value }));
        resolve(formatted);
      }
    });
  });
};

const getDailyDietaryEnergy = (options: any): Promise<{ date: string; value: number }[]> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !AppleHealthKit.getEnergyConsumedSamples) {
      return resolve([]);
    }
    AppleHealthKit.getEnergyConsumedSamples(options, (err, results) => {
      if (err || !results) {
        resolve([]);
      } else {
        const dailyMap: Record<string, number> = {};
        if (Array.isArray(results)) {
          for (const sample of results) {
            const localDate = new Date(sample.startDate);
            const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + (sample.value || 0);
          }
        }
        const formatted = Object.entries(dailyMap).map(([date, value]) => ({ date, value }));
        resolve(formatted);
      }
    });
  });
};

const initHealthKit = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[Health Sync] AppleHealthKit object:', {
      type: typeof AppleHealthKit,
      exists: !!AppleHealthKit,
      keys: AppleHealthKit ? Object.keys(AppleHealthKit) : [],
      hasInit: !!(AppleHealthKit && AppleHealthKit.initHealthKit),
      hasIsAvailable: !!(AppleHealthKit && AppleHealthKit.isAvailable),
    });

    if (!AppleHealthKit || !AppleHealthKit.initHealthKit) {
      return reject(new Error("HealthKit is not available on this device"));
    }
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export async function syncAppleHealth(showAlerts = false, title = "Health Sync"): Promise<void> {
  if (Platform.OS !== 'ios') {
    if (showAlerts) {
      Alert.alert("Tính năng không hỗ trợ", "Đồng bộ Apple Health chỉ hỗ trợ trên thiết bị iOS.");
    }
    return;
  }

  try {
    console.log('[Health Sync] Initializing HealthKit...');
    await initHealthKit();
    console.log('[Health Sync] HealthKit initialized. Fetching daily data...');

    const now = new Date();
    const options = {
      startDate: new Date(0).toISOString(),
      endDate: now.toISOString(),
    };

    const [stepsList, activeEnergyList, dietaryEnergyList] = await Promise.all([
      getDailySteps(options),
      getDailyActiveEnergy(options),
      getDailyDietaryEnergy(options),
    ]);

    const merged: Record<string, DailyHealthData> = {};

    const getOrCreate = (date: string): DailyHealthData => {
      if (!merged[date]) {
        merged[date] = {
          date,
          steps: 0,
          active_energy_burned: 0,
          dietary_energy: 0,
        };
      }
      return merged[date];
    };

    for (const item of stepsList) {
      getOrCreate(item.date).steps = Math.round(item.value);
    }
    for (const item of activeEnergyList) {
      getOrCreate(item.date).active_energy_burned = Math.round(item.value * 100) / 100;
    }
    for (const item of dietaryEnergyList) {
      getOrCreate(item.date).dietary_energy = Math.round(item.value * 100) / 100;
    }

    const payload = Object.values(merged).sort((a, b) => a.date.localeCompare(b.date));

    console.log('[Health Sync] Sending payload to ngrok backend (total days:', payload.length, '):', JSON.stringify(payload));

    const response = await fetch('https://diabetic-yogurt-sandstone.ngrok-free.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46c2VjcmV0MTIz',
      },
      body: JSON.stringify(payload),
    });
    const resJson = await response.json();
    console.log('[Health Sync] Success response from server:', JSON.stringify(resJson));

    if (showAlerts) {
      Alert.alert(title, `Đã đồng bộ thành công ${payload.length} ngày dữ liệu!`);
    }
  } catch (error: any) {
    console.warn('[Health Sync] Error syncing health data:', error);
    if (showAlerts) {
      Alert.alert("Lỗi đồng bộ", error?.message || String(error));
    }
  }
}
