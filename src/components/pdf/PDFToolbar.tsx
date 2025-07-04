"use client";

import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Print,
  Menu as MenuIcon,
} from "@mui/icons-material";

interface PDFToolbarProps {
  filename?: string;
  onMenuClick?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onSearch?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function PDFToolbar({
  filename = "Untitled Document",
  onMenuClick,
  onZoomIn,
  onZoomOut,
  onSearch,
  onDownload,
  onPrint,
}: PDFToolbarProps) {
  return (
    <AppBar position="fixed" className="toolbar-height no-print">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          className="mr-2"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" className="flex-grow truncate">
          {filename}
        </Typography>

        <Box className="flex items-center gap-1">
          <IconButton color="inherit" onClick={onZoomOut} title="Zoom Out">
            <ZoomOut />
          </IconButton>

          <IconButton color="inherit" onClick={onZoomIn} title="Zoom In">
            <ZoomIn />
          </IconButton>

          <IconButton color="inherit" onClick={onSearch} title="Search">
            <Search />
          </IconButton>

          <IconButton color="inherit" onClick={onDownload} title="Download">
            <Download />
          </IconButton>

          <IconButton color="inherit" onClick={onPrint} title="Print">
            <Print />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
