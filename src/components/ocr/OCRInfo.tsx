import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function OCRInfo() {
  return (
    <Box className="mt-8">
      <Card sx={{ backgroundColor: "#f8fafc" }}>
        <CardContent>
          <Typography
            variant="h6"
            className="font-semibold mb-3 text-gray-800"
          >
            About OCR Processing
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">
            • OCR (Optical Character Recognition) extracts text from PDF images
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">
            • Processing is done locally in your browser for privacy
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">
            • Supports multiple languages including English, Vietnamese, and more
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            • Results can be copied, searched, and exported
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
