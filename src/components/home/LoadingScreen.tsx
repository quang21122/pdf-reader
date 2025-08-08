import React from "react";
import { Box, Typography } from "@mui/material";
import Navigation from "@/components/layout/Navigation";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ 
  message = "Loading..." 
}: LoadingScreenProps) {
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Navigation />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Typography sx={{ color: "#1e293b" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
