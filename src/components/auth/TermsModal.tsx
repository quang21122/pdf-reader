"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}

export default function TermsModal({ open, onClose, type }: TermsModalProps) {
  const isTerms = type === "terms";

  const termsContent = (
    <Box sx={{ color: "#374151" }}>
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        1. Acceptance of Terms
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        By accessing and using the PDF Reader application, you agree to comply
        with and be bound by these terms and conditions of use.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        2. Service Description
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        PDF Reader is a web application that allows users to upload, view, read,
        and analyze PDF files. The application provides features such as OCR
        (Optical Character Recognition), note-taking, highlighting, and content
        search within PDFs.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        3. User Accounts
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        To use certain features of the service, you need to create an account.
        You are responsible for securing your login information and are liable
        for all activities that occur under your account.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        4. Acceptable Use
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        You agree to use the service reasonably and not to upload illegal,
        harmful, or copyrighted content without permission, attempt unauthorized
        access to the system, or use the service for commercial purposes without
        authorization.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        5. Limitation of Liability
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        We are not liable for any damages arising from the use or inability to
        use the service. The service is provided &quot;as is&quot; without any
        warranties.
      </Typography>

      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", color: "#64748b" }}
      >
        Last updated: {new Date().toLocaleDateString("en-US")}
      </Typography>
    </Box>
  );

  const privacyContent = (
    <Box sx={{ color: "#374151" }}>
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        1. Information We Collect
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        We collect account information (email, encrypted password), usage
        information (uploaded PDF files, notes, highlights), and technical
        information (IP address, browser type, access time).
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        2. How We Use Information
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        Your information is used to provide and maintain the PDF Reader service,
        authenticate identity and secure accounts, improve service quality and
        user experience, and send important service notifications.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        3. Information Security
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        We implement appropriate technical and organizational security measures
        to protect your personal information from unauthorized access, use, or
        disclosure.
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: 600, color: "#1e293b" }}
      >
        4. Your Rights
      </Typography>
      <Typography
        variant="body2"
        sx={{ marginBottom: 3, lineHeight: 1.6, color: "#374151" }}
      >
        You have the right to access and view your personal information, request
        correction or deletion of inaccurate information, withdraw consent and
        delete your account, and file complaints about personal data processing.
      </Typography>

      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", color: "#64748b" }}
      >
        Last updated: {new Date().toLocaleDateString("en-US")}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          maxHeight: "80vh",
          backgroundColor: "white",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
          {isTerms ? "Terms of Service" : "Privacy Policy"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#64748b",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              color: "#dc2626",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          paddingTop: 3,
          paddingBottom: 3,
          backgroundColor: "white",
          color: "#374151",
        }}
      >
        {isTerms ? termsContent : privacyContent}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: 2,
          paddingBottom: 2,
          paddingX: 3,
          backgroundColor: "white",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
            textTransform: "none",
            paddingX: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
