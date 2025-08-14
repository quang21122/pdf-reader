"use client";

import React from "react";
import { Container, Box } from "@mui/material";
import Navigation from "@/components/layout/Navigation";
import OCRHeader from "./OCRHeader";
import OCRFileUpload from "./OCRFileUpload";
import OCRSelectedFile from "./OCRSelectedFile";
import OCRProcessingSection from "./OCRProcessingSection";
import OCRInfo from "./OCRInfo";
import { useOCRFileHandler } from "@/hooks/useOCRFileHandler";

export default function OCRContent() {
  const {
    selectedFile,
    pdfUrl,
    handleFileSelect,
    handleOCRResults,
    resetFile,
  } = useOCRFileHandler();

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <OCRHeader />

        {!pdfUrl ? (
          <OCRFileUpload onFileSelect={handleFileSelect} />
        ) : (
          <Box>
            <OCRSelectedFile
              fileName={selectedFile?.name || ""}
              onRemove={resetFile}
            />
            <OCRProcessingSection
              pdfUrl={pdfUrl}
              onResults={handleOCRResults}
            />
          </Box>
        )}

        <OCRInfo />
      </Container>
    </Box>
  );
}
