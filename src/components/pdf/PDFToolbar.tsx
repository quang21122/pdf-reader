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
  TextFields,
  RotateRight,
  SmartToy,
  Fullscreen,
  FullscreenExit,
  Close,
  Search,
  Print,
  Download,
  Settings,
  Bookmark,
  MoreVert,
  AutoFixHigh,
} from "@mui/icons-material";

interface PDFToolbarProps {
  filename?: string;
  isFullscreen?: boolean;
  viewMode?: "single" | "continuous";
  onMenuClick?: () => void;
  onViewModeChange?: (mode: "single" | "continuous") => void;
  onDrawToggle?: () => void;
  onTextSelect?: () => void;
  onRotate?: () => void;
  onAskCopilot?: () => void;
  onFullscreenToggle?: () => void;
  onClose?: () => void;
  onSearch?: (event: React.MouseEvent<HTMLElement>) => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onOCR?: () => void;
  onSettings?: () => void;
  onBookmark?: () => void;
}

export default function PDFToolbar({
  filename = "Untitled Document",
  isFullscreen = false,
  viewMode = "continuous",
  onMenuClick,
  onViewModeChange,
  onDrawToggle,
  onTextSelect,
  onRotate,
  onAskCopilot,
  onFullscreenToggle,
  onClose,
  onSearch,
  onPrint,
  onDownload,
  onOCR,
  onSettings,
  onBookmark,
}: PDFToolbarProps) {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

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
          <Tooltip title="Draw">
            <IconButton
              onClick={onDrawToggle}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <Draw fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Text Selection">
            <IconButton
              onClick={onTextSelect}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <TextFields fontSize="small" />
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
          {/* AI Assistant */}
          <Tooltip title="Ask Copilot">
            <IconButton
              onClick={onAskCopilot}
              size="small"
              sx={{ color: "#424242", p: 0.5 }}
            >
              <SmartToy fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, backgroundColor: "#e0e0e0" }}
          />

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
                onPrint?.();
                handleMoreMenuClose();
              }}
            >
              <ListItemIcon>
                <Print fontSize="small" sx={{ color: "#424242" }} />
              </ListItemIcon>
              <ListItemText>Print</ListItemText>
            </MenuItem>
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
    </AppBar>
  );
}
