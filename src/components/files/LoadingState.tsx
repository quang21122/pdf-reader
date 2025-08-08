import React from "react";
import {
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import Navigation from "@/components/layout/Navigation";

export default function LoadingState() {
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-center items-center py-20">
          <CircularProgress />
        </Box>
      </Container>
    </Box>
  );
}
