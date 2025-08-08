"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import { CloudUpload, TextFields } from "@mui/icons-material";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import OCRProcessor from "@/components/ocr/OCRProcessor";
import { useOCRStore, useUIStore, useSettingsStore } from "@/stores";

function OCRContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Zustand stores
  const { setCurrentResults } = useOCRStore();
  const { showSuccessNotification, showErrorNotification } = useUIStore();
  const { max_file_size } = useSettingsStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
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

      // Create object URL for the PDF
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      showSuccessNotification(
        "File Selected",
        "PDF file ready for OCR processing"
      );
    } else {
      showErrorNotification("Invalid file", "Please select a valid PDF file");
      setSelectedFile(null);
      setPdfUrl(null);
    }
  };

  const handleOCRResults = (
    results: Array<{
      pageNumber: number;
      text: string;
      confidence: number;
    }>
  ) => {
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

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            OCR Scanner
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Extract text from PDF files using Optical Character Recognition
          </Typography>
        </Box>

        {!pdfUrl ? (
          <Card sx={{ backgroundColor: "white", mb: 4 }}>
            <CardContent className="text-center py-12">
              <TextFields className="text-6xl text-purple-500 mb-4" />
              <Typography variant="h5" className="font-semibold mb-4">
                Upload PDF for OCR Processing
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-6">
                Select a PDF file to extract text using OCR technology
              </Typography>

              {/* Error handling is now done through Zustand notifications */}

              <input
                accept="application/pdf"
                style={{ display: "none" }}
                id="pdf-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="pdf-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                  size="large"
                  sx={{
                    backgroundColor: "#7c3aed",
                    "&:hover": {
                      backgroundColor: "#6d28d9",
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Choose PDF File
                </Button>
              </label>

              <Box className="mt-6">
                <Typography variant="body2" className="text-gray-500">
                  Supported format: PDF files only
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box>
            <Card sx={{ backgroundColor: "white", mb: 4 }}>
              <CardContent>
                <Box className="flex items-center justify-between mb-4">
                  <Box>
                    <Typography variant="h6" className="font-semibold">
                      Selected File
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {selectedFile?.name}
                    </Typography>
                  </Box>
                  <Button variant="outlined" onClick={resetFile} color="error">
                    Remove File
                  </Button>
                </Box>
                <Divider />
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: "white" }}>
              <CardContent>
                <OCRProcessor pdfUrl={pdfUrl} onResults={handleOCRResults} />
              </CardContent>
            </Card>
          </Box>
        )}

        <Box className="mt-8">
          <Card sx={{ backgroundColor: "#f8fafc" }}>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-3">
                About OCR Processing
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                • OCR (Optical Character Recognition) extracts text from PDF
                images
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                • Processing is done locally in your browser for privacy
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                • Supports multiple languages including English, Vietnamese, and
                more
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                • Results can be copied, searched, and exported
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default function OCRPage() {
  return (
    <AuthGuard>
      <OCRContent />
    </AuthGuard>
  );
}
