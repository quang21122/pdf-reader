import React from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  CloudUpload,
} from "@mui/icons-material";

interface FilesHeaderProps {
  onUploadClick: () => void;
}

export default function FilesHeader({ onUploadClick }: FilesHeaderProps) {
  return (
    <Box className="mb-8 flex justify-between items-center">
      <Box>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          My PDF Files
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage your uploaded PDF files
        </Typography>
      </Box>
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
        Upload New
      </Button>
    </Box>
  );
}
