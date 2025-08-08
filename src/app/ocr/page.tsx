"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";
import { CloudUpload, TextFields } from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import OCRProcessor from "@/components/ocr/OCRProcessor";

function OCRContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadError(null);
      
      // Create object URL for the PDF
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      setUploadError("Please select a valid PDF file");
      setSelectedFile(null);
      setPdfUrl(null);
    }
  };

  const handleOCRResults = (results: any[]) => {
    console.log("OCR Results:", results);
    // You can handle the results here, e.g., save to database
  };

  const resetFile = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    setUploadError(null);
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
              
              {uploadError && (
                <Alert severity="error" className="mb-4 max-w-md mx-auto">
                  {uploadError}
                </Alert>
              )}

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
                  <Button
                    variant="outlined"
                    onClick={resetFile}
                    color="error"
                  >
                    Remove File
                  </Button>
                </Box>
                <Divider />
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: "white" }}>
              <CardContent>
                <OCRProcessor
                  pdfUrl={pdfUrl}
                  onResults={handleOCRResults}
                />
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
                • OCR (Optical Character Recognition) extracts text from PDF images
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                • Processing is done locally in your browser for privacy
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                • Supports multiple languages including English, Vietnamese, and more
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
