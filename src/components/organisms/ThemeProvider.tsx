import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useColorScheme } from 'react-native';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component that wraps the app
 * NativeWind v4 automatically handles dark mode based on system/device theme
 * This component ensures theme state is available throughout the app
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme();
  const systemColorScheme = useColorScheme();
  
  // NativeWind will automatically apply dark mode classes
  // based on the device/system color scheme
  return <View style={{ flex: 1 }}>{children}</View>;
}

