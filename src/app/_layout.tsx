import "react-native-reanimated";
import "../../global.css";
import "../i18n";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../components/organisms/ThemeProvider";
import { useTheme } from "../theme/useTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Layout() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationThemeProvider
              value={theme === "dark" ? DarkTheme : DefaultTheme}
            >
              <StatusBar style={theme === "dark" ? "light" : "dark"} />
              <Stack>
                <Stack.Screen
                  name="(messages)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </NavigationThemeProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
