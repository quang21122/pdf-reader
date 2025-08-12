"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ViewColumn,
  ViewStream,
  Draw,
  RotateRight,
  Fullscreen,
  FullscreenExit,
  Close,
  Search,
  Download,
  Settings,
  Bookmark,
  MoreVert,
  AutoFixHigh,
  Highlight,
  TextFormat,
  Save,
  Undo,
  Redo,
  CleaningServices as EraseIcon,
  Translate,
} from "@mui/icons-material";

interface PDFToolbarProps {
  filename?: string;
  isFullscreen?: boolean;
  viewMode?: "single" | "continuous";
  isDrawMode?: boolean;
  isEraseMode?: boolean;
  isHighlightMode?: boolean;
  isTextAnnotationMode?: boolean;
  drawColor?: string;
  hasUnsavedChanges?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onMenuClick?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onViewModeChange?: (mode: "single" | "continuous") => void;
  onDrawToggle?: () => void;
  onEraseToggle?: () => void;
  onDrawColorChange?: (color: string) => void;
  onTextAnnotationToggle?: () => void;
  onHighlightToggle?: () => void;
  onRotate?: () => void;
  onFullscreenToggle?: () => void;
  onClose?: () => void;
  onSearch?: (event: React.MouseEvent<HTMLElement>) => void;
  onDownload?: () => void;
  onOCR?: () => void;
  onSettings?: () => void;
  onBookmark?: () => void;
  onTranslate?: () => void;
}

