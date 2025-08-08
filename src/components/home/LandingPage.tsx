import React from "react";
import { Box, Container } from "@mui/material";
import Navigation from "@/components/layout/Navigation";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";

export default function LandingPage() {
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <HeroSection />
        <FeaturesGrid />
      </Container>
    </Box>
  );
}
