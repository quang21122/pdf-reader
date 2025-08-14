"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Alert,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Description,
  Restore,
  DeleteForever,
  ArrowBack,
} from "@mui/icons-material";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUIStore } from "@/stores";
import { useQuery } from "@apollo/client";
import { GET_DELETED_PDF_FILES } from "@/graphql/queries";
import { restorePDFFile, deletePDFFile } from "@/utils/uploadUtils";
import { useRouter } from "next/navigation";

interface DeletedPDFFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  deleted_at: string;
  user_id: string;
}

export default function TrashContent() {
  const { user } = useAuth();
  const { showSuccessNotification, showErrorNotification } = useUIStore();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    file: DeletedPDFFile | null;
    action: "restore" | "delete";
  }>({
    open: false,
    file: null,
    action: "restore",
  });

  // Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user?.id, [user?.id]);

  // Use Apollo's useQuery hook instead of manual query
  const { data, loading, error, refetch } = useQuery(GET_DELETED_PDF_FILES, {
    variables: { userId },
    skip: !userId, // Skip query if no user ID
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: false,
  });

  const files = data?.getDeletedPDFFiles || [];

  // Handle error notification separately to avoid re-render loops
  useEffect(() => {
    if (error) {
      showErrorNotification("Load Failed", error.message);
    }
  }, [error, showErrorNotification]); // Include all dependencies

  // Handle restore file
  const handleRestore = async (file: DeletedPDFFile) => {
    if (!user) return;

    try {
      setActionLoading(file.id);
      await restorePDFFile(file.id, user.id);
      // Refetch data to update the list
      refetch();
      showSuccessNotification(
        "File Restored",
        `${file.filename} has been restored`
      );
    } catch (err) {
      console.error("Restore error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to restore file";
      showErrorNotification("Restore Failed", errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle permanent delete
  const handlePermanentDelete = async (file: DeletedPDFFile) => {
    if (!user) return;

    try {
      setActionLoading(file.id);
      await deletePDFFile(file.id, user.id);
      // Refetch data to update the list
      refetch();
      showSuccessNotification(
        "File Permanently Deleted",
        `${file.filename} has been permanently deleted`
      );
    } catch (err) {
      console.error("Permanent delete error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to permanently delete file";
      showErrorNotification("Delete Failed", errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openConfirmDialog = (
    file: DeletedPDFFile,
    action: "restore" | "delete"
  ) => {
    setConfirmDialog({ open: true, file, action });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, file: null, action: "restore" });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.file) return;

    if (confirmDialog.action === "restore") {
      await handleRestore(confirmDialog.file);
    } else {
      await handlePermanentDelete(confirmDialog.file);
    }

    closeConfirmDialog();
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Container maxWidth="lg" className="py-8">
          <Typography>Loading trash...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        {/* Header */}
        <Box className="flex items-center gap-4 mb-6">
          <IconButton onClick={() => router.back()} sx={{ color: "#000000" }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" className="font-bold text-gray-800">
            Trash
          </Typography>
        </Box>

        <Typography variant="body1" className="text-gray-600 mb-6">
          Files in trash will be automatically deleted after 30 days.
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error.message}
          </Alert>
        )}

        {files.length === 0 ? (
          <Card
            sx={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent className="text-center py-12">
              <Description className="text-gray-400 text-6xl mb-4" />
              <Typography variant="h6" className="text-gray-600 mb-2">
                Trash is empty
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Deleted files will appear here
              </Typography>
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
            {files.map((file: DeletedPDFFile) => (
              <Card
                key={file.id}
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
                    <Description className="text-gray-400 text-3xl" />
                    <Box className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => openConfirmDialog(file, "restore")}
                        disabled={actionLoading === file.id}
                        sx={{
                          color: "#10b981",
                          "&:hover": {
                            backgroundColor: "#f0fdf4",
                          },
                        }}
                        title="Restore file"
                      >
                        <Restore fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openConfirmDialog(file, "delete")}
                        disabled={actionLoading === file.id}
                        sx={{
                          color: "#ef4444",
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                          },
                        }}
                        title="Delete permanently"
                      >
                        <DeleteForever fontSize="small" />
                      </IconButton>
                    </Box>
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
                      sx={{
                        color: "#000000",
                        borderColor: "#e5e7eb",
                      }}
                    />
                    <Chip
                      label="PDF"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" className="text-gray-500 mb-2">
                    Deleted {formatDate(file.deleted_at)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    Originally uploaded {formatDate(file.upload_date)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
          <DialogTitle>
            {confirmDialog.action === "restore"
              ? "Restore File"
              : "Delete Permanently"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {confirmDialog.action === "restore"
                ? `Are you sure you want to restore "${confirmDialog.file?.filename}"?`
                : `Are you sure you want to permanently delete "${confirmDialog.file?.filename}"? This action cannot be undone.`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>Cancel</Button>
            <Button
              onClick={handleConfirmAction}
              color={confirmDialog.action === "restore" ? "primary" : "error"}
              variant="contained"
            >
              {confirmDialog.action === "restore"
                ? "Restore"
                : "Delete Permanently"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
