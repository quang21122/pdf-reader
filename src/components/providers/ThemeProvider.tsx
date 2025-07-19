"use client";

import React from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create Material UI theme
const createAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#2196f3",
        light: "#64b5f6",
        dark: "#1976d2",
      },
      secondary: {
        main: "#e91e63",
        light: "#f48fb1",
        dark: "#c2185b",
      },
      background: {
        default: isDarkMode ? "#121212" : "#fafafa",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#212121",
        secondary: isDarkMode ? "#b0b0b0" : "#757575",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDarkMode ? "#757575 #424242" : "#c1c1c1 #f1f1f1",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 4,
              backgroundColor: isDarkMode ? "#757575" : "#c1c1c1",
              "&:hover": {
                backgroundColor: isDarkMode ? "#9e9e9e" : "#a8a8a8",
              },
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              borderRadius: 4,
              backgroundColor: isDarkMode ? "#424242" : "#f1f1f1",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDarkMode
              ? "0px 2px 8px rgba(0, 0, 0, 0.3)"
              : "0px 2px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#212121",
            boxShadow: isDarkMode
              ? "0px 2px 4px rgba(0, 0, 0, 0.3)"
              : "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
            borderRight: `1px solid ${isDarkMode ? "#333333" : "#e0e0e0"}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Check for dark mode preference after mounting
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Always use light theme during SSR to prevent hydration mismatch
  const theme = React.useMemo(
    () => createAppTheme(mounted ? isDarkMode : false),
    [isDarkMode, mounted]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
