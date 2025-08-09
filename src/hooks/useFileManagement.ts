import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotifications } from "./useNotifications";
import {
  getUserPDFFiles,
  deletePDFFile,
  softDeletePDFFile,
  getPDFDownloadUrl,
} from "@/utils/uploadUtils";

export interface PDFFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  public_url?: string;
}

/**
 * Custom hook for managing PDF files
 * Handles loading, deleting, downloading files
 */
export const useFileManagement = () => {
  const { user } = useAuth();
  const notifications = useNotifications();

  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Use ref to store notifications to avoid dependency issues
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;

  const loadFiles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userFiles = await getUserPDFFiles(user.id);
      setFiles(userFiles);
    } catch (err) {
      console.error("Error loading files:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load files";
      setError(errorMessage);
      notificationsRef.current.error("Load Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]); // Remove notifications from dependencies

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user, loadFiles]);

  const downloadFile = async (file: PDFFile): Promise<boolean> => {
    try {
      const downloadUrl = await getPDFDownloadUrl(file.file_path);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notificationsRef.current.success(
        "Download Started",
        `Downloading ${file.filename}`
      );
      return true;
    } catch (err) {
      console.error("Download error:", err);
      const errorMessage = "Failed to download file";
      setError(errorMessage);
      notificationsRef.current.error("Download Failed", errorMessage);
      return false;
    }
  };

  const deleteFile = async (file: PDFFile): Promise<boolean> => {
    if (!user) return false;

    try {
      setDeleting(true);
      await softDeletePDFFile(file.id, user.id);
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
      notificationsRef.current.success(
        "File Moved to Trash",
        `${file.filename} has been moved to trash`
      );
      return true;
    } catch (err) {
      console.error("Soft delete error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to move file to trash";
      setError(errorMessage);
      notificationsRef.current.error("Delete Failed", errorMessage);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const refreshFiles = () => {
    loadFiles();
  };

  return {
    files,
    loading,
    error,
    deleting,
    downloadFile,
    deleteFile,
    refreshFiles,
    setError,
  };
};

// File utility functions
export const fileUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getFileExtension: (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  },

  isValidPDF: (filename: string): boolean => {
    return fileUtils.getFileExtension(filename) === "pdf";
  },
};
