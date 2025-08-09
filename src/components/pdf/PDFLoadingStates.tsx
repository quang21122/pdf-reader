import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

interface PDFLoadingStatesProps {
  isLoading: boolean;
  error: string | null;
}

export const PDFLoadingState = () => (
  <Box sx={{ textAlign: "center" }}>
    <CircularProgress />
    <Typography variant="body2" sx={{ mt: 2 }}>
      Loading PDF...
    </Typography>
  </Box>
);

export const PDFErrorState = ({ error }: { error: string }) => (
  <Alert severity="error" sx={{ maxWidth: 400 }}>
    {error}
  </Alert>
);

export const PDFEmptyState = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: "#f5f5f5",
    }}
  >
    <Typography variant="h6" color="text.secondary">
      No PDF file to display
    </Typography>
  </Box>
);

export default function PDFLoadingStates({ isLoading, error }: PDFLoadingStatesProps) {
  if (isLoading) {
    return <PDFLoadingState />;
  }

  if (error) {
    return <PDFErrorState error={error} />;
  }

  return null;
}
