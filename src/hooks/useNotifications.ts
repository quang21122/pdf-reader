import { useUIStore } from "@/stores";

/**
 * Custom hook for managing notifications
 * Provides simplified interface for showing different types of notifications
 */
export const useNotifications = () => {
  const {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    removeNotification,
    clearNotifications,
  } = useUIStore();

  return {
    success: showSuccessNotification,
    error: showErrorNotification,
    warning: showWarningNotification,
    info: showInfoNotification,
    remove: removeNotification,
    clear: clearNotifications,
  };
};

// Notification types for TypeScript
export interface NotificationOptions {
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

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
