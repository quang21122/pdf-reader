"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Button,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Language,
  TextFields,
  Security,
  Speed,
} from "@mui/icons-material";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useSettingsStore, useUIStore } from "@/stores";

function SettingsContent() {
  const {
    // Theme settings
    theme,
    setTheme,
    getEffectiveTheme,

    // Language settings
    language,
    setLanguage,
    ocr_language,
    setOCRLanguage,

    // OCR settings
    auto_ocr,
    setAutoOCR,

    // Notifications
    notifications_enabled,
    setNotificationsEnabled,

    // File settings
    max_file_size,
    setMaxFileSize,

    // PDF Viewer settings (commented out for now)
    // pdf_viewer_zoom,
    // setPDFViewerZoom,
    // pdf_viewer_fit_mode,
    // setPDFViewerFitMode,

    // Performance settings
    lazy_loading,
    setLazyLoading,
    image_optimization,
    setImageOptimization,
    cache_enabled,
    setCacheEnabled,
    cache_size_mb,
    setCacheSize,

    // Accessibility
    high_contrast,
    setHighContrast,
    font_size_multiplier,
    setFontSizeMultiplier,
    reduce_motion,
    setReduceMotion,

    // Analytics
    analytics_enabled,
    setAnalyticsEnabled,
    crash_reporting,
    setCrashReporting,

    // Utilities
    resetToDefaults,
    validateSettings,
    exportSettings,
  } = useSettingsStore();

  const { showSuccessNotification, showErrorNotification } = useUIStore();

  const handleSaveSettings = () => {
    const validation = validateSettings();
    if (validation.isValid) {
      showSuccessNotification(
        "Settings Saved",
        "Your preferences have been updated"
      );
    } else {
      showErrorNotification("Invalid Settings", validation.errors.join(", "));
    }
  };

  const handleResetSettings = () => {
    resetToDefaults();
    showSuccessNotification(
      "Settings Reset",
      "All settings have been reset to defaults"
    );
  };

  const handleExportSettings = () => {
    try {
      const settingsJson = exportSettings();
      const blob = new Blob([settingsJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf-reader-settings.json";
      a.click();
      URL.revokeObjectURL(url);
      showSuccessNotification(
        "Settings Exported",
        "Settings file has been downloaded"
      );
    } catch (error) {
      console.error("Export error:", error);
      showErrorNotification("Export Failed", "Failed to export settings");
    }
  };

  const currentTheme = getEffectiveTheme();

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Settings
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Customize your PDF Reader experience
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Appearance Settings */}
          <Box>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  {currentTheme === "light" ? <Brightness7 /> : <Brightness4 />}
                  <Typography variant="h6">Appearance</Typography>
                </Box>

                <FormControl fullWidth className="mb-4">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value as "light" | "dark" | "system")
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={high_contrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                    />
                  }
                  label="High Contrast"
                  className="mb-2"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={reduce_motion}
                      onChange={(e) => setReduceMotion(e.target.checked)}
                    />
                  }
                  label="Reduce Motion"
                  className="mb-4"
                />

                <Typography gutterBottom>
                  Font Size: {font_size_multiplier}x
                </Typography>
                <Slider
                  value={font_size_multiplier}
                  onChange={(_, value) =>
                    setFontSizeMultiplier(value as number)
                  }
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  marks={[
                    { value: 0.5, label: "0.5x" },
                    { value: 1.0, label: "1x" },
                    { value: 2.0, label: "2x" },
                    { value: 3.0, label: "3x" },
                  ]}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Language Settings */}
          <Box>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  <Language />
                  <Typography variant="h6">Language</Typography>
                </Box>

                <FormControl fullWidth className="mb-4">
                  <InputLabel>Interface Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="vi">Tiếng Việt</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>OCR Language</InputLabel>
                  <Select
                    value={ocr_language}
                    onChange={(e) => setOCRLanguage(e.target.value)}
                  >
                    <MenuItem value="eng">English</MenuItem>
                    <MenuItem value="vie">Vietnamese</MenuItem>
                    <MenuItem value="fra">French</MenuItem>
                    <MenuItem value="deu">German</MenuItem>
                    <MenuItem value="spa">Spanish</MenuItem>
                    <MenuItem value="chi_sim">Chinese (Simplified)</MenuItem>
                    <MenuItem value="jpn">Japanese</MenuItem>
                    <MenuItem value="kor">Korean</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Box>

          {/* OCR Settings */}
          <Box>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  <TextFields />
                  <Typography variant="h6">OCR Settings</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={auto_ocr}
                      onChange={(e) => setAutoOCR(e.target.checked)}
                    />
                  }
                  label="Auto-start OCR after upload"
                  className="mb-4"
                />

                <Typography gutterBottom>
                  Max File Size: {max_file_size} MB
                </Typography>
                <Slider
                  value={max_file_size}
                  onChange={(_, value) => setMaxFileSize(value as number)}
                  min={1}
                  max={500}
                  step={1}
                  marks={[
                    { value: 1, label: "1MB" },
                    { value: 50, label: "50MB" },
                    { value: 100, label: "100MB" },
                    { value: 500, label: "500MB" },
                  ]}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Performance Settings */}
          <Box>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  <Speed />
                  <Typography variant="h6">Performance</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={lazy_loading}
                      onChange={(e) => setLazyLoading(e.target.checked)}
                    />
                  }
                  label="Lazy Loading"
                  className="mb-2"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={image_optimization}
                      onChange={(e) => setImageOptimization(e.target.checked)}
                    />
                  }
                  label="Image Optimization"
                  className="mb-2"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={cache_enabled}
                      onChange={(e) => setCacheEnabled(e.target.checked)}
                    />
                  }
                  label="Enable Caching"
                  className="mb-4"
                />

                {cache_enabled && (
                  <>
                    <Typography gutterBottom>
                      Cache Size: {cache_size_mb} MB
                    </Typography>
                    <Slider
                      value={cache_size_mb}
                      onChange={(_, value) => setCacheSize(value as number)}
                      min={10}
                      max={1000}
                      step={10}
                      marks={[
                        { value: 10, label: "10MB" },
                        { value: 100, label: "100MB" },
                        { value: 500, label: "500MB" },
                        { value: 1000, label: "1GB" },
                      ]}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Privacy Settings */}
          <Box>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  <Security />
                  <Typography variant="h6">Privacy & Analytics</Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications_enabled}
                          onChange={(e) =>
                            setNotificationsEnabled(e.target.checked)
                          }
                        />
                      }
                      label="Enable Notifications"
                    />
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={analytics_enabled}
                          onChange={(e) =>
                            setAnalyticsEnabled(e.target.checked)
                          }
                        />
                      }
                      label="Analytics"
                    />
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={crash_reporting}
                          onChange={(e) => setCrashReporting(e.target.checked)}
                        />
                      }
                      label="Crash Reporting"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Actions
                </Typography>
                <Box className="flex gap-2 flex-wrap">
                  <Button
                    variant="contained"
                    onClick={handleSaveSettings}
                    color="primary"
                  >
                    Save Settings
                  </Button>

                  <Button variant="outlined" onClick={handleExportSettings}>
                    Export Settings
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleResetSettings}
                    color="warning"
                  >
                    Reset to Defaults
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
