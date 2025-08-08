import React from "react";
import { Box } from "@mui/material";
import FileCard from "./FileCard";
import type { PDFFile } from "@/hooks/useFileManagement";

interface FileGridProps {
  files: PDFFile[];
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, file: PDFFile) => void;
  onView: (file: PDFFile) => void;
  onOCR: (file: PDFFile) => void;
}

export default function FileGrid({
  files,
  onMenuOpen,
  onView,
  onOCR,
}: FileGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
      }}
    >
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onMenuOpen={onMenuOpen}
          onView={onView}
          onOCR={onOCR}
        />
      ))}
    </Box>
  );
}
