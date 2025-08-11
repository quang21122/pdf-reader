"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import { usePDFViewerStore } from "@/stores";

interface PDFTextAnnotationOverlayProps {
  pageNumber: number;
}

export default function PDFTextAnnotationOverlay({
  pageNumber,
}: PDFTextAnnotationOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const {
    getTextAnnotationsForPage,
    removeTextAnnotation,
    updateTextAnnotation,
  } = usePDFViewerStore();

  const textAnnotations = getTextAnnotationsForPage(pageNumber);

  // Position overlay to match text layer exactly with error handling
  useEffect(() => {
    if (!overlayRef.current) return;

    const positionOverlay = () => {
      try {
        const pageElement = overlayRef.current?.closest('[id^="page_"]');
        if (!pageElement) return;

        // Get page container for positioning
        const pageContainer = pageElement.querySelector(".react-pdf__Page");

        if (pageContainer && overlayRef.current) {
          const containerRect = pageContainer.getBoundingClientRect();
          const pageRect = pageElement.getBoundingClientRect();

          if (pageRect.width > 0 && pageRect.height > 0) {
            // Use page container for positioning to avoid text layer conflicts
            const offsetX = containerRect.x - pageRect.x;
            const offsetY = containerRect.y - pageRect.y;

            overlayRef.current.style.left = `${offsetX}px`;
            overlayRef.current.style.top = `${offsetY}px`;
            overlayRef.current.style.width = `${containerRect.width}px`;
            overlayRef.current.style.height = `${containerRect.height}px`;
          }
        }
      } catch (error) {
        console.warn("Error positioning text annotation overlay:", error);
      }
    };

    // Use timeout to avoid conflicts with text layer rendering
    const timeoutId = setTimeout(positionOverlay, 100);

    return () => clearTimeout(timeoutId);
  }, [pageNumber, textAnnotations]);

  const handleStartEdit = (annotation: any) => {
    setEditingId(annotation.id);
    setEditText(annotation.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateTextAnnotation(editingId, { text: editText.trim() });
    }
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: string) => {
    removeTextAnnotation(id);
  };

  if (textAnnotations.length === 0) {
    return null;
  }

  return (
    <Box
      ref={overlayRef}
      sx={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 3, // Above highlights
      }}
    >
      {textAnnotations.map((annotation) => (
        <Box
          key={annotation.id}
          sx={{
            position: "absolute",
            left: `${annotation.position.x}%`,
            top: `${annotation.position.y}%`,
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            minWidth: "100px",
          }}
        >
          {editingId === annotation.id ? (
            // Edit mode
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TextField
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                size="small"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: `${annotation.fontSize}px`,
                    fontFamily: annotation.fontFamily,
                    color: annotation.color,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    minWidth: "120px",
                  },
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit();
                  } else if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
              />
              <IconButton
                size="small"
                onClick={handleSaveEdit}
                sx={{
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.2)" },
                }}
              >
                <Check fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancelEdit}
                sx={{
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.2)" },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            // Display mode
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                padding: "2px 6px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "4px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  fontSize: `${annotation.fontSize}px`,
                  fontFamily: annotation.fontFamily,
                  color: annotation.color,
                  cursor: "pointer",
                  minWidth: "60px",
                }}
                onClick={() => handleStartEdit(annotation)}
              >
                {annotation.text}
              </Box>
              <IconButton
                size="small"
                onClick={() => handleStartEdit(annotation)}
                sx={{
                  padding: "2px",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(annotation.id)}
                sx={{
                  padding: "2px",
                  "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.04)" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
