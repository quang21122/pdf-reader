import React, { useState, useEffect } from "react";
import { Box, Toolbar, Typography, IconButton, TextField } from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

interface FileViewerBottomToolbarProps {
  numPages: number;
  currentPage: number;
  scale: number;
  viewMode: "single" | "continuous";
  onZoomIn: () => void;
  onZoomOut: () => void;
  onScrollToPage: (pageNumber: number) => void;
  onPageChange: (pageNumber: number) => void;
}

export default function FileViewerBottomToolbar({
  numPages,
  currentPage,
  scale,
  viewMode,
  onZoomIn,
  onZoomOut,
  onScrollToPage,
  onPageChange,
}: FileViewerBottomToolbarProps) {
  const [pageInput, setPageInput] = useState<string>(currentPage.toString());

  // Update page input when current page changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Detect current visible page using Intersection Observer (only in continuous mode)
  useEffect(() => {
    if (viewMode !== "continuous") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the page that's most visible
        let mostVisiblePage = 1;
        let maxVisibleRatio = 0;

        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > maxVisibleRatio
          ) {
            maxVisibleRatio = entry.intersectionRatio;
            const pageId = entry.target.id;
            const pageNumber = parseInt(pageId.replace("page_", ""));
            if (!isNaN(pageNumber)) {
              mostVisiblePage = pageNumber;
            }
          }
        });

        if (maxVisibleRatio > 0.3) {
          // Only update if at least 30% of page is visible
          onPageChange(mostVisiblePage);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: "-20% 0px -20% 0px", // Trigger when page is in middle 60% of viewport
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better detection
      }
    );

    // Observe all page elements
    const observePages = () => {
      const pages = document.querySelectorAll('[id^="page_"]');
      pages.forEach((page) => observer.observe(page));
    };

    // Initial observation
    observePages();

    // Re-observe if pages are added dynamically
    const checkInterval = setInterval(observePages, 1000);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
    };
  }, [viewMode, onPageChange]);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= numPages) {
      onPageChange(pageNum);
      if (viewMode === "continuous") {
        onScrollToPage(pageNum);
      }
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const goToFirstPage = () => {
    onPageChange(1);
    if (viewMode === "continuous") {
      onScrollToPage(1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      onPageChange(newPage);
      if (viewMode === "continuous") {
        onScrollToPage(newPage);
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      const newPage = currentPage + 1;
      onPageChange(newPage);
      if (viewMode === "continuous") {
        onScrollToPage(newPage);
      }
    }
  };

  const goToLastPage = () => {
    onPageChange(numPages);
    if (viewMode === "continuous") {
      onScrollToPage(numPages);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          borderRadius: 0,
          minHeight: "48px !important",
          color: "#424242",
          justifyContent: "space-between",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Page Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* First Page */}
          <IconButton
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            size="small"
            sx={{ color: "#424242" }}
            title="First Page"
          >
            <FirstPage />
          </IconButton>

          {/* Previous Page */}
          <IconButton
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            size="small"
            sx={{ color: "#424242" }}
            title="Previous Page"
          >
            <ChevronLeft />
          </IconButton>

          {/* Page Input */}
          <TextField
            size="small"
            value={pageInput}
            onChange={(e) => handlePageInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            onBlur={handlePageInputSubmit}
            sx={{
              width: 80,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f5f5f5",
                height: "32px",
                textAlign: "center",
                "& input": {
                  textAlign: "center",
                  padding: "4px 8px",
                  color: "#000000",
                  fontWeight: "500",
                },
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />

          {/* Page Separator */}
          <Typography variant="body2" sx={{ color: "#424242" }}>
            / {numPages}
          </Typography>

          {/* Next Page */}
          <IconButton
            onClick={goToNextPage}
            disabled={currentPage === numPages}
            size="small"
            sx={{ color: "#424242" }}
            title="Next Page"
          >
            <ChevronRight />
          </IconButton>

          {/* Last Page */}
          <IconButton
            onClick={goToLastPage}
            disabled={currentPage === numPages}
            size="small"
            sx={{ color: "#424242" }}
            title="Last Page"
          >
            <LastPage />
          </IconButton>
        </Box>

        {/* Zoom Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onZoomOut}
            disabled={scale <= 0.5}
            size="small"
            sx={{ color: "#424242" }}
          >
            <ZoomOut />
          </IconButton>

          <Typography
            variant="body2"
            sx={{ color: "#424242", minWidth: "50px", textAlign: "center" }}
          >
            {Math.round(scale * 100)}%
          </Typography>

          <IconButton
            onClick={onZoomIn}
            disabled={scale >= 3.0}
            size="small"
            sx={{ color: "#424242" }}
          >
            <ZoomIn />
          </IconButton>
        </Box>
      </Toolbar>
    </Box>
  );
}
