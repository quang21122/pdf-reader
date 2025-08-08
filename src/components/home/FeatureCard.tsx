import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface FeatureCardProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", padding: 3 }}>
        <Icon
          sx={{ 
            fontSize: "3rem", 
            marginBottom: 2, 
            color: "#dc2626" 
          }}
        />
        <Typography
          variant="h6"
          sx={{
            marginBottom: 1,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: "#64748b" }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
