"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import AuthGuard from "@/components/auth/AuthGuard";
import { PDFViewer } from "@/components/pdf";
import { useFileViewer } from "@/hooks/useFileViewer";
import { useFileViewerActions } from "@/hooks/useFileViewerActions";
import {
  FileViewerToolbar,
  FileViewerLoading,
  FileViewerError,
} from "@/components/file-viewer";

function FileViewerContent() {
  const params = useParams();
  const fileId = params.id as string;

  // Custom hooks
  const { file, fileUrl, isLoading, error } = useFileViewer(fileId);
  const { handleDownload, handleOCR, handleBack } = useFileViewerActions();

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
