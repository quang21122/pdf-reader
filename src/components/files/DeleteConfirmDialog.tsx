import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import type { PDFFile } from "@/hooks/useFileManagement";

interface DeleteConfirmDialogProps {
  open: boolean;
  file: PDFFile | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  file,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  // Get filename with fallbacks
  const getFileName = () => {
    if (!file) return "this file";
    return file.filename || (file as any).name || file.id || "this file";
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Move to Trash</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to move &quot;{getFileName()}&quot; to trash?
          You can restore it later from the trash.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" disabled={deleting}>
          {deleting ? "Moving to Trash..." : "Move to Trash"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
