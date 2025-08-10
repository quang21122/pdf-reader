"use client";

import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Document, Page } from "react-pdf";
import { Description } from "@mui/icons-material";

interface PDFThumbnailProps {
  fileUrl: string;
  pageNumber: number;
  isCurrentPage: boolean;
  onClick: () => void;
}

export default function PDFThumbnail({
  fileUrl,
  pageNumber,
  isCurrentPage,
  onClick,
}: PDFThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoadSuccess = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleLoadError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        mb: 2,
        p: 1.5, // Slightly more padding
        cursor: "pointer",
        backgroundColor: isCurrentPage ? "#0078d4" : "transparent",
        border: isCurrentPage ? "2px solid #0078d4" : "2px solid transparent",
        "&:hover": {
          backgroundColor: isCurrentPage ? "#106ebe" : "#404040",
        },
        transition: "all 0.2s ease",
        maxWidth: "220px", // Limit max width for better proportions
        mx: "auto", // Center the thumbnail
      }}
    >
      {/* Page Thumbnail */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "210/297", // A4 paper ratio (width/height)
          minHeight: "200px", // Minimum height for readability
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!hasError ? (
          <Document
            file={fileUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={
              <Description
                sx={{
                  color: "#666",
                  fontSize: "2rem",
                }}
              />
            }
          >
            <Page
              pageNumber={pageNumber}
              width={180} // Optimized width for A4 aspect ratio
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <Description
                  sx={{
                    color: "#666",
                    fontSize: "2rem",
                  }}
                />
              }
            />
          </Document>
        ) : (
          <Description
            sx={{
              color: "#666",
              fontSize: "2rem",
            }}
          />
        )}
      </Box>

      {/* Page Number */}
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: isCurrentPage ? "white" : "#ccc",
          fontWeight: isCurrentPage ? 600 : 400,
        }}
      >
        {pageNumber}
      </Typography>
    </Box>
  );
}
