"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
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
import Navigation from "@/components/layout/Navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    console.log("Home useEffect triggered:", {
      user: !!user,
      loading,
      mounted,
      pathname:
        typeof window !== "undefined" ? window.location.pathname : "SSR",
    });

    if (!loading && user && mounted) {
      console.log("User is already logged in, redirecting to dashboard...");

      // Only redirect if we're actually on home page
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        router.push("/dashboard");

        // Backup redirect using window.location
        setTimeout(() => {
          if (window.location.pathname === "/") {
            console.log("Router.push failed, using window.location");
            window.location.href = "/dashboard";
          }
        }, 1000);
      }
    }
  }, [user, loading, router, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <Typography sx={{ color: "#1e293b" }}>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <Typography sx={{ color: "#1e293b" }}>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          <Box sx={{ textAlign: "center", marginBottom: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 3,
              }}
            >
              <Image
                src="/icon-app.svg"
                alt="PDF Reader Icon"
                width={120}
                height={120}
                priority
              />
            </Box>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                marginBottom: 2,
                fontWeight: "bold",
                color: "#1e293b",
              }}
            >
              PDF Reader
            </Typography>
            <Typography
              variant="h5"
              sx={{
                marginBottom: 3,
                color: "#64748b",
              }}
            >
              Advanced PDF Viewer with OCR, Notes, and Highlighting
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ marginTop: 4 }}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center", padding: 3 }}>
                  <PdfIcon
                    sx={{ fontSize: "3rem", marginBottom: 2, color: "#dc2626" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    PDF Viewing
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    View PDF files with smooth navigation and zoom controls
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center", padding: 3 }}>
                  <OcrIcon
                    sx={{ fontSize: "3rem", marginBottom: 2, color: "#dc2626" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    OCR Technology
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Extract text from scanned PDFs using Tesseract.js
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center", padding: 3 }}>
                  <SearchIcon
                    sx={{ fontSize: "3rem", marginBottom: 2, color: "#dc2626" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    Smart Search
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Search through PDF content and OCR results
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center", padding: 3 }}>
                  <UploadIcon
                    sx={{ fontSize: "3rem", marginBottom: 2, color: "#dc2626" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    Notes & Highlights
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Add personal notes and highlight important text
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
        <Navigation />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <Typography sx={{ color: "#1e293b" }}>
            Redirecting to dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  // This should never be reached, but just in case
  return null;
}
