import { createJSONStorage } from "zustand/middleware";
import { MMKVLoader } from "react-native-mmkv-storage";

/**
 * Creates a reusable MMKV storage adapter for Zustand persistence
 * @param instanceID - Unique identifier for the MMKV instance
 * @returns Storage adapter compatible with Zustand's persist middleware
 */
export function createMMKVStorage(instanceID: string) {
  const storage = new MMKVLoader().withInstanceID(instanceID).initialize();

  return createJSONStorage(() => ({
    getItem: (name) => {
      const value = storage.getString(name);
      return value ?? null;
    },
    setItem: (name, value) => {
      storage.setString(name, value);
    },
    removeItem: (name) => {
      storage.removeItem(name);
    },
  }));
}

