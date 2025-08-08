import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotifications } from "./useNotifications";
import {
  getUserPDFFiles,
  deletePDFFile,
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

  const loadFiles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userFiles = await getUserPDFFiles(user.id);
      setFiles(userFiles);
    } catch (err) {
      console.error("Error loading files:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load files";
      setError(errorMessage);
      notifications.error("Load Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, notifications]);

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
      
      notifications.success("Download Started", `Downloading ${file.filename}`);
      return true;
    } catch (err) {
      console.error("Download error:", err);
      const errorMessage = "Failed to download file";
      setError(errorMessage);
      notifications.error("Download Failed", errorMessage);
      return false;
    }
  };

  const deleteFile = async (file: PDFFile): Promise<boolean> => {
    if (!user) return false;

    try {
      setDeleting(true);
      await deletePDFFile(file.id, user.id);
      setFiles(prevFiles => prevFiles.filter((f) => f.id !== file.id));
      notifications.success("File Deleted", `${file.filename} has been removed`);
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete file";
      setError(errorMessage);
      notifications.error("Delete Failed", errorMessage);
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
