"use client";

import React, { useEffect } from "react";
import {
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Slide,
  Fade,
} from "@mui/material";
import { Close, CheckCircle, Error, Warning, Info } from "@mui/icons-material";
import { useUIStore } from "@/stores";

interface NotificationCenterProps {
  maxNotifications?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

export default function NotificationCenter({
  maxNotifications = 5,
  position = { vertical: "top", horizontal: "right" },
}: NotificationCenterProps) {
  const { notifications, removeNotification } = useUIStore();

  // Auto-remove notifications after their duration
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && !notification.persistent) {
        const timeElapsed = Date.now() - notification.timestamp;
        const remainingTime = notification.duration - timeElapsed;

        if (remainingTime > 0) {
          setTimeout(() => {
            removeNotification(notification.id);
          }, remainingTime);
        } else {
          // Remove immediately if duration has already passed
          removeNotification(notification.id);
        }
      }
    });
  }, [notifications, removeNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle />;
      case "error":
        return <Error />;
      case "warning":
        return <Warning />;
      case "info":
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getSeverity = (type: string) => {
    switch (type) {
      case "success":
        return "success" as const;
      case "error":
        return "error" as const;
      case "warning":
        return "warning" as const;
      case "info":
        return "info" as const;
      default:
        return "info" as const;
    }
  };

  // Show only the most recent notifications
  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <Box
      sx={{
        position: "fixed",
        top: position.vertical === "top" ? 24 : "auto",
        bottom: position.vertical === "bottom" ? 24 : "auto",
        left:
          position.horizontal === "center"
            ? "50%"
            : position.horizontal === "left"
            ? 24
            : "auto",
        right: position.horizontal === "right" ? 24 : "auto",
        transform:
          position.horizontal === "center" ? "translateX(-50%)" : "none",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxWidth: 400,
        width: "100%",
      }}
    >
      {visibleNotifications.map((notification, index) => (
        <Slide
          key={notification.id}
          direction={position.horizontal === "right" ? "left" : "right"}
          in={true}
          timeout={300}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <Alert
            severity={getSeverity(notification.type)}
            icon={getIcon(notification.type)}
            action={
              <IconButton
                size="small"
                onClick={() => removeNotification(notification.id)}
                sx={{ color: "inherit" }}
              >
                <Close fontSize="small" />
              </IconButton>
            }
            sx={{
              width: "100%",
              boxShadow: 3,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: "bold", mb: 0.5 }}>
              {notification.title}
            </AlertTitle>
            <Typography variant="body2">{notification.message}</Typography>

            {/* Show timestamp for persistent notifications */}
            {notification.persistent && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {new Date(notification.timestamp).toLocaleTimeString()}
              </Typography>
            )}
          </Alert>
        </Slide>
      ))}

      {/* Show count if there are more notifications */}
      {notifications.length > maxNotifications && (
        <Fade in={true}>
          <Box
            sx={{
              textAlign: "center",
              py: 1,
              px: 2,
              backgroundColor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              +{notifications.length - maxNotifications} more notifications
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
}

// Hook and types moved to src/hooks/useNotifications.ts

// Utility functions for common notification patterns
export const notificationUtils = {
  uploadSuccess: (filename: string) => ({
    title: "Upload Complete",
    message: `${filename} has been uploaded successfully`,
    duration: 5000,
  }),

  uploadError: (filename: string, error: string) => ({
    title: "Upload Failed",
    message: `Failed to upload ${filename}: ${error}`,
    persistent: true,
  }),

  ocrComplete: (pageCount: number) => ({
    title: "OCR Complete",
    message: `Successfully processed ${pageCount} pages`,
    duration: 5000,
  }),

  ocrError: (error: string) => ({
    title: "OCR Failed",
    message: `OCR processing failed: ${error}`,
    persistent: true,
  }),

  fileDeleted: (filename: string) => ({
    title: "File Deleted",
    message: `${filename} has been removed`,
    duration: 3000,
  }),

  settingsSaved: () => ({
    title: "Settings Saved",
    message: "Your preferences have been updated",
    duration: 3000,
  }),

  networkError: () => ({
    title: "Network Error",
    message: "Please check your internet connection and try again",
    persistent: true,
  }),

  authError: () => ({
    title: "Authentication Error",
    message: "Please log in again to continue",
    persistent: true,
  }),
};
