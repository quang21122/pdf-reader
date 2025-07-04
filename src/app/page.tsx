"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  TextFields as OcrIcon,
} from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="text-center mb-8">
          <Box className="flex justify-center mb-6">
            <Image
              src="/icon-app.svg"
              alt="PDF Reader Icon"
              width={120}
              height={120}
              priority
            />
          </Box>
          <Typography variant="h2" component="h1" className="mb-4 font-bold">
            PDF Reader
          </Typography>
          <Typography variant="h5" color="text.secondary" className="mb-6">
            Advanced PDF Viewer with OCR, Notes, and Highlighting
          </Typography>
          <Box className="flex gap-4 justify-center">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} className="mt-8">
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card className="h-full">
              <CardContent className="text-center">
                <PdfIcon className="text-4xl mb-4 text-primary-500" />
                <Typography variant="h6" className="mb-2">
                  PDF Viewing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View PDF files with smooth navigation and zoom controls
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card className="h-full">
              <CardContent className="text-center">
                <OcrIcon className="text-4xl mb-4 text-primary-500" />
                <Typography variant="h6" className="mb-2">
                  OCR Technology
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Extract text from scanned PDFs using Tesseract.js
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card className="h-full">
              <CardContent className="text-center">
                <SearchIcon className="text-4xl mb-4 text-primary-500" />
                <Typography variant="h6" className="mb-2">
                  Smart Search
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search through PDF content and OCR results
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card className="h-full">
              <CardContent className="text-center">
                <UploadIcon className="text-4xl mb-4 text-primary-500" />
                <Typography variant="h6" className="mb-2">
                  Notes & Highlights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add personal notes and highlight important text
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // User is logged in, redirect to dashboard
  router.push("/dashboard");

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Typography>Redirecting to dashboard...</Typography>
    </Box>
  );
}
