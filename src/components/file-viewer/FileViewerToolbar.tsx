import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
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
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        borderRadius: 0,
        "& .MuiToolbar-root": {
          borderRadius: 0,
        },
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onBack}
          sx={{ mr: 2, color: "#424242" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#212121" }}
        >
          {file?.filename || "PDF Viewer"}
        </Typography>

        <IconButton onClick={onOCR} title="OCR" sx={{ color: "#424242" }}>
          <TextFields />
        </IconButton>
        <IconButton
          onClick={onDownload}
          title="Download"
          sx={{ color: "#424242" }}
        >
          <Download />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
