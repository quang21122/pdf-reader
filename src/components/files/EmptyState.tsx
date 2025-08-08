import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import {
  Description,
  CloudUpload,
} from "@mui/icons-material";

interface EmptyStateProps {
  onUploadClick: () => void;
}

export default function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <Card sx={{ backgroundColor: "white" }}>
      <CardContent className="text-center py-16">
        <Description className="text-7xl text-gray-300 mb-6" />
        <Typography
          variant="h6"
          className="text-gray-500 mb-3 font-semibold"
        >
          No files uploaded yet
        </Typography>
        <Typography variant="body1" className="text-gray-400 mb-8">
          Upload your first PDF file to get started
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={onUploadClick}
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          Upload PDF
        </Button>
      </CardContent>
    </Card>
  );
}
