let storage: {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | number | boolean) => void;
  remove: (key: string) => void;
  getBoolean: (key: string) => boolean | undefined;
};

try {
  const { MMKV } = require('react-native-mmkv');
  const mmkvInstance = new MMKV({
    id: 'io-app-storage',
  });
  storage = {
    getString: (key: string) => mmkvInstance.getString(key),
    set: (key: string, value: string | number | boolean) => mmkvInstance.set(key, value),
    remove: (key: string) => mmkvInstance.delete(key),
    getBoolean: (key: string) => mmkvInstance.getBoolean(key),
  };
} catch (e) {
  console.warn('MMKV is not supported in this environment (e.g. Expo Go), falling back to in-memory storage.');
  const memoryStore = new Map<string, any>();
  storage = {
    getString: (key: string) => {
      const val = memoryStore.get(key);
      return val !== undefined ? String(val) : undefined;
    },
    set: (key: string, value: string | number | boolean) => {
      memoryStore.set(key, value);
    },
    remove: (key: string) => {
      memoryStore.delete(key);
    },
    getBoolean: (key: string) => {
      const val = memoryStore.get(key);
      return typeof val === 'boolean' ? val : undefined;
    },
  };
}

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
