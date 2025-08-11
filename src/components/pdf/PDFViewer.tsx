"use client";

import React, { useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import { Box } from "@mui/material";
import { usePDFViewerStore } from "@/stores";
import { usePDFDocumentHandlers } from "@/hooks";
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
    currentPage,
    scale,
    rotation,
    viewMode,
    isLoading,
    error,
    isHighlightMode,
    isTextAnnotationMode,
    highlights,
    textAnnotations,
    setNumPages,
    setCurrentPage,
    setLoading,
    setError,
    clearError,
    setFileUrl,
    setFileId,
    addHighlight,
    getHighlightsForPage,
    addTextAnnotation,
    getTextAnnotationsForPage,
    setTextAnnotationMode,
  } = usePDFViewerStore();

  // Update store when props change
  useEffect(() => {
    setFileUrl(fileUrl || null);
    setFileId(fileId || null);
  }, [fileUrl, fileId, setFileUrl, setFileId]);

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

  // Force reload PDF when URL changes (after save)
  useEffect(() => {
    if (fileUrl && fileUrl.includes("?v=")) {
      console.log("PDF URL changed, forcing reload:", fileUrl);
      // Clear any cached PDF data
      setLoading(true);
      setError(null);
    }
  }, [fileUrl, setLoading, setError]);

  // Handle text highlighting
  useEffect(() => {
    if (!isHighlightMode || !documentRef.current) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      // Get the range and its bounding rectangle
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Find which page this selection belongs to
      let pageNumber = currentPage;
      const pageElement =
        range.startContainer.parentElement?.closest('[id^="page_"]');
      if (pageElement) {
        const pageId = pageElement.id;
        const pageMatch = pageId.match(/page_(\d+)/);
        if (pageMatch) {
          pageNumber = parseInt(pageMatch[1], 10);
        }
      }

      // Find the text layer which contains the actual selectable text
      const textLayer = pageElement?.querySelector(
        ".react-pdf__Page__textContent"
      );
      if (!textLayer) return;

      const textLayerRect = textLayer.getBoundingClientRect();

      // Calculate position relative to the text layer for accurate positioning
      const relativeRect = {
        x: ((rect.x - textLayerRect.x) / textLayerRect.width) * 100,
        y: ((rect.y - textLayerRect.y) / textLayerRect.height) * 100,
        width: (rect.width / textLayerRect.width) * 100,
        height: (rect.height / textLayerRect.height) * 100,
      };

      // Create highlight data
      const highlightData = {
        pageNumber,
        text: selectedText,
        boundingRect: relativeRect,
        color: "#ffff00", // Yellow highlight
      };

      // Add highlight to store
      addHighlight(highlightData);

      // Clear selection
      selection.removeAllRanges();
    };

    const documentElement = documentRef.current;
    documentElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      documentElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isHighlightMode, currentPage, addHighlight]);

  // Handle text annotation mode
  useEffect(() => {
    if (!isTextAnnotationMode || !documentRef.current) return;

    const handleClick = (event: MouseEvent) => {
      // Only handle clicks when in text annotation mode
      if (!isTextAnnotationMode) return;

      try {
        // Find which page this click belongs to
        const target = event.target as HTMLElement;
        const pageElement = target.closest('[id^="page_"]');
        if (!pageElement) return;

        const pageId = pageElement.id;
        const pageMatch = pageId.match(/page_(\d+)/);
        if (!pageMatch) return;

        const pageNumber = parseInt(pageMatch[1], 10);

        // Use page container instead of text layer to avoid conflicts
        const pageContainer = pageElement.querySelector(".react-pdf__Page");
        if (!pageContainer) return;

        const containerRect = pageContainer.getBoundingClientRect();

        // Ensure valid dimensions before proceeding
        if (containerRect.width === 0 || containerRect.height === 0) return;

        // Calculate position relative to the page container
        const relativePosition = {
          x: ((event.clientX - containerRect.x) / containerRect.width) * 100,
          y: ((event.clientY - containerRect.y) / containerRect.height) * 100,
        };

        // Create text annotation with default values
        const annotationData = {
          pageNumber,
          text: "New Text", // Default text that user can edit
          position: relativePosition,
          fontSize: 14,
          color: "#000000",
          fontFamily: "Arial, sans-serif",
        };

        // Add annotation to store
        addTextAnnotation(annotationData);

        // Automatically turn off text annotation mode after adding text
        setTextAnnotationMode(false);
      } catch (error) {
        console.warn("Error adding text annotation:", error);
        // Still turn off annotation mode even if there's an error
        setTextAnnotationMode(false);
      }
    };

    const documentElement = documentRef.current;
    documentElement.addEventListener("click", handleClick);

    return () => {
      documentElement.removeEventListener("click", handleClick);
    };
  }, [isTextAnnotationMode, addTextAnnotation, setTextAnnotationMode]);

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
          cursor: isHighlightMode
            ? "crosshair"
            : isTextAnnotationMode
            ? "text"
            : "default",
        }}
      >
        <PDFLoadingStates isLoading={isLoading} error={error} />

        {!isLoading && !error && (
          <Box
            ref={documentRef}
            sx={{
              // Enable text selection
              userSelect: "text",
              pointerEvents: "auto",
            }}
          >
            <PDFDocument
              fileUrl={fileUrl}
              numPages={numPages}
              currentPage={currentPage}
              scale={scale}
              rotation={rotation}
              viewMode={viewMode}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
