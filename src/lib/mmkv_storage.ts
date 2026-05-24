import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'io-app-storage',
});

export const appMmkv = {
  getString: (key: string) => storage.getString(key),
  set: (key: string, value: string | number | boolean) => storage.set(key, value),
  remove: (key: string) => storage.remove(key),
  getBoolean: (key: string) => storage.getBoolean(key),
};

export function createMmkvStateStorage() {
  return {
    getItem: (name: string) => {
      return appMmkv.getString(name) ?? null;
    },
    setItem: (name: string, value: string) => {
      appMmkv.set(name, value);
    },
    removeItem: (name: string) => {
      appMmkv.remove(name);
    },
  };
}
