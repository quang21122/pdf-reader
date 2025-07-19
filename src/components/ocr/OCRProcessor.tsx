"use client";

import React from "react";
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
import { useOCR, OCRResult } from "@/hooks";

// Dynamically import OCR utilities to avoid SSR issues
const OCRResultComponent = dynamic(() => import("./OCRResult"), {
  ssr: false,
});

interface OCRProcessorProps {
  pdfUrl?: string;
  onResults?: (results: OCRResult[]) => void;
}

export default function OCRProcessor({ pdfUrl, onResults }: OCRProcessorProps) {
  const {
    results,
    error,
    isClient,
    isProcessing,
    progress,
    selectedLanguage,
    setSelectedLanguage,
    supportedLanguages,
    processOCR,
    copyText,
    searchInText,
    clearError,
  } = useOCR({
    onResults,
  });

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleStartOCR = async () => {
    if (!pdfUrl) {
      return;
    }
    await processOCR(pdfUrl);
  };

  const handleCopyText = (text: string) => {
    copyText(text);
  };

  const handleSearchText = (text: string) => {
    const searchResults = searchInText(text);
    console.log("Search results:", searchResults);
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
              value={selectedLanguage}
              label="Language"
              onChange={handleLanguageChange}
              disabled={isProcessing}
            >
              {supportedLanguages.map((lang) => (
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
            <Alert severity="error" onClose={clearError}>
              {error.message}
            </Alert>
          )}

          {progress && (
            <Box>
              <Typography variant="body2" className="mb-2">
                {progress.status}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress?.progress || 0}
                className="mb-2"
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress?.progress || 0)}% complete
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
