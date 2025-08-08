import React from "react";
import { Grid } from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  TextFields as OcrIcon,
} from "@mui/icons-material";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: PdfIcon,
    title: "PDF Viewing",
    description: "View PDF files with smooth navigation and zoom controls",
  },
  {
    icon: OcrIcon,
    title: "OCR Technology",
    description: "Extract text from scanned PDFs using Tesseract.js",
  },
  {
    icon: SearchIcon,
    title: "Smart Search",
    description: "Search through PDF content and OCR results",
  },
  {
    icon: UploadIcon,
    title: "Notes & Highlights",
    description: "Add personal notes and highlight important text",
  },
];

export default function FeaturesGrid() {
  return (
    <Grid container spacing={4} sx={{ marginTop: 4 }}>
      {features.map((feature, index) => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 3 }}>
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        </Grid>
      ))}
    </Grid>
  );
}
