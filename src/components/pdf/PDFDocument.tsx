import React from "react";
import { Document, Page } from "react-pdf";
import { Box, Typography, CircularProgress } from "@mui/material";

interface PDFDocumentProps {
  fileUrl: string;
  numPages: number;
  scale: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}

export default function PDFDocument({
  fileUrl,
  numPages,
  scale,
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
      {/* Render all pages */}
      {Array.from(new Array(numPages), (_, index) => (
        <Box
          key={`page_${index + 1}`}
          id={`page_${index + 1}`}
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "center",
            userSelect: "text",
            pointerEvents: "auto",
          }}
        >
          <Page
            pageNumber={index + 1}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={false}
          />
        </Box>
      ))}
    </Document>
  );
}