export default function PDFToolbar({
  filename = "Untitled Document",
  isFullscreen = false,
  viewMode = "continuous",
  isDrawMode = false,
  isEraseMode = false,
  isHighlightMode = false,
  isTextAnnotationMode = false,
  drawColor = "#ff0000",
  hasUnsavedChanges = false,
  canUndo = false,
  canRedo = false,
  onMenuClick,
  onSave,
  onUndo,
  onRedo,
  onViewModeChange,
  onDrawToggle,
  onEraseToggle,
  onDrawColorChange,
  onTextAnnotationToggle,
  onHighlightToggle,
  onRotate,
  onFullscreenToggle,
  onClose,
  onSearch,
  onDownload,
  onOCR,
  onSettings,
  onBookmark,
  onTranslate,
}: PDFToolbarProps) {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<null | HTMLElement>(null);

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleColorPickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleColorChange = (color: string) => {
    onDrawColorChange?.(color);
    handleColorPickerClose();
  };

  const availableColors = [
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
    "#000000", // Black
    "#808080", // Gray
  ];

  return (
    <AppBar
      position="fixed"
      className="toolbar-height no-print"
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        borderRadius: 0,
        zIndex: 1300,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        height: "40px",
        minHeight: "40px",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "40px !important",
          height: "40px",
          px: 1,
          py: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section - Menu and View Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Menu">
            <IconButton
              edge="start"
              onClick={onMenuClick}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, backgroundColor: "#e0e0e0" }}
          />

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && onViewModeChange?.(newMode)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                color: "#424242",
                border: "1px solid #e0e0e0",
                "&.Mui-selected": {
                  backgroundColor: "#0078d4",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#106ebe", // Darker blue on hover for selected state
                    color: "white",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
          >
            <ToggleButton value="single" aria-label="single page">
              <Tooltip title="Single Page View">
                <ViewColumn fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="continuous" aria-label="continuous">
              <Tooltip title="Continuous View">
                <ViewStream fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, backgroundColor: "#e0e0e0" }}
          />

          {/* Drawing and Text Tools */}
          <Tooltip title="Add Text Annotation">
            <IconButton
              onClick={onTextAnnotationToggle}
              size="small"
              sx={{
                color: isTextAnnotationMode ? "#fff" : "#424242",
                backgroundColor: isTextAnnotationMode
                  ? "#2196f3"
                  : "transparent",
                p: 0.5,
                "&:hover": {
                  backgroundColor: isTextAnnotationMode ? "#1976d2" : "#f5f5f5",
                },
              }}
            >
              <TextFormat fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Draw">
            <IconButton
              onClick={onDrawToggle}
              size="small"
              sx={{
                color: isDrawMode ? "#fff" : "#424242",
                backgroundColor: isDrawMode ? "#9c27b0" : "transparent",
                p: 0.5,
                "&:hover": {
                  backgroundColor: isDrawMode ? "#7b1fa2" : "#f5f5f5",
                },
              }}
            >
              <Draw fontSize="small" />
            </IconButton>
          </Tooltip>

          {isDrawMode && (
            <Tooltip title="Choose Draw Color">
              <IconButton
                onClick={handleColorPickerOpen}
                size="small"
                sx={{
                  color: "#424242",
                  backgroundColor: "transparent",
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: drawColor,
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Erase Drawings">
            <IconButton
              onClick={onEraseToggle}
              size="small"
              sx={{
                color: isEraseMode ? "#fff" : "#424242",
                backgroundColor: isEraseMode ? "#f44336" : "transparent",
                p: 0.5,
                "&:hover": {
                  backgroundColor: isEraseMode ? "#d32f2f" : "#f5f5f5",
                },
              }}
            >
              <EraseIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Highlight Text">
            <IconButton
              onClick={onHighlightToggle}
              size="small"
              sx={{
                color: isHighlightMode ? "#fff" : "#424242",
                backgroundColor: isHighlightMode ? "#ff9800" : "transparent",
                p: 0.5,
                "&:hover": {
                  backgroundColor: isHighlightMode ? "#f57c00" : "#f5f5f5",
                },
              }}
            >
              <Highlight fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              hasUnsavedChanges
                ? "Save PDF with Annotations (Ctrl+S)"
                : "No Changes to Save"
            }
          >
            <IconButton
              onClick={onSave}
              size="small"
              disabled={!hasUnsavedChanges}
              sx={{
                color: hasUnsavedChanges ? "#fff" : "#9e9e9e",
                backgroundColor: hasUnsavedChanges ? "#4caf50" : "transparent",
                p: 0.5,
                "&:hover": {
                  backgroundColor: hasUnsavedChanges ? "#388e3c" : "#f5f5f5",
                },
                "&:disabled": {
                  color: "#9e9e9e",
                  backgroundColor: "transparent",
                },
              }}
            >
              <Save fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Undo (Ctrl+Z)">
            <IconButton
              onClick={onUndo}
              size="small"
              disabled={!canUndo}
              sx={{
                color: canUndo ? "#424242" : "#9e9e9e",
                p: 0.5,
                "&:hover": {
                  backgroundColor: canUndo ? "#f5f5f5" : "transparent",
                },
                "&:disabled": {
                  color: "#9e9e9e",
                },
              }}
            >
              <Undo fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Redo (Ctrl+Shift+Z)">
            <IconButton
              onClick={onRedo}
              size="small"
              disabled={!canRedo}
              sx={{
                color: canRedo ? "#424242" : "#9e9e9e",
                p: 0.5,
                "&:hover": {
                  backgroundColor: canRedo ? "#f5f5f5" : "transparent",
                },
                "&:disabled": {
                  color: "#9e9e9e",
                },
              }}
            >
              <Redo fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, backgroundColor: "#e0e0e0" }}
          />

          {/* Page Controls */}
          <Tooltip title="Rotate Page">
            <IconButton
              onClick={onRotate}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <RotateRight fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Center Section - Document Title */}
        <Typography
          variant="body2"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "#212121",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mx: 2,
          }}
        >
          {filename}
        </Typography>

        {/* Right Section - Actions and Window Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Search */}
          <Tooltip title="Search">
            <IconButton
              onClick={onSearch}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <Search fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Bookmark */}
          <Tooltip title="Bookmark">
            <IconButton
              onClick={onBookmark}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <Bookmark fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Translate */}
          <Tooltip title="Translate">
            <IconButton
              onClick={onTranslate}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <Translate fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* More Actions Menu */}
          <Tooltip title="More Actions">
            <IconButton
              onClick={handleMoreMenuOpen}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={moreMenuAnchor}
            open={Boolean(moreMenuAnchor)}
            onClose={handleMoreMenuClose}
            slotProps={{
              paper: {
                sx: { backgroundColor: "white", color: "#212121" },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                onDownload?.();
                handleMoreMenuClose();
              }}
            >
              <ListItemIcon>
                <Download fontSize="small" sx={{ color: "#424242" }} />
              </ListItemIcon>
              <ListItemText>Download</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOCR?.();
                handleMoreMenuClose();
              }}
            >
              <ListItemIcon>
                <AutoFixHigh fontSize="small" sx={{ color: "#424242" }} />
              </ListItemIcon>
              <ListItemText>OCR</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onSettings?.();
                handleMoreMenuClose();
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: "#424242" }} />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
          </Menu>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, backgroundColor: "#e0e0e0" }}
          />

          {/* Window Controls */}
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              onClick={onFullscreenToggle}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              {isFullscreen ? (
                <FullscreenExit fontSize="small" />
              ) : (
                <Fullscreen fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "#424242",
                p: 0.5,
                "&:hover": {
                  backgroundColor: "#e81123",
                  color: "white",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Color Picker Menu */}
      <Menu
        anchorEl={colorPickerAnchor}
        open={Boolean(colorPickerAnchor)}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 1,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
          }}
        >
          {availableColors.map((color) => (
            <Tooltip key={color} title={`Select ${color}`}>
              <IconButton
                onClick={() => handleColorChange(color)}
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: color,
                  border:
                    drawColor === color ? "3px solid #000" : "1px solid #ccc",
                  "&:hover": {
                    backgroundColor: color,
                    opacity: 0.8,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Menu>
    </AppBar>
  );
}
