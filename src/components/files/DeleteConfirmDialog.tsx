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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete &quot;{file?.filename}&quot;? 
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
