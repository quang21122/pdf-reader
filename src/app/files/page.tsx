"use client";

import React from "react";
import { Container, Box, Alert } from "@mui/material";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useFileManagement, useFileActions } from "@/hooks";
import {
  FileGrid,
  EmptyState,
  FileContextMenu,
  DeleteConfirmDialog,
  LoadingState,
  FilesHeader,
} from "@/components/files";

function FilesContent() {
  // Custom hooks
  const {
    files,
    loading,
    error,
    deleting,
    downloadFile,
    deleteFile,
    setError,
  } = useFileManagement();

  const {
    anchorEl,
    selectedFile,
    deleteDialogOpen,
    handleMenuOpen,
    handleMenuClose,
    handleView,
    handleOCR,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    navigateToUpload,
    isMenuOpen,
  } = useFileActions();

  // Handle download with error handling
  const handleDownload = async (file: any) => {
    await downloadFile(file);
    handleMenuClose();
  };

  // Handle delete confirmation
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm(deleteFile);
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <FilesHeader onUploadClick={navigateToUpload} />

        {error && (
          <Alert
            severity="error"
            className="mb-4"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {files.length === 0 ? (
          <EmptyState onUploadClick={navigateToUpload} />
        ) : (
          <FileGrid
            files={files}
            onMenuOpen={handleMenuOpen}
            onView={handleView}
            onOCR={handleOCR}
          />
        )}

        <FileContextMenu
          anchorEl={anchorEl}
          open={isMenuOpen}
          selectedFile={selectedFile}
          onClose={handleMenuClose}
          onView={handleView}
          onOCR={handleOCR}
          onDownload={handleDownload}
          onDelete={handleDeleteClick}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          file={selectedFile}
          deleting={deleting}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirmAction}
        />
      </Container>
    </Box>
  );
}

export default function FilesPage() {
  return (
    <AuthGuard>
      <FilesContent />
    </AuthGuard>
  );
}
