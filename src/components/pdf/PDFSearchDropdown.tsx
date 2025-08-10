"use client";

import React, { useEffect, useRef } from "react";
import {
  Paper,
  TextField,
  IconButton,
  Box,
  Typography,
  InputAdornment,
  Popper,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Clear,
} from "@mui/icons-material";
import { usePDFSearch, usePDFHighlight, SearchResult } from "@/hooks";

interface PDFSearchDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSearchResult: (result: SearchResult) => void;
  onGoToPage: (pageNumber: number) => void;
}

export default function PDFSearchDropdown({
  open,
  anchorEl,
  onClose,
  onSearchResult,
  onGoToPage,
}: PDFSearchDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Use custom hooks
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentResultIndex,
    isSearching,
    performSearch,
    clearSearch,
    nextResult,
    prevResult,
    goToResult,
  } = usePDFSearch();

  const {
    highlightSearchResults,
    highlightCurrentResult,
    removeHighlights,
    scrollToResult,
  } = usePDFHighlight();

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle search with highlighting
  const handleSearch = async (query: string) => {
    const results = await performSearch(query);

    if (results && results.length > 0) {
      await highlightSearchResults(query);
      setTimeout(() => {
        scrollToResult(results[0], onGoToPage);
        highlightCurrentResult(results[0], query);
      }, 100);
    } else {
      removeHighlights();
    }
  };

  // Event handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    removeHighlights();
  };

  const handleNextResult = () => {
    const result = nextResult();
    if (result) {
      onSearchResult(result);
      scrollToResult(result, onGoToPage);
      highlightCurrentResult(result, searchQuery);
    }
  };

  const handlePrevResult = () => {
    const result = prevResult();
    if (result) {
      onSearchResult(result);
      scrollToResult(result, onGoToPage);
      highlightCurrentResult(result, searchQuery);
    }
  };

  const handleResultClick = (index: number) => {
    const result = goToResult(index);
    if (result) {
      onSearchResult(result);
      scrollToResult(result, onGoToPage);
      highlightCurrentResult(result, searchQuery);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (searchResults.length === 0) {
        handleSearchSubmit();
      } else {
        if (event.shiftKey) {
          handlePrevResult();
        } else {
          handleNextResult();
        }
      }
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  // Reset search when bar opens/closes
  useEffect(() => {
    if (!open) {
      clearSearch();
      removeHighlights();
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, clearSearch, removeHighlights]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{
        zIndex: 1300,
        width: 350,
        maxWidth: 400,
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper
          elevation={8}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="Search in document..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
              size="small"
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "14px",
                  color: "#333",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#0078d4",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0078d4",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#333 !important",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#999 !important",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#666", fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isSearching && (
                      <CircularProgress size={16} sx={{ color: "#0078d4" }} />
                    )}
                    {searchQuery && !isSearching && (
                      <IconButton
                        onClick={handleClearSearch}
                        size="small"
                        sx={{ color: "#666", p: 0.5 }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            {/* Search Results Summary */}
            {searchResults.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  py: 0.5,
                  backgroundColor: "#f5f5f5",
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="caption" sx={{ color: "#666" }}>
                  {searchResults.length} page
                  {searchResults.length !== 1 ? "s" : ""} with matches
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {currentResultIndex + 1}/{searchResults.length}
                  </Typography>
                  <IconButton
                    onClick={handlePrevResult}
                    disabled={searchResults.length === 0}
                    size="small"
                    sx={{ color: "#666", p: 0.25 }}
                  >
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextResult}
                    disabled={searchResults.length === 0}
                    size="small"
                    sx={{ color: "#666", p: 0.25 }}
                  >
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* No Results */}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <Box sx={{ textAlign: "center", py: 2, px: 1 }}>
                <Typography variant="caption" sx={{ color: "#888" }}>
                  No results found for &quot;{searchQuery}&quot;
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
