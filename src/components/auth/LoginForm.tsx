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
  Email,
  Lock,
  Login as LoginIcon,
  ArrowBack,
} from "@mui/icons-material";
import NextLink from "next/link";
import CustomTextField from "@/components/common/CustomTextField";
import { useLogin, usePasswordVisibility } from "@/hooks";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({
  onSuccess,
  redirectTo = "/dashboard",
}: LoginFormProps) {
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    isLoading,
    isFormValid,
    handleLogin,
  } = useLogin({
    onSuccess,
    redirectTo,
    autoRedirect: true,
  });

  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      sx={{
        backgroundColor: "#f8fafc",
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
        {/* Back Button - Positioned absolutely in top-left corner */}
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
                <LoginIcon sx={{ color: "white", fontSize: 28 }} />
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
              Sign In
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Welcome back to PDF Reader
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                marginBottom: 3,
                borderRadius: 1.5,
                border: "1px solid #fecaca",
                backgroundColor: "#fef2f2",
              }}
            >
              {error.message}
              {error.message.includes("Invalid email or password") && (
                <Box sx={{ marginTop: 1, fontSize: "0.875rem" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    💡 <strong>Tip:</strong> If you don&apos;t have an account,{" "}
                    <NextLink
                      href="/register"
                      style={{
                        color: "#dc2626",
                        textDecoration: "underline",
                      }}
                    >
                      sign up here
                    </NextLink>
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <CustomTextField
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              startIcon={<Email sx={{ color: "#94a3b8" }} />}
            />

            <CustomTextField
              label="Password"
              placeholder="Enter your password"
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
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Footer Links */}
          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            <NextLink
              href="/forgot-password"
              style={{
                color: "#dc2626",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
              className="hover:text-red-700 hover:underline"
            >
              Forgot Password?
            </NextLink>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                marginTop: 2,
                fontSize: "0.875rem",
              }}
            >
              Don&apos;t have an account?{" "}
              <NextLink
                href="/register"
                style={{
                  color: "#dc2626",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                className="hover:text-red-700 hover:underline"
              >
                Sign up now
              </NextLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
