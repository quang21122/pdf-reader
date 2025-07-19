"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Logout as LogoutIcon, CheckCircle } from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function LogoutPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const { error } = await signOut();

      if (error) {
        setError("An error occurred while signing out: " + error.message);
      } else {
        setLogoutSuccess(true);
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router, signOut]);

  // Auto logout if user is logged in
  useEffect(() => {
    if (user && !isLoggingOut && !logoutSuccess) {
      handleLogout();
    }
  }, [user, isLoggingOut, logoutSuccess, handleLogout]);

  const handleManualLogout = () => {
    if (!isLoggingOut) {
      handleLogout();
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        className="min-h-screen flex items-center justify-center"
      >
        <CircularProgress size={40} sx={{ color: "#dc2626" }} />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex items-center justify-center p-4"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ padding: 4, textAlign: "center" }}>
          {/* Header */}
          <Box sx={{ marginBottom: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 3,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: logoutSuccess ? "#16a34a" : "#dc2626",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {logoutSuccess ? (
                  <CheckCircle sx={{ color: "white", fontSize: 28 }} />
                ) : (
                  <LogoutIcon sx={{ color: "white", fontSize: 28 }} />
                )}
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: 1,
                fontSize: "1.875rem",
              }}
            >
              {logoutSuccess ? "Successfully Signed Out!" : "Sign Out"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              {logoutSuccess
                ? "You have been signed out of the system"
                : user
                ? "You are signed in as: " + user.email
                : "You are not signed in"}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 3, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {logoutSuccess && (
            <Alert
              severity="success"
              sx={{ marginBottom: 3, borderRadius: 1.5 }}
            >
              Successfully signed out! Redirecting to home page...
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {!logoutSuccess && user && (
              <Button
                onClick={handleManualLogout}
                variant="contained"
                size="large"
                disabled={isLoggingOut}
                sx={{
                  backgroundColor: "#dc2626",
                  padding: "12px 0",
                  borderRadius: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#b91c1c",
                  },
                  "&:disabled": {
                    backgroundColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                {isLoggingOut ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign Out Now"
                )}
              </Button>
            )}

            <NextLink href="/" passHref>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  padding: "12px 0",
                  borderRadius: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#fef2f2",
                    borderColor: "#b91c1c",
                  },
                }}
              >
                Back to Home
              </Button>
            </NextLink>

            {!user && (
              <NextLink href="/login" passHref>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: "#dc2626",
                    padding: "12px 0",
                    borderRadius: 1.5,
                    fontSize: "1rem",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#b91c1c",
                    },
                  }}
                >
                  Sign In
                </Button>
              </NextLink>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
