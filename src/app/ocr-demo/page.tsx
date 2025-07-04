"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { OCRResult } from "@/utils/ocrUtils";

// Dynamically import OCRProcessor to avoid SSR issues
const OCRProcessor = dynamic(() => import("@/components/ocr/OCRProcessor"), {
  ssr: false,
  loading: () => <Typography>Loading OCR processor...</Typography>,
});

export default function OCRDemoPage() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);

  const handleUrlSubmit = () => {
    // Basic URL validation
    if (!pdfUrl.trim()) {
      alert("Please enter a PDF URL");
      return;
    }

    if (!pdfUrl.toLowerCase().endsWith(".pdf") && !pdfUrl.includes("pdf")) {
      alert("Please enter a valid PDF URL");
      return;
    }
  };

  const handleOCRResults = (results: OCRResult[]) => {
    setOcrResults(results);
  };

  const samplePdfUrls = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h3" component="h1" className="mb-6 text-center">
        PDF OCR Demo
      </Typography>

      <Typography variant="body1" className="mb-6 text-center text-gray-600">
        Extract text from PDF files using Optical Character Recognition (OCR)
      </Typography>

      <Paper className="p-6 mb-6">
        <Typography variant="h6" className="mb-4">
          Enter PDF URL
        </Typography>

        <Box className="flex flex-col gap-4">
          <TextField
            fullWidth
            label="PDF URL"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="https://example.com/document.pdf"
            variant="outlined"
          />

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUrlSubmit}
            disabled={!pdfUrl.trim()}
          >
            Load PDF
          </Button>

          <Box>
            <Typography variant="subtitle2" className="mb-2">
              Sample PDFs (for testing):
            </Typography>
            {samplePdfUrls.map((url, index) => (
              <Button
                key={index}
                variant="text"
                size="small"
                onClick={() => setPdfUrl(url)}
                className="mr-2 mb-2"
              >
                Sample {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      <Alert severity="info" className="mb-6">
        <Typography variant="body2">
          <strong>Note:</strong> OCR processing happens entirely in your browser
          for privacy and security. Large PDF files may take some time to
          process. Make sure the PDF URL is publicly accessible.
        </Typography>
      </Alert>

      {pdfUrl && <OCRProcessor pdfUrl={pdfUrl} onResults={handleOCRResults} />}

      {ocrResults.length > 0 && (
        <Paper className="p-6 mt-6">
          <Typography variant="h6" className="mb-4">
            Summary
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box className="text-center">
              <Typography variant="h4" color="primary">
                {ocrResults.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pages Processed
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="h4" color="primary">
                {ocrResults.reduce((sum, r) => sum + r.text.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Characters Extracted
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="h4" color="primary">
                {Math.round(
                  ocrResults.reduce((sum, r) => sum + r.confidence, 0) /
                    ocrResults.length
                )}
                %
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Confidence
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
