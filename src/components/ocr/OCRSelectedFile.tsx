import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";

interface OCRSelectedFileProps {
  fileName: string;
  onRemove: () => void;
}

export default function OCRSelectedFile({ fileName, onRemove }: OCRSelectedFileProps) {
  return (
    <Card sx={{ backgroundColor: "white", mb: 4 }}>
      <CardContent>
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography variant="h6" className="font-semibold">
              Selected File
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {fileName}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={onRemove} color="error">
            Remove File
          </Button>
        </Box>
        <Divider />
      </CardContent>
    </Card>
  );
}
