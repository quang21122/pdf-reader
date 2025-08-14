"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface OCRResultData {
  pageNumber: number;
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

interface OCRResultProps {
  results: OCRResultData[];
  isProcessing?: boolean;
  progress?: number;
  onCopyText?: (text: string) => void;
  onSearchInText?: (text: string) => void;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 95) return "success";
  if (confidence >= 85) return "info";
  if (confidence >= 70) return "warning";
  return "error";
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 95) return "Excellent";
  if (confidence >= 85) return "Good";
  if (confidence >= 70) return "Fair";
  return "Poor";
};

export default function OCRResult({
  results,
  isProcessing = false,
  progress = 0,
  onCopyText,
  onSearchInText,
}: OCRResultProps) {
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopyText?.(text);
  };

  const handleSearchText = (text: string) => {
    onSearchInText?.(text);
  };

  if (isProcessing) {
    return (
      <Box className="p-4">
        <Typography variant="h6" className="mb-4 text-black">
          OCR Processing...
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          className="mb-2"
        />
        <Typography variant="body2" className="text-gray-600">
          {Math.round(progress)}% complete
        </Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="body2" className="text-gray-600">
          No OCR results available. Upload a PDF and run OCR to see extracted
          text.
        </Typography>
      </Box>
    );
  }

  const totalConfidence =
    results.reduce((sum, result) => sum + result.confidence, 0) /
    results.length;

  return (
    <Box className="p-4">
      <Box className="mb-4">
        <Typography variant="h6" className="mb-2 text-black">
          OCR Results
        </Typography>
        <Box className="flex items-center gap-2 mb-2">
          <Chip
            label={`${results.length} page${results.length !== 1 ? "s" : ""}`}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: "black",
              borderColor: "rgba(0, 0, 0, 0.23)",
            }}
          />
          <Chip
            label={`${getConfidenceLabel(totalConfidence)} (${Math.round(
              totalConfidence
            )}%)`}
            size="small"
            color={
              getConfidenceColor(totalConfidence) as
                | "default"
                | "primary"
                | "secondary"
                | "error"
                | "info"
                | "success"
                | "warning"
            }
          />
        </Box>
      </Box>

      <Box className="space-y-2">
        {results.map((result) => (
          <Accordion
            key={result.pageNumber}
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "black" }} />}
              sx={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              <Box className="flex items-center justify-between w-full mr-4">
                <Typography variant="subtitle2" className="text-black">
                  Page {result.pageNumber}
                </Typography>
                <Box className="flex items-center gap-2">
                  <Chip
                    label={`${Math.round(result.confidence)}%`}
                    size="small"
                    color={
                      getConfidenceColor(result.confidence) as
                        | "default"
                        | "primary"
                        | "secondary"
                        | "error"
                        | "info"
                        | "success"
                        | "warning"
                    }
                  />
                  <Typography variant="caption" className="text-gray-600">
                    {result.text.length} characters
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              <Box>
                <Box className="flex justify-end gap-1 mb-2">
                  <Tooltip title="Copy text">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyText(result.text)}
                      sx={{ color: "black" }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Search in document">
                    <IconButton
                      size="small"
                      onClick={() => handleSearchText(result.text)}
                      sx={{ color: "black" }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Paper
                  variant="outlined"
                  className="p-3"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    className="whitespace-pre-wrap font-mono text-sm text-black"
                  >
                    {result.text || "No text extracted from this page."}
                  </Typography>
                </Paper>
                {result.words && result.words.length > 0 && (
                  <Box className="mt-3">
                    <Typography
                      variant="caption"
                      className="mb-2 block text-gray-600"
                    >
                      Word-level confidence (showing words with confidence &lt;
                      80%):
                    </Typography>
                    <Box className="flex flex-wrap gap-1">
                      {result.words
                        .filter((word) => word.confidence < 80)
                        .slice(0, 10) // Show only first 10 low-confidence words
                        .map((word, index) => (
                          <Chip
                            key={index}
                            label={`${word.text} (${Math.round(
                              word.confidence
                            )}%)`}
                            size="small"
                            variant="outlined"
                            color="warning"
                          />
                        ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
