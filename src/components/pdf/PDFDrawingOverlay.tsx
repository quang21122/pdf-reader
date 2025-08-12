import React, { useState } from "react";
import { Box } from "@mui/material";
import { usePDFViewerStore } from "@/stores";

interface PDFDrawingOverlayProps {
  pageNumber: number;
}

export default function PDFDrawingOverlay({
  pageNumber,
}: PDFDrawingOverlayProps) {
  const { getDrawingsForPage, isEraseMode, removeDrawing } =
    usePDFViewerStore();
  const drawings = getDrawingsForPage(pageNumber);
  const [hoveredDrawing, setHoveredDrawing] = useState<string | null>(null);

  if (drawings.length === 0) return null;

  const handleDrawingClick = (drawingId: string, event: React.MouseEvent) => {
    if (isEraseMode) {
      event.stopPropagation();
      event.preventDefault();
      removeDrawing(drawingId);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: isEraseMode ? "auto" : "none",
        zIndex: isEraseMode ? 10 : 3, // Higher z-index when in erase mode
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {drawings.map((drawing) => (
          <g key={drawing.id}>
            {drawing.paths.map((path, pathIndex) => {
              if (path.length < 2) return null;

              // Create polyline points
              const points = path
                .map((point) => `${point.x},${point.y}`)
                .join(" ");

              return (
                <React.Fragment key={`${drawing.id}-${pathIndex}`}>
                  <polyline
                    points={points}
                    stroke={
                      isEraseMode && hoveredDrawing === drawing.id
                        ? "#ff0000"
                        : drawing.color
                    }
                    strokeWidth={Math.max(drawing.strokeWidth * 0.1, 0.5)} // Minimum stroke width for visibility
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      cursor: isEraseMode ? "pointer" : "default",
                      pointerEvents: isEraseMode ? "stroke" : "none",
                      opacity:
                        isEraseMode && hoveredDrawing === drawing.id ? 0.7 : 1,
                    }}
                    onMouseEnter={() =>
                      isEraseMode && setHoveredDrawing(drawing.id)
                    }
                    onMouseLeave={() => isEraseMode && setHoveredDrawing(null)}
                    onClick={(e) => handleDrawingClick(drawing.id, e as any)}
                  />
                  {/* Invisible thick line for easier clicking in erase mode */}
                  {isEraseMode && (
                    <polyline
                      points={points}
                      stroke="transparent"
                      strokeWidth={Math.max(drawing.strokeWidth * 0.3, 2)} // Thicker invisible line for easier clicking
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        cursor: "pointer",
                        pointerEvents: "stroke",
                      }}
                      onMouseEnter={() => setHoveredDrawing(drawing.id)}
                      onMouseLeave={() => setHoveredDrawing(null)}
                      onClick={(e) => handleDrawingClick(drawing.id, e as any)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </g>
        ))}
      </svg>
    </Box>
  );
}
