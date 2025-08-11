"use client";

import React, { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  PDFViewer,
  PDFToolbar,
  PDFSidebar,
  PDFSearchDropdown,
  PDFSettingsDialog,
} from "@/components/pdf";
import { useFileViewer } from "@/hooks/useFileViewer";
import { useFileViewerActions } from "@/hooks/useFileViewerActions";
import { useFileViewerState } from "@/hooks";
import { usePDFViewerStore } from "@/stores";
import {
  FileViewerBottomToolbar,
  FileViewerLoading,
  FileViewerError,
} from "@/components/file-viewer";

function FileViewerContent() {
  const params = useParams();
  const fileId = params.id as string;

  const { file, fileUrl, isLoading, error } = useFileViewer(fileId);
  const { handleDownload, handleOCR, handleBack } = useFileViewerActions();
  const {
    sidebarOpen,
    searchDropdownOpen,
    searchAnchorEl,
    settingsDialogOpen,
    handleSidebarToggle,
    handleSidebarClose,
    handleSearchOpen,
    handleSearchClose,
    handleSettingsOpen,
    handleSettingsClose,
    handleBookmark,
  } = useFileViewerState();
  const {
    numPages,
    currentPage,
    scale,
    viewMode,
    fitMode,
    isFullscreen,
    showThumbnails,
    showBookmarks,
    isHighlightMode,
    isTextAnnotationMode,
    hasUnsavedChanges,
    zoomIn,
    zoomOut,
    setViewMode,
    setFitMode,
    setScale,
    setCurrentPage,
    toggleFullscreen,
    toggleDrawMode,
    toggleTextAnnotationMode,
    toggleHighlightMode,
    saveAnnotations,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleThumbnails,
    toggleBookmarks,
    rotateClockwise,
  } = usePDFViewerStore();

  const handleScrollToPage = (pageNumber: number) => {
    const pageElement = document.getElementById(`page_${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSave = useCallback(async () => {
    try {
      await saveAnnotations();
    } catch (error) {
      console.error("Failed to save annotations:", error);
      alert("Failed to save PDF. Please try again.");
    }
  }, [saveAnnotations]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (hasUnsavedChanges) {
          handleSave();
        }
      }

      if (event.ctrlKey && !event.shiftKey && event.key === "z") {
        event.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      if (event.ctrlKey && event.shiftKey && event.key === "Z") {
        event.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, handleSave, undo, redo, canUndo, canRedo]);
  const handleMenuClick = () => {
    handleSidebarToggle();
  };

  const handleSidebarPageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (viewMode === "continuous") {
      handleScrollToPage(pageNumber);
    }
    handleSidebarClose();
  };

  const handleClose = () => {
    handleBack();
  };

  const handleSearchResult = (result: any) => {
    console.log("Search result:", result);
  };

  const handleHighlightToggle = () => {
    toggleHighlightMode();
  };

  if (isLoading) {
    return <FileViewerLoading />;
  }

  if (error) {
    return <FileViewerError error={error} onBack={handleBack} />;
  }
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <PDFToolbar
        filename={file?.filename}
        isFullscreen={isFullscreen}
        viewMode={viewMode}
        isHighlightMode={isHighlightMode}
        isTextAnnotationMode={isTextAnnotationMode}
        hasUnsavedChanges={hasUnsavedChanges}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onMenuClick={handleMenuClick}
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onViewModeChange={setViewMode}
        onDrawToggle={toggleDrawMode}
        onTextAnnotationToggle={toggleTextAnnotationMode}
        onHighlightToggle={handleHighlightToggle}
        onRotate={rotateClockwise}
        onFullscreenToggle={toggleFullscreen}
        onClose={handleClose}
        onSearch={handleSearchOpen}
        onDownload={() => file && fileUrl && handleDownload(file, fileUrl)}
        onOCR={() => file && handleOCR(file)}
        onSettings={handleSettingsOpen}
        onBookmark={handleBookmark}
      />

      <Box sx={{ height: "calc(100vh - 40px)", mt: "40px" }}>
        <PDFViewer fileUrl={fileUrl} fileId={fileId} />
      </Box>

      <FileViewerBottomToolbar
        numPages={numPages}
        currentPage={currentPage}
        scale={scale}
        viewMode={viewMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onScrollToPage={handleScrollToPage}
        onPageChange={setCurrentPage}
      />

      <PDFSidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        fileUrl={fileUrl || ""}
        numPages={numPages}
        currentPage={currentPage}
        onPageClick={handleSidebarPageClick}
      />

      <PDFSearchDropdown
        open={searchDropdownOpen}
        anchorEl={searchAnchorEl}
        onClose={handleSearchClose}
        onSearchResult={handleSearchResult}
        onGoToPage={setCurrentPage}
      />

      <PDFSettingsDialog
        open={settingsDialogOpen}
        onClose={handleSettingsClose}
        viewMode={viewMode}
        fitMode={fitMode}
        scale={scale}
        showThumbnails={showThumbnails}
        showBookmarks={showBookmarks}
        onViewModeChange={setViewMode}
        onFitModeChange={setFitMode}
        onScaleChange={setScale}
        onToggleThumbnails={toggleThumbnails}
        onToggleBookmarks={toggleBookmarks}
      />
    </Box>
  );
}

export default function FileViewerPage() {
  return (
    <AuthGuard>
      <FileViewerContent />
    </AuthGuard>
  );
}
