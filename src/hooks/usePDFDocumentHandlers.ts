import { useCallback } from "react";

interface PDFDocumentHandlersProps {
  setNumPages: (numPages: number) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePDFDocumentHandlers = ({
  setNumPages,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
}: PDFDocumentHandlersProps) => {
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setCurrentPage(1);
      setLoading(false);
      clearError();
    },
    [setNumPages, setCurrentPage, setLoading, clearError]
  );

  const onDocumentLoadError = useCallback(
    (error: Error) => {
      console.error("PDF load error:", error);

      let errorMessage = "Failed to load PDF document";

      // Provide more specific error messages
      if (error.message.includes("400")) {
        errorMessage =
          "PDF file not found or access denied. Please check if the file exists and you have permission to view it.";
      } else if (error.message.includes("403")) {
        errorMessage =
          "Access denied. You don't have permission to view this file.";
      } else if (error.message.includes("404")) {
        errorMessage =
          "PDF file not found. The file may have been deleted or moved.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes("cors")) {
        errorMessage =
          "CORS error. There's an issue with file access permissions.";
      }

      setError(errorMessage);
      setLoading(false);
    },
    [setError, setLoading]
  );

  return {
    onDocumentLoadSuccess,
    onDocumentLoadError,
  };
};
