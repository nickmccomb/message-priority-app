import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMMKVStorage } from '../stores/mmkvStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'theme-storage',
      storage: createMMKVStorage('theme-storage'),
    }
  )
);

