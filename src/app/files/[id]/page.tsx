"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import AuthGuard from "@/components/auth/AuthGuard";
import { PDFViewer } from "@/components/pdf";
import { useFileViewer } from "@/hooks/useFileViewer";
import { useFileViewerActions } from "@/hooks/useFileViewerActions";
import { usePDFViewerStore } from "@/stores";
import {
  FileViewerToolbar,
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

  // PDF viewer store for bottom toolbar
  const { numPages, scale, zoomIn, zoomOut } = usePDFViewerStore();

  // Handle scroll to page
  const handleScrollToPage = (pageNumber: number) => {
    const pageElement = document.getElementById(`page_${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      <FileViewerToolbar
        file={file}
        onBack={handleBack}
        onOCR={() => file && handleOCR(file)}
        onDownload={() => file && fileUrl && handleDownload(file, fileUrl)}
      />

      <Box sx={{ height: "calc(100vh - 64px)" }}>
        <PDFViewer fileUrl={fileUrl} fileId={fileId} />
      </Box>

      {/* Bottom Toolbar */}
      <FileViewerBottomToolbar
        numPages={numPages}
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onScrollToPage={handleScrollToPage}
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
