import { useState, useCallback } from "react";

export interface PDFValidationError {
  message: string;
  type: "format" | "accessibility" | "size" | "network";
}

export interface PDFValidationResult {
  isValid: boolean;
  error?: PDFValidationError;
  fileSize?: number;
  contentType?: string;
}

/**
 * Custom hook for PDF validation functionality
 * Validates PDF URLs, file accessibility, and format
 */
export function usePDFValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidationResult, setLastValidationResult] =
    useState<PDFValidationResult | null>(null);

  const validatePDFUrl = useCallback((url: string): PDFValidationResult => {
    // Basic URL format validation
    if (!url || !url.trim()) {
      return {
        isValid: false,
        error: {
          message: "PDF URL is required",
          type: "format",
        },
      };
    }

    try {
      const urlObj = new URL(url);

      // Check if it's a valid HTTP/HTTPS URL
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return {
          isValid: false,
          error: {
            message: "URL must use HTTP or HTTPS protocol",
            type: "format",
          },
        };
      }

      // Check if URL ends with .pdf (basic check)
      const pathname = urlObj.pathname.toLowerCase();
      if (!pathname.endsWith(".pdf") && !pathname.includes("pdf")) {
        return {
          isValid: false,
          error: {
            message: "URL does not appear to be a PDF file",
            type: "format",
          },
        };
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: {
          message: "Invalid URL format",
          type: "format",
        },
      };
    }
  }, []);

  const checkPDFAccessibility = useCallback(
    async (url: string): Promise<PDFValidationResult> => {
      setIsValidating(true);

      try {
        // First validate the URL format
        const formatValidation = validatePDFUrl(url);
        if (!formatValidation.isValid) {
          setLastValidationResult(formatValidation);
          return formatValidation;
        }

        // Try to fetch the PDF to check accessibility
        const response = await fetch(url, {
          method: "HEAD",
          mode: "cors",
        });

        if (!response.ok) {
          const result: PDFValidationResult = {
            isValid: false,
            error: {
              message: `PDF not accessible: ${response.status} ${response.statusText}`,
              type: "accessibility",
            },
          };
          setLastValidationResult(result);
          return result;
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("pdf")) {
          const result: PDFValidationResult = {
            isValid: false,
            error: {
              message: "File is not a PDF document",
              type: "format",
            },
            contentType,
          };
          setLastValidationResult(result);
          return result;
        }

        // Check file size
        const contentLength = response.headers.get("content-length");
        const fileSize = contentLength
          ? parseInt(contentLength, 10)
          : undefined;

        // Warn if file is too large (>50MB)
        if (fileSize && fileSize > 50 * 1024 * 1024) {
          const result: PDFValidationResult = {
            isValid: false,
            error: {
              message:
                "PDF file is too large (>50MB). Processing may be slow or fail.",
              type: "size",
            },
            fileSize,
            contentType: contentType || undefined,
          };
          setLastValidationResult(result);
          return result;
        }

        const result: PDFValidationResult = {
          isValid: true,
          fileSize,
          contentType: contentType || undefined,
        };
        setLastValidationResult(result);
        return result;
      } catch {
        const result: PDFValidationResult = {
          isValid: false,
          error: {
            message:
              "Unable to access PDF. Please check the URL and try again.",
            type: "network",
          },
        };
        setLastValidationResult(result);
        return result;
      } finally {
        setIsValidating(false);
      }
    },
    [validatePDFUrl]
  );

  const validatePDFFile = useCallback((file: File): PDFValidationResult => {
    // Check file type
    if (file.type !== "application/pdf") {
      return {
        isValid: false,
        error: {
          message: "Selected file is not a PDF document",
          type: "format",
        },
      };
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return {
        isValid: false,
        error: {
          message: "PDF file is too large (>50MB)",
          type: "size",
        },
        fileSize: file.size,
      };
    }

    return {
      isValid: true,
      fileSize: file.size,
      contentType: file.type,
    };
  }, []);

  const clearValidationResult = useCallback(() => {
    setLastValidationResult(null);
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  return {
    // Validation state
    isValidating,
    lastValidationResult,

    // Validation functions
    validatePDFUrl,
    checkPDFAccessibility,
    validatePDFFile,

    // Utilities
    clearValidationResult,
    formatFileSize,
  };
}
