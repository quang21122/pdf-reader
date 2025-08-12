"use client";

import React, { useState } from "react";
import { Drawer, Typography, Box, IconButton, Tabs, Tab } from "@mui/material";
import { Close, ViewModule, Bookmark } from "@mui/icons-material";
import PDFThumbnail from "./PDFThumbnail";
import PDFBookmarkPanel from "./PDFBookmarkPanel";

interface PDFSidebarProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  numPages: number;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
  activeTab?: number;
  onTabChange?: (tab: number) => void;
}

export default function PDFSidebar({
  open,
  onClose,
  fileUrl,
  numPages,
  currentPage,
  onPageClick,
  activeTab = 0,
  onTabChange,
}: PDFSidebarProps) {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);

  const currentTab = onTabChange ? activeTab : localActiveTab;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (onTabChange) {
      onTabChange(newValue);
    } else {
      setLocalActiveTab(newValue);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          backgroundColor: "#2d2d2d",
          color: "white",
          marginTop: "40px", // Offset for toolbar
          height: "calc(100vh - 40px)", // Adjust height
          borderRadius: 0, // Remove border radius
        },
      }}
    >
      {/* Header with Tabs */}
      <Box
        sx={{
          borderBottom: "1px solid #404040",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            {currentTab === 0 ? "Pages" : "Bookmarks"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#0078d4",
            },
            "& .MuiTab-root": {
              color: "#aaa",
              "&.Mui-selected": {
                color: "white",
              },
            },
          }}
        >
          <Tab
            icon={<ViewModule fontSize="small" />}
            label="Pages"
            sx={{ minHeight: 48, textTransform: "none" }}
          />
          <Tab
            icon={<Bookmark fontSize="small" />}
            label="Bookmarks"
            sx={{ minHeight: 48, textTransform: "none" }}
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentTab === 0 ? (
          // Page Thumbnails
          <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;

              return (
                <PDFThumbnail
                  key={pageNumber}
                  fileUrl={fileUrl}
                  pageNumber={pageNumber}
                  isCurrentPage={isCurrentPage}
                  onClick={() => onPageClick(pageNumber)}
                />
              );
            })}
          </Box>
        ) : (
          // Bookmarks
          <PDFBookmarkPanel onPageClick={onPageClick} />
        )}
      </Box>
    </Drawer>
  );
}
