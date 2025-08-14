import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import {
  Description,
  MoreVert,
  Visibility,
  TextFields,
  Delete,
} from "@mui/icons-material";
import type { PDFFile } from "@/stores/types";
import { fileUtils } from "@/hooks/useFileManagement";

interface FileCardProps {
  file: PDFFile;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, file: PDFFile) => void;
  onView: (file: PDFFile) => void;
  onOCR: (file: PDFFile) => void;
  onDelete: (file: PDFFile) => void;
}

export default function FileCard({
  file,
  onMenuOpen,
  onView,
  onOCR,
  onDelete,
}: FileCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        "&:hover": {
          boxShadow: "0 4px 12px 0 rgb(0 0 0 / 0.15)",
        },
        transition: "box-shadow 0.2s",
      }}
    >
      <CardContent className="p-4">
        <Box className="flex justify-between items-start mb-3">
          <Description className="text-red-500 text-3xl" />
          <Box className="flex gap-1">
            <IconButton size="small" onClick={(e) => onMenuOpen(e, file)}>
              <MoreVert />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(file)}
              sx={{
                color: "#ef4444",
                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
              title="Move to trash"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="h6"
          className="font-semibold mb-2 text-gray-800 truncate"
          title={file.filename}
        >
          {file.filename}
        </Typography>

        <Box className="flex flex-wrap gap-2 mb-3">
          <Chip
            label={fileUtils.formatFileSize(file.file_size)}
            size="small"
            variant="outlined"
            sx={{
              color: "#000000", // Changed from white to black
              borderColor: "#e5e7eb",
            }}
          />
          <Chip label="PDF" size="small" color="error" variant="outlined" />
        </Box>

        <Typography variant="body2" className="text-gray-500 mb-4">
          Uploaded {fileUtils.formatDate(file.upload_date)}
        </Typography>

        <Box className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => onView(file)}
            className="flex-1"
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<TextFields />}
            onClick={() => onOCR(file)}
            className="flex-1"
            sx={{
              borderColor: "#7c3aed",
              color: "#7c3aed",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                borderColor: "#6d28d9",
              },
            }}
          >
            OCR
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
