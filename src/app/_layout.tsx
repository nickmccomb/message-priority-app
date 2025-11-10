import "react-native-gesture-handler";
import "react-native-reanimated";
import "../../global.css";
import "../i18n";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../components/organisms/ThemeProvider";
import { useTheme } from "../theme/useTheme";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationThemeProvider
          value={theme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <Stack>
            <Stack.Screen name="(messages)" options={{ headerShown: false }} />
          </Stack>
        </NavigationThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
