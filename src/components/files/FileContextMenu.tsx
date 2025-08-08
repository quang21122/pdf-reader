import React from "react";
import {
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  TextFields,
  Download,
  Delete,
} from "@mui/icons-material";
import type { PDFFile } from "@/hooks/useFileManagement";

interface FileContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  selectedFile: PDFFile | null;
  onClose: () => void;
  onView: (file: PDFFile) => void;
  onOCR: (file: PDFFile) => void;
  onDownload: (file: PDFFile) => void;
  onDelete: () => void;
}

export default function FileContextMenu({
  anchorEl,
  open,
  selectedFile,
  onClose,
  onView,
  onOCR,
  onDownload,
  onDelete,
}: FileContextMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => selectedFile && onView(selectedFile)}>
        <Visibility className="mr-2" />
        View
      </MenuItem>
      <MenuItem onClick={() => selectedFile && onOCR(selectedFile)}>
        <TextFields className="mr-2" />
        OCR
      </MenuItem>
      <MenuItem
        onClick={() => selectedFile && onDownload(selectedFile)}
      >
        <Download className="mr-2" />
        Download
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
        <Delete className="mr-2" />
        Delete
      </MenuItem>
    </Menu>
  );
}
