import React from "react";
import { Document, Page } from "react-pdf";
import { Box, Typography, CircularProgress } from "@mui/material";
import PDFHighlightOverlay from "./PDFHighlightOverlay";
import PDFTextAnnotationOverlay from "./PDFTextAnnotationOverlay";
import PDFDrawingOverlay from "./PDFDrawingOverlay";

interface PDFDocumentProps {
  fileUrl: string;
  numPages: number;
  scale: number;
  rotation?: number;
  viewMode?: "single" | "continuous";
  currentPage?: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}

export default function PDFDocument({
  fileUrl,
  numPages,
  scale,
  rotation = 0,
  viewMode = "continuous",
  currentPage = 1,
  onLoadSuccess,
  onLoadError,
}: PDFDocumentProps) {
  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading={
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading PDF...
          </Typography>
        </Box>
      }
    >
      {/* Render pages based on view mode */}
      {viewMode === "single" ? (
        // Single page view - only show current page
        <Box
          key={`page_${currentPage}`}
          id={`page_${currentPage}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            userSelect: "text",
            pointerEvents: "auto",
            position: "relative", // Ensure proper positioning for annotations
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Page
              pageNumber={currentPage}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
            <PDFHighlightOverlay pageNumber={currentPage} />
            <PDFTextAnnotationOverlay pageNumber={currentPage} />
            <PDFDrawingOverlay pageNumber={currentPage} />
          </Box>
        </Box>
      ) : (
        // Continuous view - show all pages
        Array.from(new Array(numPages), (_, index) => (
          <Box
            key={`page_${index + 1}`}
            id={`page_${index + 1}`}
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "center",
              userSelect: "text",
              pointerEvents: "auto",
              position: "relative", // Ensure proper positioning for annotations
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Page
                pageNumber={index + 1}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
              <PDFHighlightOverlay pageNumber={index + 1} />
              <PDFTextAnnotationOverlay pageNumber={index + 1} />
              <PDFDrawingOverlay pageNumber={index + 1} />
            </Box>
          </Box>
        ))
      )}
    </Document>
  );
}
