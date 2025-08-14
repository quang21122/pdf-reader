import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import type { PDFFile } from "@/stores/types";

/**
 * Custom hook for file viewer actions
 * Handles download, OCR navigation, and back navigation
 */
export function useFileViewerActions() {
  const router = useRouter();
  const { error: showErrorNotification, success: showSuccessNotification } =
    useNotifications();

  // Handle download
  const handleDownload = async (file: PDFFile, fileUrl: string) => {
    if (!file || !fileUrl) return;

    try {
      // Fetch the file as blob to force download
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      showSuccessNotification(
        "Download Started",
        `Downloading ${file.filename}`
      );
    } catch (err) {
      console.error("Download error:", err);
      showErrorNotification("Download Failed", "Failed to download file");
    }
  };

  // Handle OCR navigation
  const handleOCR = (file: PDFFile) => {
    if (!file) return;
    router.push(`/ocr?fileId=${file.id}`);
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/files");
  };

  return {
    handleDownload,
    handleOCR,
    handleBack,
  };
}
