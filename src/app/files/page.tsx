"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Description,
  MoreVert,
  Download,
  Delete,
  Visibility,
  TextFields,
  CloudUpload,
} from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  getUserPDFFiles,
  deletePDFFile,
  getPDFDownloadUrl,
} from "@/utils/uploadUtils";

interface PDFFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  public_url?: string;
}

function FilesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadFiles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userFiles = await getUserPDFFiles(user!.id);
      setFiles(userFiles);
    } catch (err) {
      console.error("Error loading files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user, loadFiles]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    file: PDFFile
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = async (file: PDFFile) => {
    try {
      const downloadUrl = await getPDFDownloadUrl(file.file_path);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download file");
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFile || !user) return;

    try {
      setDeleting(true);
      await deletePDFFile(selectedFile.id, user.id);
      setFiles(files.filter((f) => f.id !== selectedFile.id));
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (file: PDFFile) => {
    // Navigate to PDF viewer page
    router.push(`/viewer/${file.id}`);
    handleMenuClose();
  };

  const handleOCR = (file: PDFFile) => {
    // Navigate to OCR page with file
    router.push(`/ocr?fileId=${file.id}`);
    handleMenuClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Container maxWidth="lg" className="py-8">
          <Box className="flex justify-center items-center py-20">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <Box className="mb-8 flex justify-between items-center">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              My PDF Files
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Manage your uploaded PDF files
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => router.push("/upload")}
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            Upload New
          </Button>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {files.length === 0 ? (
          <Card sx={{ backgroundColor: "white" }}>
            <CardContent className="text-center py-16">
              <Description className="text-7xl text-gray-300 mb-6" />
              <Typography
                variant="h6"
                className="text-gray-500 mb-3 font-semibold"
              >
                No files uploaded yet
              </Typography>
              <Typography variant="body1" className="text-gray-400 mb-8">
                Upload your first PDF file to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => router.push("/upload")}
                sx={{
                  backgroundColor: "#dc2626",
                  "&:hover": {
                    backgroundColor: "#b91c1c",
                  },
                }}
              >
                Upload PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {files.map((file) => (
              <Box key={file.id}>
                <Card
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    "&:hover": {
                      boxShadow: "0 4px 12px 0 rgb(0 0 0 / 0.15)",
                    },
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <CardContent className="p-4">
                    <Box className="flex justify-between items-start mb-3">
                      <Description className="text-red-500 text-3xl" />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, file)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      className="font-semibold mb-2 text-gray-800 truncate"
                      title={file.filename}
                    >
                      {file.filename}
                    </Typography>

                    <Box className="flex flex-wrap gap-2 mb-3">
                      <Chip
                        label={formatFileSize(file.file_size)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="PDF"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" className="text-gray-500 mb-4">
                      Uploaded {formatDate(file.upload_date)}
                    </Typography>

                    <Box className="flex gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleView(file)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<TextFields />}
                        onClick={() => handleOCR(file)}
                        className="flex-1"
                        sx={{
                          borderColor: "#7c3aed",
                          color: "#7c3aed",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderColor: "#6d28d9",
                          },
                        }}
                      >
                        OCR
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedFile && handleView(selectedFile)}>
            <Visibility className="mr-2" />
            View
          </MenuItem>
          <MenuItem onClick={() => selectedFile && handleOCR(selectedFile)}>
            <TextFields className="mr-2" />
            OCR
          </MenuItem>
          <MenuItem
            onClick={() => selectedFile && handleDownload(selectedFile)}
          >
            <Download className="mr-2" />
            Download
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <Delete className="mr-2" />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete File</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{selectedFile?.filename}
              &quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
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
