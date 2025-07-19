"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { CloudUpload, Description, History } from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

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
        </Box>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              sx={{ backgroundColor: "white" }}
            >
              <CardContent className="text-center p-6">
                <CloudUpload className="text-5xl mb-4 text-blue-500" />
                <Typography variant="h6" className="mb-2 font-semibold">
                  Upload PDF
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Upload new PDF files to read and analyze
                </Typography>
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
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              sx={{ backgroundColor: "white" }}
            >
              <CardContent className="text-center p-6">
                <Description className="text-5xl mb-4 text-green-500" />
                <Typography variant="h6" className="mb-2 font-semibold">
                  My PDFs
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  View and manage your uploaded PDF files
                </Typography>
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
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              sx={{ backgroundColor: "white" }}
            >
              <CardContent className="text-center p-6">
                <History className="text-5xl mb-4 text-orange-500" />
                <Typography variant="h6" className="mb-2 font-semibold">
                  Recent Activity
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  View your recent activity
                </Typography>
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
        <Box className="mt-12">
          <Typography variant="h5" className="font-bold text-gray-800 mb-6">
            Recent Files
          </Typography>
          <Card sx={{ backgroundColor: "white" }}>
            <CardContent className="text-center py-12">
              <Description className="text-6xl text-gray-300 mb-4" />
              <Typography variant="h6" className="text-gray-500 mb-2">
                No files yet
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                Upload your first PDF file to get started
              </Typography>
              <Button
                variant="contained"
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
        </Box>
      </Container>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
