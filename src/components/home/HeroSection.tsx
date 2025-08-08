import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function HeroSection() {
  return (
    <Box sx={{ textAlign: "center", marginBottom: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Image
          src="/icon-app.svg"
          alt="PDF Reader Icon"
          width={120}
          height={120}
          priority
        />
      </Box>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          marginBottom: 2,
          fontWeight: "bold",
          color: "#1e293b",
        }}
      >
        PDF Reader
      </Typography>
      <Typography
        variant="h5"
        sx={{
          marginBottom: 3,
          color: "#64748b",
        }}
      >
        Advanced PDF Viewer with OCR, Notes, and Highlighting
      </Typography>
    </Box>
  );
}
