"use client";

import React from "react";
import { Drawer, Typography, Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import PDFThumbnail from "./PDFThumbnail";

interface PDFSidebarProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  numPages: number;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
}

export default function PDFSidebar({
  open,
  onClose,
  fileUrl,
  numPages,
  currentPage,
  onPageClick,
}: PDFSidebarProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          backgroundColor: "#2d2d2d",
          color: "white",
          marginTop: "40px", // Offset for toolbar
          height: "calc(100vh - 40px)", // Adjust height
          borderRadius: 0, // Remove border radius
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #404040",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Table of Contents
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      {/* Page Thumbnails */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {Array.from({ length: numPages }, (_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <PDFThumbnail
              key={pageNumber}
              fileUrl={fileUrl}
              pageNumber={pageNumber}
              isCurrentPage={isCurrentPage}
              onClick={() => onPageClick(pageNumber)}
            />
          );
        })}
      </Box>
    </Drawer>
  );
}
