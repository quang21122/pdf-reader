import React from "react";
import { Box, Container, Alert } from "@mui/material";
import FileViewerToolbar from "./FileViewerToolbar";

interface FileViewerErrorProps {
  error: string;
  onBack: () => void;
}

export default function FileViewerError({ error, onBack }: FileViewerErrorProps) {
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <FileViewerToolbar
        file={null}
        onBack={onBack}
        onOCR={() => {}}
        onDownload={() => {}}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    </Box>
  );
}
