import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { CloudUpload, TextFields } from "@mui/icons-material";

interface OCRFileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OCRFileUpload({ onFileSelect }: OCRFileUploadProps) {
  return (
    <Card sx={{ backgroundColor: "white", mb: 4 }}>
      <CardContent className="text-center py-12">
        <TextFields className="text-6xl text-purple-500 mb-4" />
        <Typography variant="h5" className="font-semibold mb-4">
          Upload PDF for OCR Processing
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          Select a PDF file or image (PNG, JPG) to extract text using OCR
          technology
        </Typography>

        <input
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          style={{ display: "none" }}
          id="pdf-upload"
          type="file"
          onChange={onFileSelect}
        />
        <label htmlFor="pdf-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            size="large"
            sx={{
              backgroundColor: "#7c3aed",
              "&:hover": {
                backgroundColor: "#6d28d9",
              },
              px: 4,
              py: 1.5,
            }}
          >
            Choose PDF File
          </Button>
        </label>

        <Box className="mt-6">
          <Typography variant="body2" className="text-gray-500">
            Supported formats: PDF, PNG, JPG files
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
