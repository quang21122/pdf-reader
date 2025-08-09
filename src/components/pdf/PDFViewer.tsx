"use client";

import React, { useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import { Box } from "@mui/material";
import { usePDFViewerStore } from "@/stores";
import { usePDFTextSelection, usePDFDocumentHandlers } from "@/hooks";
import PDFLoadingStates, { PDFEmptyState } from "./PDFLoadingStates";
import PDFDocument from "./PDFDocument";

// Import CSS for text layer
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl?: string | null;
  fileId?: string;
}

export default function PDFViewer({ fileUrl, fileId }: PDFViewerProps) {
  const documentRef = useRef<HTMLDivElement>(null);

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
    setFileUrl,
    setFileId,
  } = usePDFViewerStore();

  // Update store when props change
  useEffect(() => {
    setFileUrl(fileUrl || null);
    setFileId(fileId || null);
  }, [fileUrl, fileId, setFileUrl, setFileId]);

  // Use PDF text selection hook
  usePDFTextSelection(numPages, scale);

  // Use PDF document handlers hook
  const { onDocumentLoadSuccess, onDocumentLoadError } = usePDFDocumentHandlers(
    {
      setNumPages,
      setCurrentPage,
      setLoading,
      setError,
      clearError,
    }
  );

  if (!fileUrl) {
    return <PDFEmptyState />;
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
      {/* PDF Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: isLoading ? "center" : "flex-start",
          p: 2,
          pb: 8, // Add bottom padding for bottom toolbar
          userSelect: "text",
          pointerEvents: "auto",
        }}
      >
        <PDFLoadingStates isLoading={isLoading} error={error} />

        {!isLoading && !error && (
          <Box
            ref={documentRef}
            sx={{
              // Enable text selection but with control
              userSelect: "text",
              pointerEvents: "auto",
              // Controlled text selection behavior
              "& .react-pdf__Page__textContent": {
                userSelect: "text",
                pointerEvents: "auto",
                position: "relative",
                zIndex: 1,
                "& span": {
                  userSelect: "text",
                  pointerEvents: "auto",
                  display: "inline",
                  position: "relative",
                  cursor: "text",
                },
              },
            }}
          >
            <PDFDocument
              fileUrl={fileUrl}
              numPages={numPages}
              scale={scale}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
