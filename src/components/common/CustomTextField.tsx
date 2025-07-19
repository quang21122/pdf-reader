"use client";

import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

interface CustomTextFieldProps extends Omit<TextFieldProps, "label"> {
  label: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function CustomTextField({
  label,
  required = false,
  startIcon,
  endIcon,
  placeholder,
  ...props
}: CustomTextFieldProps) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: "#374151",
          marginBottom: 1,
        }}
      >
        {label} {required && "*"}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        {...props}
        slotProps={{
          ...props.slotProps,
          input: {
            ...props.slotProps?.input,
            startAdornment: startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: endIcon && (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            backgroundColor: "white",
            border: "2px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            color: "#000000",
            "&:hover": {
              backgroundColor: "white",
              borderColor: "#cbd5e1",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            },
            "&.Mui-focused": {
              backgroundColor: "white",
              borderColor: "#dc2626",
              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
            },
            "& input": {
              color: "#000000",
              "&::placeholder": {
                color: "#9ca3af",
                opacity: 1,
              },
            },
            "& textarea": {
              color: "#000000",
              "&::placeholder": {
                color: "#9ca3af",
                opacity: 1,
              },
            },
            "& fieldset": {
              border: "none",
            },
          },
          ...props.sx,
        }}
      />
    </Box>
  );
}
