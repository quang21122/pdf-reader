import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface TextAnnotation {
  id: string;
  pageNumber: number;
  text: string;
  position: {
    x: number;
    y: number;
  };
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface Highlight {
  id: string;
  pageNumber: number;
  text: string;
  boundingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
}

interface Drawing {
  id: string;
  pageNumber: number;
  paths: {
    x: number;
    y: number;
  }[][];
  color: string;
  strokeWidth: number;
}

export async function modifyPDFWithAnnotations(
  pdfBytes: ArrayBuffer,
  textAnnotations: TextAnnotation[],
  highlights: Highlight[],
  drawings: Drawing[] = []
): Promise<Uint8Array> {
  try {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Embed standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper function to convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return rgb(0, 0, 0);

      return rgb(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      );
    };

    // Add highlights first (so they appear behind text)
    highlights.forEach((highlight) => {
      const pageIndex = highlight.pageNumber - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Convert percentage positions to actual coordinates
        const x = (highlight.boundingRect.x / 100) * pageWidth;
        const y =
          pageHeight -
          (highlight.boundingRect.y / 100) * pageHeight -
          (highlight.boundingRect.height / 100) * pageHeight;
        const width = (highlight.boundingRect.width / 100) * pageWidth;
        const height = (highlight.boundingRect.height / 100) * pageHeight;

        // Draw highlight rectangle
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: hexToRgb(highlight.color),
          opacity: 0.3,
        });
      }
    });

    // Add text annotations
    textAnnotations.forEach((annotation) => {
      const pageIndex = annotation.pageNumber - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Convert percentage positions to actual coordinates
        // Note: PDF coordinate system has origin at bottom-left, so we need to flip Y
        const x = (annotation.position.x / 100) * pageWidth;
        const y = pageHeight - (annotation.position.y / 100) * pageHeight;

        // Choose font based on fontFamily
        const selectedFont = annotation.fontFamily
          .toLowerCase()
          .includes("bold")
          ? boldFont
          : font;

        // Draw text
        page.drawText(annotation.text, {
          x,
          y,
          size: annotation.fontSize,
          font: selectedFont,
          color: hexToRgb(annotation.color),
        });
      }
    });

    // Add drawings
    drawings.forEach((drawing) => {
      const pageIndex = drawing.pageNumber - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Draw each path in the drawing
        drawing.paths.forEach((path) => {
          if (path.length < 2) return; // Need at least 2 points to draw a line

          // Start the path
          const startPoint = path[0];
          const startX = (startPoint.x / 100) * pageWidth;
          const startY = pageHeight - (startPoint.y / 100) * pageHeight;

          // Draw lines connecting all points in the path
          for (let i = 1; i < path.length; i++) {
            const prevPoint = path[i - 1];
            const currentPoint = path[i];

            const prevX = (prevPoint.x / 100) * pageWidth;
            const prevY = pageHeight - (prevPoint.y / 100) * pageHeight;
            const currentX = (currentPoint.x / 100) * pageWidth;
            const currentY = pageHeight - (currentPoint.y / 100) * pageHeight;

            // Draw line from previous point to current point
            page.drawLine({
              start: { x: prevX, y: prevY },
              end: { x: currentX, y: currentY },
              thickness: drawing.strokeWidth,
              color: hexToRgb(drawing.color),
            });
          }
        });
      }
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error("Error modifying PDF:", error);
    throw new Error("Failed to modify PDF with annotations");
  }
}

export async function downloadModifiedPDF(
  originalPdfUrl: string,
  textAnnotations: TextAnnotation[],
  highlights: Highlight[],
  drawings: Drawing[] = [],
  filename: string = "modified-document.pdf"
): Promise<void> {
  try {
    // Fetch the original PDF
    const response = await fetch(originalPdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch original PDF");
    }

    const pdfBytes = await response.arrayBuffer();

    // Modify the PDF with annotations
    const modifiedPdfBytes = await modifyPDFWithAnnotations(
      pdfBytes,
      textAnnotations,
      highlights,
      drawings
    );

    // Create blob and download
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading modified PDF:", error);
    throw error;
  }
}

export async function saveModifiedPDFToSupabase(
  originalPdfUrl: string,
  textAnnotations: TextAnnotation[],
  highlights: Highlight[],
  drawings: Drawing[],
  fileId: string,
  filename: string
): Promise<string> {
  try {
    // Fetch the original PDF
    const response = await fetch(originalPdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch original PDF");
    }

    const pdfBytes = await response.arrayBuffer();

    // Modify the PDF with annotations
    const modifiedPdfBytes = await modifyPDFWithAnnotations(
      pdfBytes,
      textAnnotations,
      highlights,
      drawings
    );

    // Convert to base64 for API transmission
    const base64Pdf = Buffer.from(modifiedPdfBytes).toString("base64");

    // Call our API route to save the PDF
    const saveResponse = await fetch("/api/pdf/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId,
        pdfBytes: base64Pdf,
        filename,
        originalUrl: originalPdfUrl,
      }),
    });

    if (!saveResponse.ok) {
      const errorData = await saveResponse.json();
      throw new Error(errorData.error || "Failed to save PDF");
    }

    const result = await saveResponse.json();

    console.log("Successfully updated PDF:", {
      fileId,
      filename,
      size: modifiedPdfBytes.length,
      message: result.message,
    });

    // Return the same URL (file has been updated in place)
    return originalPdfUrl;
  } catch (error) {
    console.error("Error saving modified PDF:", error);
    throw error;
  }
}
