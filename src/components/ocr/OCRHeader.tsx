import React from "react";
import { Typography, Box } from "@mui/material";

export default function OCRHeader() {
  return (
    <Box className="mb-8">
      <Typography variant="h4" className="font-bold text-gray-800 mb-2">
        OCR Scanner
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        Extract text from PDF files using Optical Character Recognition
      </Typography>
    </Box>
  );
}
