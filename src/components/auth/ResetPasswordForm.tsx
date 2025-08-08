"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  VpnKey,
  ArrowBack,
} from "@mui/icons-material";
import NextLink from "next/link";
import CustomTextField from "@/components/common/CustomTextField";
import { useResetPassword, useMultiplePasswordVisibility } from "@/hooks";

export default function ResetPasswordForm() {
  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    error,
    success,
    isLoading,
    isFormValid,
    isValidToken,
    passwordsMatch,
    isPasswordValid,
    handleResetPassword,
  } = useResetPassword();

  const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useMultiplePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleResetPassword();
  };

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          padding: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            backgroundColor: "white",
          }}
        >
          <CardContent sx={{ padding: 5, textAlign: "center" }}>
            <VpnKey sx={{ fontSize: 64, color: "#dc2626", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: "#1e293b" }}>
              Invalid Reset Link
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "#64748b" }}>
              This password reset link is invalid or has expired. Please request
              a new password reset.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                component={NextLink}
                href="/forgot-password"
                variant="contained"
                sx={{
                  backgroundColor: "#dc2626",
                  "&:hover": { backgroundColor: "#b91c1c" },
                }}
              >
                Request New Reset
              </Button>
              <Button
                component={NextLink}
                href="/login"
                variant="outlined"
                sx={{
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  "&:hover": { backgroundColor: "#fef2f2" },
                }}
              >
                Back to Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1,
          }}
        >
          <Tooltip title="Back to Home" placement="right">
            <IconButton
              component={NextLink}
              href="/"
              sx={{
                color: "#64748b",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                  color: "#dc2626",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </Box>

        <CardContent sx={{ padding: 5 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", marginBottom: 4 }}>
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
                  backgroundColor: "#dc2626",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VpnKey sx={{ color: "white", fontSize: 28 }} />
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
              Reset Password
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Enter your new password below
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                marginBottom: 3,
                borderRadius: 2,
              }}
            >
              {error.message}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert
              severity="success"
              sx={{
                marginBottom: 3,
                borderRadius: 2,
              }}
            >
              {success}
            </Alert>
          )}

          {/* Reset Password Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box>
              <CustomTextField
                label="New Password"
                placeholder="Enter your new password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                startIcon={<Lock sx={{ color: "#94a3b8" }} />}
                endIcon={
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={isLoading}
                    sx={{ color: "#94a3b8" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: isPasswordValid ? "#10b981" : "#64748b",
                  fontSize: "0.75rem",
                  marginTop: 0.5,
                  marginLeft: 1,
                }}
              >
                Password must be at least 6 characters
              </Typography>
            </Box>

            <Box>
              <CustomTextField
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                startIcon={<Lock sx={{ color: "#94a3b8" }} />}
                endIcon={
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    disabled={isLoading}
                    sx={{ color: "#94a3b8" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              {confirmPassword && (
                <Typography
                  variant="body2"
                  sx={{
                    color: passwordsMatch ? "#10b981" : "#ef4444",
                    fontSize: "0.75rem",
                    marginTop: 0.5,
                    marginLeft: 1,
                  }}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !isFormValid}
              sx={{
                backgroundColor: "#dc2626",
                padding: "12px 0",
                borderRadius: 1.5,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                marginTop: 2,
                "&:hover": {
                  backgroundColor: "#b91c1c",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#94a3b8",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>

          {/* Footer Links */}
          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            <NextLink
              href="/login"
              style={{
                color: "#dc2626",
                textDecoration: "none",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              className="hover:text-red-700 hover:underline"
            >
              <ArrowBack fontSize="small" />
              Back to Sign In
            </NextLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
