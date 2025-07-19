"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  PersonAdd,
  ArrowBack,
} from "@mui/icons-material";
import NextLink from "next/link";
import CustomTextField from "@/components/common/CustomTextField";
import TermsModal from "./TermsModal";
import { useRegister, useMultiplePasswordVisibility } from "@/hooks";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function RegisterForm({
  onSuccess,
  redirectTo = "/login",
}: RegisterFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy">("terms");

  const {
    email,
    password,
    confirmPassword,
    acceptTerms,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAcceptTerms,
    error,
    success,
    isLoading,
    isFormValid,
    handleRegister,
  } = useRegister({
    onSuccess,
    redirectTo,
    autoRedirect: true,
  });

  const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useMultiplePasswordVisibility();

  const handleOpenModal = (type: "terms" | "privacy") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister();
  };

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
          <Box sx={{ textAlign: "center", marginBottom: 3 }}>
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
                <PersonAdd sx={{ color: "white", fontSize: 28 }} />
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
              Sign Up
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Create a new account to use PDF Reader
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                marginBottom: 2,
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
                marginBottom: 2,
                borderRadius: 2,
              }}
            >
              {success}
            </Alert>
          )}

          {/* Register Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
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

            <Box>
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
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  marginTop: 0.5,
                  marginLeft: 1,
                }}
              >
                Password must be at least 6 characters
              </Typography>
            </Box>

            <CustomTextField
              label="Confirm Password"
              placeholder="Re-enter your password"
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                  sx={{
                    color: "#dc2626",
                    "&.Mui-checked": {
                      color: "#dc2626",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    color: "#718096",
                    fontSize: "0.875rem",
                  }}
                >
                  I agree to the{" "}
                  <Typography
                    component="span"
                    onClick={() => handleOpenModal("terms")}
                    sx={{
                      color: "#dc2626",
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#b91c1c",
                      },
                    }}
                  >
                    Terms of Service
                  </Typography>{" "}
                  and{" "}
                  <Typography
                    component="span"
                    onClick={() => handleOpenModal("privacy")}
                    sx={{
                      color: "#dc2626",
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#b91c1c",
                      },
                    }}
                  >
                    Privacy Policy
                  </Typography>
                </Typography>
              }
              sx={{ alignItems: "center", marginTop: 1 }}
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
                "Sign Up"
              )}
            </Button>
          </Box>

          {/* Footer Links */}
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Already have an account?{" "}
              <NextLink
                href="/login"
                style={{
                  color: "#dc2626",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                className="hover:text-red-700 hover:underline"
              >
                Sign in now
              </NextLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Terms and Privacy Modal */}
      <TermsModal
        open={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
      />
    </Box>
  );
}
