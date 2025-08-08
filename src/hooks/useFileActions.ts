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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    file: PDFFile
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleView = (file: PDFFile) => {
    router.push(`/viewer/${file.id}`);
    handleMenuClose();
  };

  const handleOCR = (file: PDFFile) => {
    router.push(`/ocr?fileId=${file.id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDeleteConfirm = async (
    deleteFunction: (file: PDFFile) => Promise<boolean>
  ) => {
    if (!selectedFile) return false;

    const success = await deleteFunction(selectedFile);
    if (success) {
      setDeleteDialogOpen(false);
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
