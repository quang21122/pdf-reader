"use client";

import { useState } from "react";
import { useOCRStore, useUIStore, useSettingsStore } from "@/stores";

export interface OCRResult {
  pageNumber: number;
  text: string;
  confidence: number;
}

export function useOCRFileHandler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Zustand stores
  const { setCurrentResults } = useOCRStore();
  const { showSuccessNotification, showErrorNotification } = useUIStore();
  const { max_file_size } = useSettingsStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (file && supportedTypes.includes(file.type)) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > max_file_size) {
        showErrorNotification(
          "File too large",
          `File size (${fileSizeMB.toFixed(
            1
          )}MB) exceeds limit of ${max_file_size}MB`
        );
        return;
      }

      setSelectedFile(file);

      // Create object URL for the file
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      const fileType = file.type === "application/pdf" ? "PDF" : "Image";
      showSuccessNotification(
        "File Selected",
        `${fileType} file ready for OCR processing`
      );
    } else {
      showErrorNotification(
        "Invalid file",
        "Please select a valid PDF or image file (PNG, JPG)"
      );
      setSelectedFile(null);
      setPdfUrl(null);
    }
  };

  const handleOCRResults = (results: OCRResult[]) => {
    console.log("OCR Results:", results);

    // Convert to store format and save
    const ocrResults = results.map((result, index) => ({
      id: `ocr-${Date.now()}-${index}`,
      file_id: `temp-${Date.now()}`,
      page_number: result.pageNumber,
      text: result.text,
      confidence: result.confidence,
      processing_time: 0, // Will be calculated by the store
      created_at: new Date().toISOString(),
    }));

    setCurrentResults(ocrResults);
    showSuccessNotification(
      "OCR Complete",
      `Successfully extracted text from ${results.length} pages`
    );
  };

  const resetFile = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  return {
    selectedFile,
    pdfUrl,
    handleFileSelect,
    handleOCRResults,
    resetFile,
  };
}
