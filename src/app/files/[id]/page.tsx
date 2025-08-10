"use client";

import React, { useState } from "react";
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

  // Custom hooks
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

  // PDF viewer store for toolbar and bottom toolbar
  const {
    numPages,
    currentPage,
    scale,
    viewMode,
    fitMode,
    isFullscreen,
    showThumbnails,
    showBookmarks,
    zoomIn,
    zoomOut,
    setViewMode,
    setFitMode,
    setScale,
    setCurrentPage,
    toggleFullscreen,
    toggleDrawMode,
    toggleTextSelectMode,
    toggleThumbnails,
    toggleBookmarks,
    rotateClockwise,
  } = usePDFViewerStore();

  // Handle scroll to page
  const handleScrollToPage = (pageNumber: number) => {
    const pageElement = document.getElementById(`page_${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Toolbar handlers
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

  const handleAskCopilot = () => {
    // Open AI assistant
    console.log("Ask Copilot clicked");
  };

  const handleClose = () => {
    handleBack();
  };

  const handleSearchResult = (result: any) => {
    console.log("Search result:", result);
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading state
  if (isLoading) {
    return <FileViewerLoading />;
  }

  // Error state
  if (error) {
    return <FileViewerError error={error} onBack={handleBack} />;
  }

  // Main content
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <PDFToolbar
        filename={file?.filename}
        isFullscreen={isFullscreen}
        viewMode={viewMode}
        onMenuClick={handleMenuClick}
        onViewModeChange={setViewMode}
        onDrawToggle={toggleDrawMode}
        onTextSelect={toggleTextSelectMode}
        onRotate={rotateClockwise}
        onAskCopilot={handleAskCopilot}
        onFullscreenToggle={toggleFullscreen}
        onClose={handleClose}
        onSearch={handleSearchOpen}
        onPrint={handlePrint}
        onDownload={() => file && fileUrl && handleDownload(file, fileUrl)}
        onOCR={() => file && handleOCR(file)}
        onSettings={handleSettingsOpen}
        onBookmark={handleBookmark}
      />

      <Box sx={{ height: "calc(100vh - 40px)", mt: "40px" }}>
        <PDFViewer fileUrl={fileUrl} fileId={fileId} />
      </Box>

      {/* Bottom Toolbar */}
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

      {/* PDF Sidebar */}
      <PDFSidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        fileUrl={fileUrl || ""}
        numPages={numPages}
        currentPage={currentPage}
        onPageClick={handleSidebarPageClick}
      />

      {/* PDF Search Dropdown */}
      <PDFSearchDropdown
        open={searchDropdownOpen}
        anchorEl={searchAnchorEl}
        onClose={handleSearchClose}
        onSearchResult={handleSearchResult}
        onGoToPage={setCurrentPage}
      />

      {/* PDF Settings Dialog */}
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
