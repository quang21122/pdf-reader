"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Alert,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Download, TextFields } from "@mui/icons-material";
import AuthGuard from "@/components/auth/AuthGuard";
import { PDFViewer } from "@/components/pdf";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotifications } from "@/hooks/useNotifications";
import { getPDFDownloadUrl } from "@/utils/uploadUtils";
import { apolloClient } from "@/graphql/client";
import { GET_PDF_FILE_BY_ID } from "@/graphql/queries";
import type { PDFFile } from "@/hooks/useFileManagement";
import { useFileViewerStore } from "@/stores";

function FileViewerContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { error: showErrorNotification, success: showSuccessNotification } =
    useNotifications();

  // Zustand store
  const {
    file,
    fileUrl,
    isLoading: loading,
    error,
    setFile,
    setFileUrl,
    setLoading,
    setError,
  } = useFileViewerStore();

  const fileId = params.id as string;

  // Load file data
  useEffect(() => {
    const loadFile = async () => {
      if (!user || !fileId) return;

      try {
        setLoading(true);
        setError(null);

        // Get file metadata from GraphQL
        const { data } = await apolloClient.query({
          query: GET_PDF_FILE_BY_ID,
          variables: { id: fileId, userId: user.id },
          fetchPolicy: "network-only",
        });

        if (!data.getPDFFile) {
          setError("File not found or you don't have permission to view it");
          return;
        }

        const fileData = data.getPDFFile;
        setFile(fileData);

        // Get download URL for viewing
        const downloadUrl = await getPDFDownloadUrl(fileData.file_path);
        setFileUrl(downloadUrl);
      } catch (err) {
        console.error("Error loading file:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load file";
        setError(errorMessage);
        showErrorNotification("Load Failed", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [
    user,
    fileId,
    showErrorNotification,
    setError,
    setFile,
    setFileUrl,
    setLoading,
  ]);

  // Handle download
  const handleDownload = async () => {
    if (!file || !fileUrl) return;

    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessNotification(
        "Download Started",
        `Downloading ${file.filename}`
      );
    } catch (err) {
      console.error("Download error:", err);
      showErrorNotification("Download Failed", "Failed to download file");
    }
  };

  // Handle OCR navigation
  const handleOCR = () => {
    if (!file) return;
    router.push(`/ocr?fileId=${file.id}`);
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/files");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading PDF...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              PDF Viewer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {file?.filename || "PDF Viewer"}
          </Typography>

          <IconButton color="inherit" onClick={handleOCR} title="OCR">
            <TextFields />
          </IconButton>
          <IconButton color="inherit" onClick={handleDownload} title="Download">
            <Download />
          </IconButton>
        </Toolbar>
      </AppBar>

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
