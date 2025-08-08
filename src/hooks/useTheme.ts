import { useSettingsStore } from "@/stores";

/**
 * Custom hook for theme management
 * Provides easy access to theme state and utilities
 */
export const useTheme = () => {
  const { theme, setTheme } = useSettingsStore();

  // Get effective theme (resolve 'system' to actual theme)
  const getEffectiveTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const currentEffective = getEffectiveTheme();
    setTheme(currentEffective === "light" ? "dark" : "light");
  };

  // Set to system preference
  const useSystemTheme = () => {
    setTheme("system");
  };

  // Check if currently using system theme
  const isSystemTheme = theme === "system";

  // Get current effective theme
  const currentTheme = getEffectiveTheme();

  return {
    theme,
    currentTheme,
    setTheme,
    toggleTheme,
    useSystemTheme,
    isSystemTheme,
    getEffectiveTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  };
};

// Theme utilities
export const themeUtils = {
  // Get theme-appropriate colors
  getColors: (theme: "light" | "dark") => ({
    primary: theme === "dark" ? "#90caf9" : "#1976d2",
    secondary: theme === "dark" ? "#f48fb1" : "#dc004e",
    background: theme === "dark" ? "#121212" : "#ffffff",
    surface: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
    text: theme === "dark" ? "#ffffff" : "#000000",
    textSecondary: theme === "dark" ? "#b0b0b0" : "#666666",
  }),

  // Apply theme to document
  applyTheme: (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  },

  // Listen for system theme changes
  watchSystemTheme: (callback: (isDark: boolean) => void) => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => callback(e.matches);

    mediaQuery.addEventListener("change", handler);

    // Return cleanup function
    return () => mediaQuery.removeEventListener("change", handler);
  },
};
