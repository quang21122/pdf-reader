import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PDFFile } from "./useFileManagement";

/**
 * Custom hook for file actions and menu management
 * Handles menu state, navigation, and action confirmations
 */
export const useFileActions = () => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<PDFFile | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    file: PDFFile
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't reset selectedFile here as it might be needed for delete dialog
  };

  const handleView = (file: PDFFile) => {
    router.push(`/files/${file.id}`);
    handleMenuClose();
    setSelectedFile(null);
  };

  const handleOCR = (file: PDFFile) => {
    router.push(`/ocr?fileId=${file.id}`);
    handleMenuClose();
    setSelectedFile(null);
  };

  const handleDeleteClick = (file?: PDFFile) => {
    // Close menu first if it's open
    if (anchorEl) {
      handleMenuClose();
    }

    // Set file to delete
    if (file) {
      setFileToDelete(file);
      setSelectedFile(file);
    }

    // Open dialog
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
    setSelectedFile(null);
  };

  const handleDeleteConfirm = async (
    deleteFunction: (file: PDFFile) => Promise<boolean>
  ) => {
    const fileToProcess = fileToDelete || selectedFile;
    if (!fileToProcess) return false;

    const success = await deleteFunction(fileToProcess);
    if (success) {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      setSelectedFile(null);
    }
    return success;
  };

  const navigateToUpload = () => {
    router.push("/upload");
  };

  return {
    // Menu state
    anchorEl,
    selectedFile,
    deleteDialogOpen,
    fileToDelete,

    // Menu actions
    handleMenuOpen,
    handleMenuClose,

    // File actions
    handleView,
    handleOCR,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,

    // Navigation
    navigateToUpload,

    // Computed
    isMenuOpen: Boolean(anchorEl),
  };
};
