"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface PDFSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  viewMode: "single" | "continuous";
  fitMode: "width" | "height" | "page";
  scale: number;
  showThumbnails: boolean;
  showBookmarks: boolean;
  onViewModeChange: (mode: "single" | "continuous") => void;
  onFitModeChange: (mode: "width" | "height" | "page") => void;
  onScaleChange: (scale: number) => void;
  onToggleThumbnails: () => void;
  onToggleBookmarks: () => void;
}

export default function PDFSettingsDialog({
  open,
  onClose,
  viewMode,
  fitMode,
  scale,
  showThumbnails,
  showBookmarks,
  onViewModeChange,
  onFitModeChange,
  onScaleChange,
  onToggleThumbnails,
  onToggleBookmarks,
}: PDFSettingsDialogProps) {
  const handleViewModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onViewModeChange(event.target.value as "single" | "continuous");
  };

  const handleFitModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFitModeChange(event.target.value as "width" | "height" | "page");
  };

  const handleScaleChange = (_: Event, newValue: number | number[]) => {
    onScaleChange(newValue as number);
  };

  const handleReset = () => {
    onViewModeChange("continuous");
    onFitModeChange("width");
    onScaleChange(1.0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#2d2d2d",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        PDF Viewer Settings
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* View Mode Settings */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ color: "white", mb: 1, fontWeight: 500 }}
            >
              View Mode
            </FormLabel>
            <RadioGroup
              value={viewMode}
              onChange={handleViewModeChange}
              sx={{ ml: 1 }}
            >
              <FormControlLabel
                value="continuous"
                control={<Radio sx={{ color: "#0078d4" }} />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Continuous
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#ccc" }}>
                      Show all pages in a scrollable view
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="single"
                control={<Radio sx={{ color: "#0078d4" }} />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Single Page
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#ccc" }}>
                      Show one page at a time
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ backgroundColor: "#404040", my: 2 }} />

        {/* Fit Mode Settings */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ color: "white", mb: 1, fontWeight: 500 }}
            >
              Fit Mode
            </FormLabel>
            <RadioGroup
              value={fitMode}
              onChange={handleFitModeChange}
              sx={{ ml: 1 }}
            >
              <FormControlLabel
                value="width"
                control={<Radio sx={{ color: "#0078d4" }} />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Fit Width
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#ccc" }}>
                      Fit page width to viewer
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="height"
                control={<Radio sx={{ color: "#0078d4" }} />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Fit Height
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#ccc" }}>
                      Fit page height to viewer
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="page"
                control={<Radio sx={{ color: "#0078d4" }} />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Fit Page
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#ccc" }}>
                      Fit entire page to viewer
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ backgroundColor: "#404040", my: 2 }} />

        {/* Zoom Settings */}
        <Box sx={{ mb: 3 }}>
          <FormLabel
            component="legend"
            sx={{ color: "white", mb: 2, fontWeight: 500, display: "block" }}
          >
            Zoom Level: {Math.round(scale * 100)}%
          </FormLabel>
          <Slider
            value={scale}
            onChange={handleScaleChange}
            min={0.5}
            max={3.0}
            step={0.1}
            marks={[
              { value: 0.5, label: "50%" },
              { value: 1.0, label: "100%" },
              { value: 1.5, label: "150%" },
              { value: 2.0, label: "200%" },
              { value: 3.0, label: "300%" },
            ]}
            sx={{
              color: "#0078d4",
              "& .MuiSlider-markLabel": {
                color: "#ccc",
                fontSize: "0.75rem",
              },
              "& .MuiSlider-mark": {
                backgroundColor: "#555",
              },
            }}
          />
        </Box>

        <Divider sx={{ backgroundColor: "#404040", my: 2 }} />

        {/* UI Settings */}
        <Box sx={{ mb: 3 }}>
          <FormLabel
            component="legend"
            sx={{ color: "white", mb: 2, fontWeight: 500, display: "block" }}
          >
            Interface
          </FormLabel>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: "white" }}>
                Show Thumbnails
              </Typography>
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                Display page thumbnails in sidebar
              </Typography>
            </Box>
            <Switch
              checked={showThumbnails}
              onChange={onToggleThumbnails}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#0078d4",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#0078d4",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: "white" }}>
                Show Bookmarks
              </Typography>
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                Display bookmarks panel
              </Typography>
            </Box>
            <Switch
              checked={showBookmarks}
              onChange={onToggleBookmarks}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#0078d4",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#0078d4",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleReset}
          sx={{
            color: "#ccc",
            "&:hover": {
              backgroundColor: "#404040",
            },
          }}
        >
          Reset to Default
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#0078d4",
            "&:hover": {
              backgroundColor: "#106ebe",
            },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
