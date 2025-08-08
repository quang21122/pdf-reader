import { usePDFStore, useOCRStore, useSettingsStore } from "@/stores";
import { useNotifications } from "./useNotifications";
import type { PDFFile } from "@/stores/types";

/**
 * Custom hook for file operations
 * Provides high-level file management functions
 */
export const useFileOperations = () => {
  const { addFile, setCurrentFile, removeFile, updateFile } = usePDFStore();
  const { addToQueue } = useOCRStore();
  const { auto_ocr } = useSettingsStore();
  const notifications = useNotifications();

  // Upload a file and optionally start OCR
  const uploadFile = async (file: File): Promise<PDFFile | null> => {
    try {
      // Validate file
      if (!file.type.includes("pdf")) {
        notifications.error("Invalid File", "Please select a PDF file");
        return null;
      }

      // Create PDF file object
      const pdfFile: PDFFile = {
        id: `pdf-${Date.now()}`,
        filename: file.name,
        file_path: "",
        file_size: file.size,
        upload_date: new Date().toISOString(),
        user_id: "current-user", // Replace with actual user ID
        status: "uploading",
      };

      // Add to store
      addFile(pdfFile);
      setCurrentFile(pdfFile);

      // Simulate upload process (replace with actual upload logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status to uploaded
      updateFile(pdfFile.id, { status: "uploaded" });

      // Start auto-OCR if enabled
      if (auto_ocr) {
        addToQueue(pdfFile.id);
        notifications.success(
          "File Uploaded",
          "OCR processing will start automatically"
        );
      } else {
        notifications.success("File Uploaded", "File is ready for processing");
      }

      return pdfFile;
    } catch (error) {
      notifications.error("Upload Failed", "Failed to upload file");
      return null;
    }
  };

  // Delete a file
  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      const file = usePDFStore.getState().files.find(f => f.id === fileId);
      if (!file) {
        notifications.error("File Not Found", "The file could not be found");
        return false;
      }

      removeFile(fileId);
      notifications.success("File Deleted", `${file.filename} has been removed`);
      return true;
    } catch (error) {
      notifications.error("Delete Failed", "Failed to delete file");
      return false;
    }
  };

  // Download a file
  const downloadFile = async (fileId: string): Promise<boolean> => {
    try {
      const file = usePDFStore.getState().files.find(f => f.id === fileId);
      if (!file) {
        notifications.error("File Not Found", "The file could not be found");
        return false;
      }

      // Simulate download (replace with actual download logic)
      notifications.info("Download Started", `Downloading ${file.filename}`);
      return true;
    } catch (error) {
      notifications.error("Download Failed", "Failed to download file");
      return false;
    }
  };

  // Start OCR for a file
  const startOCR = async (fileId: string): Promise<boolean> => {
    try {
      const file = usePDFStore.getState().files.find(f => f.id === fileId);
      if (!file) {
        notifications.error("File Not Found", "The file could not be found");
        return false;
      }

      if (file.status !== "uploaded" && file.status !== "ready") {
        notifications.warning("File Not Ready", "File must be uploaded before OCR");
        return false;
      }

      addToQueue(fileId);
      notifications.info("OCR Started", `Processing ${file.filename}`);
      return true;
    } catch (error) {
      notifications.error("OCR Failed", "Failed to start OCR processing");
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    downloadFile,
    startOCR,
  };
};

// File validation utilities
export const fileUtils = {
  // Validate PDF file
  validatePDF: (file: File): { valid: boolean; error?: string } => {
    if (!file.type.includes("pdf")) {
      return { valid: false, error: "File must be a PDF" };
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 100MB" };
    }

    return { valid: true };
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  },

  // Generate unique filename
  generateUniqueFilename: (originalName: string): string => {
    const timestamp = Date.now();
    const extension = fileUtils.getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(`.${extension}`, "");
    return `${nameWithoutExt}_${timestamp}.${extension}`;
  },
};
