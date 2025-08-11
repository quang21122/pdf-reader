"use client";

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { usePDFViewerStore } from "@/stores";

interface PDFHighlightOverlayProps {
  pageNumber: number;
}

export default function PDFHighlightOverlay({
  pageNumber,
}: PDFHighlightOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { getHighlightsForPage } = usePDFViewerStore();
  const highlights = getHighlightsForPage(pageNumber);

  // Position overlay to match text layer exactly
  useEffect(() => {
    if (!overlayRef.current) return;

    const pageElement = overlayRef.current.closest('[id^="page_"]');
    const textLayer = pageElement?.querySelector(
      ".react-pdf__Page__textContent"
    );

    if (textLayer && overlayRef.current) {
      const textLayerRect = textLayer.getBoundingClientRect();
      const pageRect = pageElement?.getBoundingClientRect();

      if (pageRect) {
        // Position overlay to match text layer exactly
        const offsetX = textLayerRect.x - pageRect.x;
        const offsetY = textLayerRect.y - pageRect.y;

        overlayRef.current.style.left = `${offsetX}px`;
        overlayRef.current.style.top = `${offsetY}px`;
        overlayRef.current.style.width = `${textLayerRect.width}px`;
        overlayRef.current.style.height = `${textLayerRect.height}px`;
      }
    }
  }, [pageNumber, highlights]);

  if (highlights.length === 0) {
    return null;
  }

  return (
    <Box
      ref={overlayRef}
      sx={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 2, // Higher z-index to ensure it's above text layer
      }}
    >
      {highlights.map((highlight) => (
        <Box
          key={highlight.id}
          sx={{
            position: "absolute",
            backgroundColor: highlight.color,
            opacity: 0.4,
            left: `${highlight.boundingRect.x}%`,
            top: `${highlight.boundingRect.y}%`,
            width: `${highlight.boundingRect.width}%`,
            height: `${highlight.boundingRect.height}%`,
            pointerEvents: "auto",
            cursor: "pointer",
            borderRadius: "1px",
            mixBlendMode: "multiply",
            "&:hover": {
              opacity: 0.6,
            },
          }}
          title={`Highlighted text: "${highlight.text}"`}
        />
      ))}
    </Box>
  );
}
