"use client";

import React from "react";
import {
  Box,
  Chip,
  LinearProgress,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import {
  CloudUpload,
  TextFields,
  Notifications,
  ExpandMore,
  ExpandLess,
  Storage,
  Speed,
  CheckCircle,
  Error,
  Warning,
} from "@mui/icons-material";
import {
  usePDFStore,
  useOCRStore,
  useUIStore,
  useSettingsStore,
} from "@/stores";
import { useAppStatus } from "@/hooks";

interface AppStatusBarProps {
  position?: "top" | "bottom";
  collapsible?: boolean;
  showDetails?: boolean;
}

export default function AppStatusBar({
  position = "bottom",
  collapsible = true,
  showDetails = false,
}: AppStatusBarProps) {
  // Use UI store for expanded state
  const { modal_states, toggleModal } = useUIStore();
  const expanded = modal_states["status-bar-expanded"] || showDetails;

  const handleToggleExpanded = () => toggleModal("status-bar-expanded");

  // Store data
  const { files, isUploading, uploadProgress } = usePDFStore();
  const { isProcessing, progress, getProcessingStats } = useOCRStore();
  const { notifications, loading_states } = useUIStore();
  const { cache_enabled, cache_size_mb, analytics_enabled } =
    useSettingsStore();

  // Computed values
  const isAppLoading =
    isUploading || isProcessing || Object.values(loading_states).some(Boolean);
  const processingStats = getProcessingStats();
  const activeUploads = Object.values(uploadProgress).filter(
    (p: any) => p.status === "uploading"
  );
  const activeProcessing = Object.values(progress).filter(
    (p: any) => p.status === "processing"
  );
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  // Get current processing progress
  const currentProcessingProgress: any =
    activeProcessing.length > 0 ? activeProcessing[0] : null;

  const getStatusColor = () => {
    if (isAppLoading || isUploading || isProcessing) return "warning";
    if (notifications.some((n: any) => n.type === "error")) return "error";
    return "success";
  };

  const getStatusText = () => {
    if (isUploading) return `Uploading ${activeUploads.length} file(s)`;
    if (isProcessing)
      return `Processing OCR (${activeProcessing.length} file(s))`;
    if (isAppLoading) return "Loading...";
    return "Ready";
  };

  // const formatBytes = (bytes: number) => {
  //   const mb = bytes / (1024 * 1024);
  //   return `${mb.toFixed(1)} MB`;
  // };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        [position]: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "background.paper",
        borderTop: position === "bottom" ? "1px solid" : "none",
        borderBottom: position === "top" ? "1px solid" : "none",
        borderColor: "divider",
        boxShadow:
          position === "bottom"
            ? "0 -2px 8px rgba(0,0,0,0.1)"
            : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Main Status Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          minHeight: 48,
        }}
      >
        {/* Left side - Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
            icon={
              isUploading ? (
                <CloudUpload />
              ) : isProcessing ? (
                <TextFields />
              ) : isAppLoading ? (
                <Speed />
              ) : (
                <CheckCircle />
              )
            }
          />

          {/* Progress indicators */}
          {(isUploading || isProcessing) && (
            <Box sx={{ minWidth: 120 }}>
              <LinearProgress
                variant={
                  currentProcessingProgress ? "determinate" : "indeterminate"
                }
                value={
                  currentProcessingProgress
                    ? (currentProcessingProgress.processed_pages /
                        currentProcessingProgress.total_pages) *
                      100
                    : undefined
                }
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          )}

          {currentProcessingProgress && (
            <Typography variant="caption" color="text.secondary">
              {currentProcessingProgress.processed_pages}/
              {currentProcessingProgress.total_pages} pages
              {currentProcessingProgress.estimated_time_remaining && (
                <>
                  {" "}
                  •{" "}
                  {formatTime(
                    currentProcessingProgress.estimated_time_remaining
                  )}{" "}
                  remaining
                </>
              )}
            </Typography>
          )}
        </Box>

        {/* Right side - Stats and Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* File count */}
          <Tooltip title="Total files">
            <Chip
              label={files.length}
              size="small"
              variant="outlined"
              icon={<Storage />}
            />
          </Tooltip>

          {/* Notifications */}
          {unreadNotifications > 0 && (
            <Tooltip title="Unread notifications">
              <Chip
                label={unreadNotifications}
                size="small"
                color="info"
                icon={<Notifications />}
              />
            </Tooltip>
          )}

          {/* Expand/Collapse button */}
          {collapsible && (
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              sx={{ ml: 1 }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Detailed Status Panel */}
      <Collapse in={expanded}>
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {/* Files Stats */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  Files
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {files.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready: {files.filter((f: any) => f.status === "ready").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processing:{" "}
                  {files.filter((f: any) => f.status === "processing").length}
                </Typography>
              </CardContent>
            </Card>

            {/* OCR Stats */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  OCR Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processed: {processingStats.total_processed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate: {processingStats.success_rate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Time:{" "}
                  {formatTime(processingStats.average_processing_time)}
                </Typography>
              </CardContent>
            </Card>

            {/* System Stats */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cache: {cache_enabled ? `${cache_size_mb}MB` : "Disabled"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics: {analytics_enabled ? "Enabled" : "Disabled"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loading States:{" "}
                  {Object.values(loading_states).filter(Boolean).length}
                </Typography>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recent Activity
                </Typography>
                {notifications.slice(0, 3).map((notification: any) => (
                  <Box
                    key={notification.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    {notification.type === "success" && (
                      <CheckCircle
                        sx={{ fontSize: 14, color: "success.main" }}
                      />
                    )}
                    {notification.type === "error" && (
                      <Error sx={{ fontSize: 14, color: "error.main" }} />
                    )}
                    {notification.type === "warning" && (
                      <Warning sx={{ fontSize: 14, color: "warning.main" }} />
                    )}
                    <Typography variant="caption" noWrap>
                      {notification.title}
                    </Typography>
                  </Box>
                ))}
                {notifications.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
