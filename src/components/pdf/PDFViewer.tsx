'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

interface PDFViewerProps {
  fileUrl?: string
  fileId?: string
}

export default function PDFViewer({ fileUrl, fileId }: PDFViewerProps) {
  return (
    <Box className="pdf-viewer-container">
      <Typography variant="h6" className="p-4">
        PDF Viewer Component
      </Typography>
      <Typography variant="body2" className="px-4 text-gray-600">
        File URL: {fileUrl || 'No file selected'}
      </Typography>
      <Typography variant="body2" className="px-4 text-gray-600">
        File ID: {fileId || 'No file ID'}
      </Typography>
      {/* PDF viewer implementation will be added later */}
    </Box>
  )
}
