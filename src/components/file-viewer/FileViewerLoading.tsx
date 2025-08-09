import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function FileViewerLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={48} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading PDF...
        </Typography>
      </Box>
    </Box>
  );
}
