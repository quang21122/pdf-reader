"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { OCRResult, OCRProgress } from "@/utils/ocrUtils.client";

// Dynamically import OCR utilities to avoid SSR issues
const OCRResultComponent = dynamic(() => import("./OCRResult"), {
  ssr: false,
});

interface OCRProcessorProps {
  pdfUrl?: string;
  onResults?: (results: OCRResult[]) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "vie", name: "Vietnamese" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "spa", name: "Spanish" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
];

export default function OCRProcessor({ pdfUrl, onResults }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleStartOCR = async () => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults([]);
    setProgress(null);

    try {
      // Dynamically import client-only OCR utilities
      const { extractTextFromPDFWithOCR } = await import(
        "@/utils/ocrUtils.client"
      );

      const ocrResults = await extractTextFromPDFWithOCR(pdfUrl, {
        language,
        onProgress: (progressData) => {
          setProgress(progressData);
        },
      });

      setResults(ocrResults);
      onResults?.(ocrResults);
      setProgress({ status: "Completed!", progress: 100 });
    } catch (err) {
      console.error("OCR processing failed:", err);
      setError(err instanceof Error ? err.message : "OCR processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a toast notification here
      console.log("Text copied to clipboard");
    });
  };

  const handleSearchText = (text: string) => {
    // Implement search functionality
    console.log("Search for:", text);
  };

  if (!isClient) {
    return (
      <Box className="ocr-processor">
        <Paper className="p-6">
          <Typography>Loading OCR processor...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="ocr-processor">
      <Paper className="p-6 mb-4">
        <Typography variant="h6" className="mb-4">
          OCR Text Extraction
        </Typography>

        <Box className="flex flex-col gap-4">
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={handleLanguageChange}
              disabled={isProcessing}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleStartOCR}
            disabled={isProcessing || !pdfUrl}
            size="large"
          >
            {isProcessing ? "Processing..." : "Start OCR"}
          </Button>

          {!pdfUrl && (
            <Alert severity="warning">
              Please provide a PDF URL to start OCR processing.
            </Alert>
          )}

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {progress && (
            <Box>
              <Typography variant="body2" className="mb-2">
                {progress.status}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress.progress}
                className="mb-2"
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress.progress)}% complete
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {results.length > 0 && (
        <OCRResultComponent
          results={results}
          isProcessing={isProcessing}
          progress={progress?.progress}
          onCopyText={handleCopyText}
          onSearchInText={handleSearchText}
        />
      )}
    </Box>
  );
}
