"use client";

import { useState, useCallback, useEffect } from "react";
import { useOCRProgress } from "./useOCRProgress";
import { useLanguageSelection } from "./useLanguageSelection";

// Define OCRResult type locally to avoid importing client-only module
export interface OCRResult {
  pageNumber: number;
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface OCROptions {
  language?: string;
  onProgress?: (progress: unknown) => void;
  onResults?: (results: OCRResult[]) => void;
}

export interface OCRError {
  message: string;
  type: "validation" | "processing" | "network";
}

/**
 * Custom hook for OCR processing functionality
 * Combines progress tracking, language selection, and OCR processing
 */
export function useOCR(options: OCROptions = {}) {
  const [results, setResults] = useState<OCRResult[]>([]);
  const [error, setError] = useState<OCRError | null>(null);
  const [isClient, setIsClient] = useState(false);

  const progressHook = useOCRProgress();
  const languageHook = useLanguageSelection(options.language);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const validatePdfUrl = (pdfUrl: string): boolean => {
    if (!pdfUrl || !pdfUrl.trim()) {
      setError({
        message: "No PDF URL provided",
        type: "validation",
      });
      return false;
    }

    try {
      new URL(pdfUrl);
    } catch {
      setError({
        message: "Invalid PDF URL format",
        type: "validation",
      });
      return false;
    }

    return true;
  };

  const processOCR = useCallback(
    async (pdfUrl: string): Promise<boolean> => {
      if (!isClient) {
        setError({
          message: "OCR processing is only available on the client side",
          type: "processing",
        });
        return false;
      }

      if (!validatePdfUrl(pdfUrl)) {
        return false;
      }

      setError(null);
      setResults([]);
      progressHook.startProgress();

      try {
        console.log("Starting OCR process for:", pdfUrl);
        console.log("Selected language:", languageHook.selectedLanguage);

        // Dynamically import client-only OCR utilities
        const { extractTextFromPDFWithOCR } = await import(
          "@/utils/ocrUtils.client"
        );
        console.log("OCR utilities imported successfully");

        const ocrResults = await extractTextFromPDFWithOCR(pdfUrl, {
          language: languageHook.selectedLanguage,
          onProgress: (progressData) => {
            console.log("OCR Progress:", progressData);
            progressHook.updateProgress(progressData);
            options.onProgress?.(progressData);
          },
        });
        console.log("OCR completed successfully:", ocrResults);

        setResults(ocrResults);
        options.onResults?.(ocrResults);
        progressHook.completeProgress("OCR processing completed successfully!");

        return true;
      } catch (err) {
        console.error("OCR processing failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "OCR processing failed";

        setError({
          message: errorMessage,
          type: "processing",
        });

        progressHook.setError(`OCR processing failed: ${errorMessage}`);
        return false;
      }
    },
    [isClient, languageHook.selectedLanguage, progressHook, options]
  );

  const copyText = useCallback((text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      setError({
        message: "Clipboard API not available",
        type: "processing",
      });
      return Promise.resolve(false);
    }

    return navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        return true;
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        setError({
          message: "Failed to copy text to clipboard",
          type: "processing",
        });
        return false;
      });
  }, []);

  const searchInText = useCallback(
    (searchTerm: string): OCRResult[] => {
      if (!searchTerm.trim()) {
        return results;
      }

      return results.filter((result) =>
        result.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [results]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetOCR = useCallback(() => {
    setResults([]);
    setError(null);
    progressHook.resetProgress();
  }, [progressHook]);

  const getTotalCharacters = (): number => {
    return results.reduce((sum, result) => sum + result.text.length, 0);
  };

  const getAverageConfidence = (): number => {
    if (results.length === 0) return 0;
    const totalConfidence = results.reduce(
      (sum, result) => sum + result.confidence,
      0
    );
    return Math.round(totalConfidence / results.length);
  };

  const getProcessedPages = (): number => {
    return results.length;
  };

  return {
    // Results and state
    results,
    error,
    isClient,

    // Progress tracking
    ...progressHook,

    // Language selection
    ...languageHook,

    // OCR operations
    processOCR,
    copyText,
    searchInText,
    resetOCR,
    clearError,

    // Statistics
    getTotalCharacters,
    getAverageConfidence,
    getProcessedPages,
  };
}
