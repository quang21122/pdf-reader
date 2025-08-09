"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Box,
  Typography,
  IconButton,
  Toolbar,
  CircularProgress,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import { ZoomIn, ZoomOut, KeyboardArrowDown } from "@mui/icons-material";
import { usePDFViewerStore } from "@/stores";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl?: string | null;
  fileId?: string;
}

export default function PDFViewer({ fileUrl, fileId }: PDFViewerProps) {
  // Zustand store
  const {
    numPages,
    scale,
    isLoading,
    error,
    setNumPages,
    setCurrentPage,
    setLoading,
    setError,
    clearError,
    zoomIn,
    zoomOut,
    setFileUrl,
    setFileId,
  } = usePDFViewerStore();

  // Local state for scroll to page
  const [scrollToPage, setScrollToPage] = useState<string>("");

  // Update store when props change
  useEffect(() => {
    setFileUrl(fileUrl || null);
    setFileId(fileId || null);
  }, [fileUrl, fileId, setFileUrl, setFileId]);

  // Function to scroll to specific page
  const handleScrollToPage = () => {
    const pageNum = parseInt(scrollToPage);
    if (pageNum >= 1 && pageNum <= numPages) {
      const pageElement = document.getElementById(`page_${pageNum}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setScrollToPage("");
  };

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

  if (!fileUrl) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No PDF file to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Controls Toolbar */}
      <Toolbar
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          minHeight: "48px !important",
        }}
      >
        <Typography variant="body2" sx={{ mr: 2 }}>
          Total Pages: {numPages}
        </Typography>

        <TextField
          size="small"
          placeholder="Go to page"
          value={scrollToPage}
          onChange={(e) => setScrollToPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleScrollToPage();
            }
          }}
          sx={{ width: 120, mr: 1 }}
        />

        <Button
          size="small"
          onClick={handleScrollToPage}
          disabled={!scrollToPage}
          startIcon={<KeyboardArrowDown />}
        >
          Go
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
          <ZoomOut />
        </IconButton>

        <Typography variant="body2" sx={{ mx: 1 }}>
          {Math.round(scale * 100)}%
        </Typography>

        <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
          <ZoomIn />
        </IconButton>
      </Toolbar>

      {/* PDF Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: isLoading ? "center" : "flex-start",
          p: 2,
        }}
      >
        {isLoading && (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading PDF...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading PDF...
                </Typography>
              </Box>
            }
          >
            {/* Render all pages */}
            {Array.from(new Array(numPages), (_, index) => (
              <Box
                key={`page_${index + 1}`}
                id={`page_${index + 1}`}
                sx={{
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Box>
            ))}
          </Document>
        )}
      </Box>
    </Box>
  );
}
