"use client";

import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  History,
  TextFields,
  Visibility,
} from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import { usePDFStore, useOCRStore, useSettingsStore } from "@/stores";
import { useFileManagement } from "@/hooks/useFileManagement";

export default function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  // File management hook
  const { files, loading: filesLoading } = useFileManagement();

  // Zustand stores
  const { isUploading } = usePDFStore();
  const { isProcessing } = useOCRStore();
  const { auto_ocr } = useSettingsStore();

  // Sort files by upload date (newest first) and take the first 3
  const recentFiles = [...files] // Create a copy to avoid mutating the original array
    .sort(
      (a, b) =>
        new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
    )
    .slice(0, 3);

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Dashboard
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Welcome back, {user?.email}!
          </Typography>

          {/* Status indicators */}
          <Box className="flex gap-2 mt-4">
            {isUploading && (
              <Chip
                label="Uploading files..."
                color="primary"
                size="small"
                icon={<LinearProgress />}
              />
            )}
            {isProcessing && (
              <Chip label="Processing OCR..." color="secondary" size="small" />
            )}
            {auto_ocr && (
              <Chip label="Auto-OCR enabled" color="success" size="small" />
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                minHeight: "280px",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  borderColor: "#dc2626",
                },
              }}
            >
              <CardContent
                className="text-center p-6"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <CloudUpload className="text-5xl mb-4 text-blue-500" />
                  <Typography
                    variant="h6"
                    className="mb-2 font-semibold text-black"
                  >
                    Upload PDF
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-6">
                    Upload new PDF files to read and analyze
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push("/upload")}
                  sx={{
                    backgroundColor: "#dc2626",
                    "&:hover": {
                      backgroundColor: "#b91c1c",
                    },
                  }}
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                minHeight: "280px",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  borderColor: "#10b981",
                },
              }}
            >
              <CardContent
                className="text-center p-6"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <Description className="text-5xl mb-4 text-green-500" />
                  <Typography
                    variant="h6"
                    className="mb-2 font-semibold text-black"
                  >
                    My PDFs
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-6">
                    View and manage your uploaded PDF files
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/files")}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  View Files
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                minHeight: "280px",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  borderColor: "#7c3aed",
                },
              }}
            >
              <CardContent
                className="text-center p-6"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <TextFields className="text-5xl mb-4 text-purple-500" />
                  <Typography
                    variant="h6"
                    className="mb-2 font-semibold text-black"
                  >
                    OCR Scanner
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-6">
                    Extract text from PDF files using OCR technology
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/ocr")}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  Start OCR
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                minHeight: "280px",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  borderColor: "#f97316",
                },
              }}
            >
              <CardContent
                className="text-center p-6"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <History className="text-5xl mb-4 text-orange-500" />
                  <Typography
                    variant="h6"
                    className="mb-2 font-semibold text-black"
                  >
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-6">
                    View your recent activity
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/activity")}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Files Section */}
        <Box className="mt-10">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Recent Files ({filesLoading ? "..." : files.length})
          </Typography>
          <Card
            sx={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            }}
          >
            <CardContent>
              {filesLoading ? (
                <Box className="text-center py-8">
                  <LinearProgress className="mb-4" />
                  <Typography variant="body2" className="text-gray-500">
                    Loading recent files...
                  </Typography>
                </Box>
              ) : recentFiles.length > 0 ? (
                <Box>
                  {recentFiles.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 2,
                        borderBottom: "1px solid #e5e7eb",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Description className="text-gray-400" />
                        <Box>
                          <Typography
                            variant="body1"
                            className="font-medium text-black"
                          >
                            {file.filename}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {(file.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {new Date(file.upload_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={file.status || "uploaded"}
                          size="small"
                          color={
                            (file.status || "uploaded") === "ready" ||
                            file.status === "uploaded"
                              ? "success"
                              : file.status === "processing"
                              ? "warning"
                              : file.status === "uploading"
                              ? "info"
                              : file.status === "error"
                              ? "error"
                              : "default"
                          }
                        />
                        {file.ocr_status === "completed" && (
                          <Chip
                            label="OCR"
                            size="small"
                            color="info"
                            icon={<TextFields />}
                          />
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => router.push(`/files/${file.id}`)}
                          sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": {
                              backgroundColor: "#1565c0",
                            },
                            minWidth: "80px",
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  {files.length > 3 && (
                    <Box className="text-center mt-4">
                      <Button
                        variant="outlined"
                        onClick={() => router.push("/files")}
                      >
                        View All Files ({files.length})
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box className="text-center py-16">
                  <Description className="text-7xl text-gray-300 mb-6" />
                  <Typography
                    variant="h6"
                    className="text-gray-500 mb-3 font-semibold"
                  >
                    No files yet
                  </Typography>
                  <Box className="flex gap-3 mt-4 justify-center">
                    <Button
                      variant="contained"
                      onClick={() => router.push("/upload")}
                      startIcon={<CloudUpload />}
                      sx={{
                        backgroundColor: "#dc2626",
                        "&:hover": {
                          backgroundColor: "#b91c1c",
                        },
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      Upload PDF
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => router.push("/ocr")}
                      startIcon={<TextFields />}
                      sx={{
                        borderColor: "#7c3aed",
                        color: "#7c3aed",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#6d28d9",
                        },
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      Try OCR
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
