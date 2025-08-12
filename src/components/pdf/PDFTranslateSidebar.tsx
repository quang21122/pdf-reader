"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  Close,
  SwapHoriz,
  ContentCopy,
  VolumeUp,
  Clear,
} from "@mui/icons-material";
// @ts-ignore
import translate from "google-translate-api-browser";

interface PDFTranslateSidebarProps {
  open: boolean;
  onClose: () => void;
  selectedText?: string;
  onTextReceived?: (text: string) => void;
}

const languages = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ru", name: "Russian" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
];

export default function PDFTranslateSidebar({
  open,
  onClose,
  selectedText,
  onTextReceived,
}: PDFTranslateSidebarProps) {
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("vi");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = React.useCallback(async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translate(sourceText, {
        from: sourceLanguage === "auto" ? "auto" : sourceLanguage,
        to: targetLanguage,
      });

      setTranslatedText(result.text);

      // If source was auto-detect, update the detected language
      if (sourceLanguage === "auto" && result.from?.language?.iso) {
        const detectedLang = result.from.language.iso;
        const langName = getLanguageName(detectedLang);
        console.log("Detected language:", langName, `(${detectedLang})`);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText(
        "Translation failed. Please check your internet connection and try again."
      );
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  // Update source text when selectedText prop changes
  React.useEffect(() => {
    if (selectedText && selectedText.trim()) {
      setSourceText(selectedText.trim());
      // Clear previous translation when new text is selected
      setTranslatedText("");
    }
  }, [selectedText]);

  // Notify parent when text is received
  React.useEffect(() => {
    if (sourceText && onTextReceived) {
      onTextReceived(sourceText);
    }
  }, [sourceText, onTextReceived]);

  const handleSwapLanguages = () => {
    if (sourceLanguage !== "auto") {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  };

  const handleClearText = () => {
    setSourceText("");
    setTranslatedText("");
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeakText = (text: string, language: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "vi" ? "vi-VN" : language === "en" ? "en-US" : language;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          backgroundColor: "#2d2d2d",
          color: "white",
          marginTop: "40px",
          height: "calc(100vh - 40px)",
          borderRadius: 0,
        },
      }}
    >
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
        <Typography variant="h6" sx={{ color: "white" }}>
          Translate
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Language Selection */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "#aaa" }}>From</InputLabel>
            <Select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              label="From"
              sx={{
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
                "& .MuiSvgIcon-root": {
                  color: "#aaa",
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={handleSwapLanguages}
            disabled={sourceLanguage === "auto"}
            sx={{
              color: sourceLanguage === "auto" ? "#555" : "#0078d4",
              "&:hover": {
                backgroundColor: "rgba(0, 120, 212, 0.1)",
              },
            }}
          >
            <SwapHoriz />
          </IconButton>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "#aaa" }}>To</InputLabel>
            <Select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              label="To"
              sx={{
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
                "& .MuiSvgIcon-root": {
                  color: "#aaa",
                },
              }}
            >
              {languages
                .filter((lang) => lang.code !== "auto")
                .map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {/* Instructions */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(0, 120, 212, 0.1)",
            borderRadius: 1,
            border: "1px solid rgba(0, 120, 212, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#0078d4", fontWeight: 500, mb: 1 }}
          >
            📄 How to translate:
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#aaa", fontSize: "0.85rem" }}
          >
            1. Select any text from the PDF document
            <br />
            2. Translation will appear automatically below
            <br />
            3. Use the controls to copy or hear the translation
          </Typography>
        </Box>

        {/* Selected Text Display */}
        <Paper
          sx={{
            backgroundColor: "#333",
            border: "1px solid #555",
            borderRadius: 1,
            p: 2,
            minHeight: 120,
            position: "relative",
          }}
        >
          {sourceText ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {sourceText}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleSpeakText(sourceText, sourceLanguage)}
                  sx={{
                    color: "#aaa",
                    "&:hover": { color: "white" },
                  }}
                  title="Speak text"
                >
                  <VolumeUp fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleCopyText(sourceText)}
                  sx={{
                    color: "#aaa",
                    "&:hover": { color: "white" },
                  }}
                  title="Copy text"
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleClearText}
                  sx={{
                    color: "#aaa",
                    "&:hover": { color: "#f44336" },
                  }}
                  title="Clear text"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Box>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontStyle: "italic",
                textAlign: "center",
                mt: 2,
              }}
            >
              No text selected. Select text from the PDF to translate.
            </Typography>
          )}
        </Paper>

        {/* Action Buttons */}
        {sourceText && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              disabled={isTranslating}
              sx={{
                flex: 1,
                backgroundColor: "#0078d4",
                "&:hover": { backgroundColor: "#106ebe" },
                "&:disabled": {
                  backgroundColor: "#555",
                  color: "#888",
                },
              }}
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearText}
              sx={{
                borderColor: "#555",
                color: "#aaa",
                "&:hover": {
                  borderColor: "#f44336",
                  color: "#f44336",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        )}

        <Divider sx={{ backgroundColor: "#555" }} />

        {/* Translation Result */}
        <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
          Translation
        </Typography>

        <Paper
          sx={{
            backgroundColor: "#333",
            border: "1px solid #555",
            borderRadius: 1,
            p: 2,
            minHeight: 120,
            flex: 1,
            position: "relative",
          }}
        >
          {translatedText ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {translatedText}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    handleSpeakText(translatedText, targetLanguage)
                  }
                  sx={{
                    color: "#aaa",
                    "&:hover": { color: "white" },
                  }}
                >
                  <VolumeUp fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleCopyText(translatedText)}
                  sx={{
                    color: "#aaa",
                    "&:hover": { color: "white" },
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontStyle: "italic",
                textAlign: "center",
                mt: 2,
              }}
            >
              Translation will appear here
            </Typography>
          )}
        </Paper>
      </Box>
    </Drawer>
  );
}
