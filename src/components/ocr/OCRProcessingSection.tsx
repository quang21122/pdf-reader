import React from "react";
import { Card, CardContent } from "@mui/material";
import OCRProcessor from "./OCRProcessor";
import { OCRResult } from "@/hooks/useOCRFileHandler";

interface OCRProcessingSectionProps {
  pdfUrl: string;
  onResults: (results: OCRResult[]) => void;
}

export default function OCRProcessingSection({ 
  pdfUrl, 
  onResults 
}: OCRProcessingSectionProps) {
  return (
    <Card sx={{ backgroundColor: "white" }}>
      <CardContent>
        <OCRProcessor pdfUrl={pdfUrl} onResults={onResults} />
      </CardContent>
    </Card>
  );
}
