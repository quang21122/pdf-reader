import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack, Download, TextFields } from "@mui/icons-material";
import type { PDFFile } from "@/hooks/useFileManagement";

interface FileViewerToolbarProps {
  file?: PDFFile | null;
  onBack: () => void;
  onOCR: () => void;
  onDownload: () => void;
}

export default function FileViewerToolbar({
  file,
  onBack,
  onOCR,
  onDownload,
}: FileViewerToolbarProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {file?.filename || "PDF Viewer"}
        </Typography>

        <IconButton color="inherit" onClick={onOCR} title="OCR">
          <TextFields />
        </IconButton>
        <IconButton color="inherit" onClick={onDownload} title="Download">
          <Download />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
