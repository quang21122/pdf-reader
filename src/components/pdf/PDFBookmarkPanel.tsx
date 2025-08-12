"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { Bookmark, Edit, Delete, Add } from "@mui/icons-material";
import { usePDFViewerStore } from "@/stores";

interface PDFBookmarkPanelProps {
  onPageClick: (pageNumber: number) => void;
}

export default function PDFBookmarkPanel({
  onPageClick,
}: PDFBookmarkPanelProps) {
  const {
    bookmarks,
    currentPage,
    addBookmark,
    removeBookmark,
    updateBookmark,
    getBookmarks,
  } = usePDFViewerStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [bookmarkTitle, setBookmarkTitle] = useState("");

  const sortedBookmarks = getBookmarks();

  const handleAddBookmark = () => {
    setBookmarkTitle(`Page ${currentPage}`);
    setIsAddDialogOpen(true);
  };

  const handleSaveNewBookmark = () => {
    if (bookmarkTitle.trim()) {
      addBookmark({
        pageNumber: currentPage,
        title: bookmarkTitle.trim(),
      });
      setBookmarkTitle("");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditBookmark = (bookmarkId: string, currentTitle: string) => {
    setEditingBookmark(bookmarkId);
    setBookmarkTitle(currentTitle);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditBookmark = () => {
    if (editingBookmark && bookmarkTitle.trim()) {
      updateBookmark(editingBookmark, { title: bookmarkTitle.trim() });
      setEditingBookmark(null);
      setBookmarkTitle("");
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  const handleCancelDialog = () => {
    setBookmarkTitle("");
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingBookmark(null);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #404040",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}
        >
          <Bookmark fontSize="small" />
          Bookmarks
        </Typography>
        <Tooltip title="Add Bookmark">
          <IconButton
            onClick={handleAddBookmark}
            size="small"
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Bookmarks List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {sortedBookmarks.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#888",
            }}
          >
            <Bookmark sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              No bookmarks yet
            </Typography>
            <Typography variant="caption" sx={{ textAlign: "center", mt: 1 }}>
              Click the + button to add a bookmark
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sortedBookmarks.map((bookmark) => (
              <ListItem
                key={bookmark.id}
                disablePadding
                sx={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <ListItemButton
                  onClick={() => onPageClick(bookmark.pageNumber)}
                  sx={{
                    backgroundColor:
                      currentPage === bookmark.pageNumber
                        ? "rgba(0, 120, 212, 0.3)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        currentPage === bookmark.pageNumber
                          ? "rgba(0, 120, 212, 0.4)"
                          : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={bookmark.title}
                    secondary={`Page ${bookmark.pageNumber}`}
                    primaryTypographyProps={{
                      sx: {
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight:
                          currentPage === bookmark.pageNumber ? 600 : 400,
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: "#aaa",
                        fontSize: "0.8rem",
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBookmark(bookmark.id, bookmark.title);
                        }}
                        sx={{
                          color: "#aaa",
                          "&:hover": {
                            color: "white",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBookmark(bookmark.id);
                        }}
                        sx={{
                          color: "#aaa",
                          "&:hover": {
                            color: "#f44336",
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add Bookmark Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCancelDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
          },
        }}
      >
        <DialogTitle>Add Bookmark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Bookmark Title"
            value={bookmarkTitle}
            onChange={(e) => setBookmarkTitle(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ sx: { color: "#aaa" } }}
            InputProps={{
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0078d4",
                },
              },
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveNewBookmark();
              }
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: "#aaa" }}>
            This bookmark will point to page {currentPage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog} sx={{ color: "#aaa" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewBookmark}
            variant="contained"
            sx={{
              backgroundColor: "#0078d4",
              "&:hover": { backgroundColor: "#106ebe" },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Bookmark Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCancelDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
          },
        }}
      >
        <DialogTitle>Edit Bookmark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Bookmark Title"
            value={bookmarkTitle}
            onChange={(e) => setBookmarkTitle(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ sx: { color: "#aaa" } }}
            InputProps={{
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0078d4",
                },
              },
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveEditBookmark();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog} sx={{ color: "#aaa" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditBookmark}
            variant="contained"
            sx={{
              backgroundColor: "#0078d4",
              "&:hover": { backgroundColor: "#106ebe" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
