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
    isDrawMode,
    isEraseMode,
    drawColor,
    drawStrokeWidth,
    isHighlightMode,
    isTextAnnotationMode,
    highlights,
    textAnnotations,
    drawings,
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
    addDrawing,
    getDrawingsForPage,
    removeDrawing,
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
      // Clear any cached PDF data
      setLoading(true);
      setError(null);
    }
  }, [fileUrl, setLoading, setError]);

  // Add event listener for custom refresh events
  useEffect(() => {
    const handleCustomRefresh = () => {
      if (fileUrl) {
        // Force refresh by updating URL with timestamp
        const baseUrl = fileUrl.split("?")[0];
        const refreshUrl = `${baseUrl}?refresh=${Date.now()}`;
        setFileUrl(refreshUrl);
        setLoading(true);
        setError(null);
      }
    };

    window.addEventListener("pdfRefresh", handleCustomRefresh);
    return () => window.removeEventListener("pdfRefresh", handleCustomRefresh);
  }, [fileUrl, setFileUrl, setLoading, setError]);

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

  // Handle drawing mode
  useEffect(() => {
    if (!isDrawMode || !documentRef.current) return;

    let isDrawing = false;
    let currentPath: { x: number; y: number }[] = [];
    let currentPageNumber = 1;
    let currentCanvas: HTMLCanvasElement | null = null;
    let currentContext: CanvasRenderingContext2D | null = null;

    const createTemporaryCanvas = (pageContainer: Element) => {
      // Remove any existing temporary canvas
      const existingCanvas = pageContainer.querySelector(
        ".temporary-drawing-canvas"
      );
      if (existingCanvas) {
        existingCanvas.remove();
      }

      const canvas = document.createElement("canvas");
      canvas.className = "temporary-drawing-canvas";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "10";

      const rect = pageContainer.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      pageContainer.appendChild(canvas);
      return canvas;
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!isDrawMode) return;

      try {
        const target = event.target as HTMLElement;
        const pageElement = target.closest('[id^="page_"]');
        if (!pageElement) return;

        const pageId = pageElement.id;
        const pageMatch = pageId.match(/page_(\d+)/);
        if (!pageMatch) return;

        currentPageNumber = parseInt(pageMatch[1], 10);
        const pageContainer = pageElement.querySelector(
          ".react-pdf__Page"
        ) as HTMLElement;
        if (!pageContainer) return;

        const containerRect = pageContainer.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) return;

        // Create temporary canvas for real-time drawing
        currentCanvas = createTemporaryCanvas(pageContainer);
        currentContext = currentCanvas.getContext("2d");

        if (currentContext) {
          currentContext.strokeStyle = drawColor;
          currentContext.lineWidth = drawStrokeWidth;
          currentContext.lineCap = "round";
          currentContext.lineJoin = "round";
        }

        const relativePosition = {
          x: ((event.clientX - containerRect.x) / containerRect.width) * 100,
          y: ((event.clientY - containerRect.y) / containerRect.height) * 100,
        };

        isDrawing = true;
        currentPath = [relativePosition];

        // Start drawing on canvas
        if (currentContext) {
          currentContext.beginPath();
          const canvasX = (relativePosition.x / 100) * currentCanvas.width;
          const canvasY = (relativePosition.y / 100) * currentCanvas.height;
          currentContext.moveTo(canvasX, canvasY);
        }
      } catch (error) {
        console.warn("Error starting drawing:", error);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || !isDrawMode || !currentContext || !currentCanvas)
        return;

      try {
        const target = event.target as HTMLElement;
        const pageElement = target.closest('[id^="page_"]');
        if (!pageElement) return;

        const pageContainer = pageElement.querySelector(
          ".react-pdf__Page"
        ) as HTMLElement;
        if (!pageContainer) return;

        const containerRect = pageContainer.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) return;

        const relativePosition = {
          x: ((event.clientX - containerRect.x) / containerRect.width) * 100,
          y: ((event.clientY - containerRect.y) / containerRect.height) * 100,
        };

        currentPath.push(relativePosition);

        // Draw line on canvas
        const canvasX = (relativePosition.x / 100) * currentCanvas.width;
        const canvasY = (relativePosition.y / 100) * currentCanvas.height;
        currentContext.lineTo(canvasX, canvasY);
        currentContext.stroke();
      } catch (error) {
        console.warn("Error during drawing:", error);
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing || currentPath.length < 2) {
        isDrawing = false;
        currentPath = [];

        // Clean up temporary canvas
        if (currentCanvas) {
          currentCanvas.remove();
          currentCanvas = null;
          currentContext = null;
        }
        return;
      }

      // Create drawing data
      const drawingData = {
        pageNumber: currentPageNumber,
        paths: [currentPath],
        color: drawColor,
        strokeWidth: drawStrokeWidth,
      };

      // Add drawing to store
      addDrawing(drawingData);

      isDrawing = false;
      currentPath = [];

      // Clean up temporary canvas
      if (currentCanvas) {
        currentCanvas.remove();
        currentCanvas = null;
        currentContext = null;
      }
    };

    const documentElement = documentRef.current;
    documentElement.addEventListener("mousedown", handleMouseDown);
    documentElement.addEventListener("mousemove", handleMouseMove);
    documentElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      documentElement.removeEventListener("mousedown", handleMouseDown);
      documentElement.removeEventListener("mousemove", handleMouseMove);
      documentElement.removeEventListener("mouseup", handleMouseUp);

      // Clean up any remaining temporary canvas
      const canvases = documentElement.querySelectorAll(
        ".temporary-drawing-canvas"
      );
      canvases.forEach((canvas) => canvas.remove());
    };
  }, [isDrawMode, drawColor, drawStrokeWidth, addDrawing]);

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
            : isDrawMode
            ? "crosshair"
            : isEraseMode
            ? "pointer"
            : "default",
        }}
      >
        <PDFLoadingStates isLoading={isLoading} error={error} />

        {!isLoading && !error && (
          <Box
            ref={documentRef}
            data-pdf-viewer="true"
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
