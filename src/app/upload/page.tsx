"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Error as ErrorIcon,
  Description,
} from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { uploadPDFToSupabase } from "@/utils/uploadUtils";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  uploadedFile: {
    id: string;
    filename: string;
    file_path: string;
  } | null;
}

function UploadContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedFile: null,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        uploadedFile: null,
      });
    } else {
      setUploadState((prev) => ({
        ...prev,
        error: "Please select a valid PDF file",
      }));
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadState((prev) => ({
        ...prev,
        error: "Please select a file and ensure you are logged in",
      }));
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
      uploadedFile: null,
    });

    try {
      const result = await uploadPDFToSupabase(
        selectedFile,
        user.id,
        (progress) => {
          setUploadState((prev) => ({
            ...prev,
            progress,
          }));
        }
      );

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
        uploadedFile: result,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed",
        success: false,
        uploadedFile: null,
      });
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      uploadedFile: null,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="md" className="py-8">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Upload PDF
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Upload your PDF files to read, analyze, and perform OCR processing
          </Typography>
        </Box>

        {uploadState.success ? (
          <Card sx={{ backgroundColor: "white", mb: 4 }}>
            <CardContent className="text-center py-12">
              <CheckCircle className="text-6xl text-green-500 mb-4" />
              <Typography
                variant="h5"
                className="font-semibold mb-4 text-green-700"
              >
                Upload Successful!
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-6">
                Your PDF file has been uploaded successfully
              </Typography>

              {uploadState.uploadedFile && (
                <Box className="mb-6">
                  <Chip
                    icon={<Description />}
                    label={uploadState.uploadedFile.filename}
                    variant="outlined"
                    className="mb-2"
                  />
                </Box>
              )}

              <Box className="flex gap-3 justify-center">
                <Button
                  variant="contained"
                  onClick={() => router.push("/files")}
                  sx={{
                    backgroundColor: "#10b981",
                    "&:hover": {
                      backgroundColor: "#059669",
                    },
                  }}
                >
                  View My Files
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetUpload}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Upload Another
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ backgroundColor: "white", mb: 4 }}>
            <CardContent className="p-6">
              {!selectedFile ? (
                <Box className="text-center py-12">
                  <CloudUpload className="text-6xl text-blue-500 mb-4" />
                  <Typography
                    variant="h5"
                    className="font-semibold mb-4 text-gray-800"
                  >
                    Choose PDF File
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-6">
                    Select a PDF file from your device to upload
                  </Typography>

                  <input
                    accept="application/pdf"
                    style={{ display: "none" }}
                    id="pdf-upload"
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="pdf-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      size="large"
                      sx={{
                        backgroundColor: "#dc2626",
                        "&:hover": {
                          backgroundColor: "#b91c1c",
                        },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Choose File
                    </Button>
                  </label>

                  <Box className="mt-6">
                    <Typography variant="body2" className="text-gray-500">
                      Supported format: PDF files only • Max size: 50MB
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="h6"
                    className="font-semibold mb-4 text-gray-800"
                  >
                    Selected File
                  </Typography>

                  <Box className="bg-gray-50 p-4 rounded-lg mb-4">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-3">
                        <Description className="text-red-500" />
                        <Box>
                          <Typography
                            variant="body1"
                            className="font-medium text-gray-800"
                          >
                            {selectedFile.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedFile(null)}
                        color="error"
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>

                  {uploadState.isUploading && (
                    <Box className="mb-4">
                      <Box className="flex justify-between items-center mb-2">
                        <Typography variant="body2" className="text-gray-600">
                          Uploading...
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {Math.round(uploadState.progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={uploadState.progress}
                        className="mb-2"
                      />
                    </Box>
                  )}

                  <Divider className="my-4" />

                  <Box className="flex gap-3">
                    <Button
                      variant="contained"
                      onClick={handleUpload}
                      disabled={uploadState.isUploading}
                      startIcon={<CloudUpload />}
                      sx={{
                        backgroundColor: "#dc2626",
                        "&:hover": {
                          backgroundColor: "#b91c1c",
                        },
                      }}
                    >
                      {uploadState.isUploading ? "Uploading..." : "Upload PDF"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedFile(null)}
                      disabled={uploadState.isUploading}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}

              {uploadState.error && (
                <Alert severity="error" className="mt-4" icon={<ErrorIcon />}>
                  {uploadState.error}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card sx={{ backgroundColor: "#f8fafc" }}>
          <CardContent>
            <Typography
              variant="h6"
              className="font-semibold mb-3 text-gray-800"
            >
              Upload Guidelines
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">
              • Only PDF files are supported
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">
              • Maximum file size is 50MB
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">
              • Files are stored securely in your personal storage
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              • You can perform OCR processing after upload
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadContent />
    </AuthGuard>
  );
}
