import { useColorScheme } from "react-native";
import { useThemeStore } from "./themeStore";

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();

  const theme =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  return {
    theme,
    themeMode,
    setThemeMode,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}
