# Theme

This directory contains theme configuration and theme-related utilities.

## Structure

```
theme/
├── themeStore.ts      # Zustand store for theme state
└── useTheme.ts        # Hook to access theme state
```

## Theme Modes

The app supports three theme modes:
- `light` - Light mode
- `dark` - Dark mode
- `system` - Follows device/system theme (default)

## Usage

Use the `useTheme` hook in components:

```tsx
import { useTheme } from '@/src/theme/useTheme';

function MyComponent() {
  const { theme, isDark } = useTheme();
  // theme: 'light' | 'dark' | 'system'
  // isDark: boolean (true if dark mode is active)
}
```

## Theme Store

The theme state is persisted using MMKV storage:

```tsx
import { useThemeStore } from '@/src/theme/themeStore';

function MyComponent() {
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  
  // Change theme
  setThemeMode('dark');
}
```

## Styling

Theme-aware styling is handled by NativeWind with Tailwind CSS:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Theme-aware text
  </Text>
</View>
```

