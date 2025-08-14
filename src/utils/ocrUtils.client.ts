// Client-only OCR utilities - DO NOT IMPORT ON SERVER SIDE
"use client";

export interface OCRProgress {
  status: string;
  progress: number;
  userJobId?: string;
}

export interface OCRResult {
  pageNumber: number;
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

/**
 * Extract text from file using OCR - CLIENT SIDE ONLY
 * Supports both PDF and image files
 */
export async function extractTextFromPDFWithOCR(
  fileUrl: string,
  options: {
    language?: string;
    onProgress?: (progress: OCRProgress) => void;
  } = {}
): Promise<OCRResult[]> {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in a browser environment");
  }

  const { language = "eng", onProgress } = options;

  try {
    console.log("OCR: Starting OCR process");
    console.log("OCR: File URL:", fileUrl);
    console.log("OCR: Language:", language);

    // Import Tesseract
    console.log("OCR: Importing Tesseract.js...");
    const { default: Tesseract } = await import("tesseract.js");
    console.log("OCR: Tesseract.js imported successfully");

    // Detect file type
    const isImage = await isImageFile(fileUrl);
    console.log("OCR: File type detected:", isImage ? "Image" : "PDF");

    let images: string[];

    if (isImage) {
      // Direct image processing
      console.log("OCR: Processing image directly");
      onProgress?.({ status: "Preparing image for OCR...", progress: 10 });
      images = [fileUrl];
    } else {
      // PDF to images conversion
      console.log("OCR: Converting PDF to images...");
      onProgress?.({ status: "Converting PDF to images...", progress: 10 });

      try {
        images = await convertPDFToImages(fileUrl);
        console.log("OCR: PDF converted to", images.length, "images");
      } catch (pdfError) {
        console.error("PDF conversion failed:", pdfError);
        throw new Error(
          "Cannot process PDF file. Please try uploading an image file (PNG, JPG) instead, or use a different PDF file."
        );
      }
    }

    const results: OCRResult[] = [];
    const totalPages = images.length;

    for (let i = 0; i < images.length; i++) {
      const pageNumber = i + 1;
      console.log(`OCR: Processing page ${pageNumber}/${totalPages}`);

      onProgress?.({
        status: `Processing page ${pageNumber} of ${totalPages}...`,
        progress: 10 + (i / totalPages) * 80,
      });

      const { data } = await Tesseract.recognize(images[i], language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pageProgress = 10 + ((i + m.progress) / totalPages) * 80;
            onProgress?.({
              status: `OCR processing page ${pageNumber}...`,
              progress: pageProgress,
            });
          }
        },
      });

      console.log(
        `OCR: Page ${pageNumber} completed, confidence: ${data.confidence}`
      );

      results.push({
        pageNumber,
        text: data.text,
        confidence: data.confidence,
        words: data.blocks?.flatMap((block) =>
          block.paragraphs.flatMap((paragraph) =>
            paragraph.lines.flatMap((line) =>
              line.words.map((word) => ({
                text: word.text,
                confidence: word.confidence,
                bbox: word.bbox,
              }))
            )
          )
        ),
      });
    }

    console.log("OCR: All pages completed successfully");
    onProgress?.({ status: "OCR completed!", progress: 100 });
    return results;
  } catch (error) {
    console.error("Error in OCR processing:", error);
    throw error;
  }
}

/**
 * Detect if file is an image based on URL or content
 */
async function isImageFile(fileUrl: string): Promise<boolean> {
  try {
    // Check by URL extension first
    const url = new URL(fileUrl);
    const pathname = url.pathname.toLowerCase();
    if (
      pathname.includes(".png") ||
      pathname.includes(".jpg") ||
      pathname.includes(".jpeg")
    ) {
      return true;
    }

    // Check by blob URL content type
    if (fileUrl.startsWith("blob:")) {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      return blob.type.startsWith("image/");
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Convert PDF to images using react-pdf (simpler, no worker issues)
 */
async function convertPDFToImages(pdfUrl: string): Promise<string[]> {
  console.log("PDF: Starting conversion with react-pdf");

  try {
    // Import PDF.js directly
    const pdfjsLib = await import("pdfjs-dist");

    // Set up worker source using local file
    console.log("PDF: Setting up local worker source");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      console.log("PDF: Worker source set to local file");
    }

    // Fetch PDF as blob first
    console.log("PDF: Fetching PDF file...");
    const response = await fetch(pdfUrl);
    const pdfBlob = await response.blob();
    const pdfArrayBuffer = await pdfBlob.arrayBuffer();

    console.log("PDF: PDF file loaded as array buffer");

    // Load PDF with PDF.js
    const pdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
    console.log("PDF: Document loaded, pages:", pdf.numPages);

    const images: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`PDF: Rendering page ${pageNum}/${pdf.numPages}`);

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      const imageDataUrl = canvas.toDataURL("image/png");
      images.push(imageDataUrl);

      console.log(`PDF: Page ${pageNum} rendered successfully`);
    }

    console.log("PDF: All pages converted to images");
    return images;
  } catch (error) {
    console.error("PDF conversion error:", error);
    throw new Error(`Failed to convert PDF to images: ${error}`);
  }
}

/**
 * Extract text from a single image - CLIENT SIDE ONLY
 */
export async function extractTextFromImage(
  imageUrl: string,
  options: {
    language?: string;
    onProgress?: (progress: OCRProgress) => void;
  } = {}
): Promise<OCRResult> {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in a browser environment");
  }

  const { language = "eng", onProgress } = options;

  try {
    const { default: Tesseract } = await import("tesseract.js");

    const { data } = await Tesseract.recognize(imageUrl, language, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          onProgress?.({
            status: "Processing image...",
            progress: m.progress * 100,
          });
        }
      },
    });

    return {
      pageNumber: 1,
      text: data.text,
      confidence: data.confidence,
      words: data.blocks?.flatMap((block) =>
        block.paragraphs.flatMap((paragraph) =>
          paragraph.lines.flatMap((line) =>
            line.words.map((word) => ({
              text: word.text,
              confidence: word.confidence,
              bbox: word.bbox,
            }))
          )
        )
      ),
    };
  } catch (error) {
    console.error("Error in image OCR processing:", error);
    throw error;
  }
}

/**
 * Search text in OCR results
 */
export function searchInOCRResults(
  ocrResults: OCRResult[],
  searchTerm: string
): Array<{
  pageNumber: number;
  matches: Array<{
    text: string;
    index: number;
    confidence: number;
    bbox?: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}> {
  const results: Array<{
    pageNumber: number;
    matches: Array<{
      text: string;
      index: number;
      confidence: number;
      bbox?: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
      };
    }>;
  }> = [];

  ocrResults.forEach((result) => {
    const regex = new RegExp(searchTerm, "gi");
    const matches: Array<{
      text: string;
      index: number;
      confidence: number;
      bbox?: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
      };
    }> = [];

    let match;
    while ((match = regex.exec(result.text)) !== null) {
      // Find corresponding word for bbox information
      const matchedWord = result.words?.find((word) =>
        word.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

      matches.push({
        text: match[0],
        index: match.index,
        confidence: matchedWord?.confidence || result.confidence,
        bbox: matchedWord?.bbox,
      });
    }

    if (matches.length > 0) {
      results.push({
        pageNumber: result.pageNumber,
        matches,
      });
    }
  });

  return results;
}

/**
 * Get OCR confidence statistics
 */
export function getOCRStats(ocrResults: OCRResult[]) {
  const totalPages = ocrResults.length;
  const totalConfidence = ocrResults.reduce(
    (sum, result) => sum + result.confidence,
    0
  );
  const averageConfidence = totalConfidence / totalPages;

  const lowConfidencePages = ocrResults.filter(
    (result) => result.confidence < 70
  );
  const highConfidencePages = ocrResults.filter(
    (result) => result.confidence >= 90
  );

  return {
    totalPages,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    lowConfidencePages: lowConfidencePages.length,
    highConfidencePages: highConfidencePages.length,
    confidenceDistribution: {
      excellent: ocrResults.filter((r) => r.confidence >= 95).length,
      good: ocrResults.filter((r) => r.confidence >= 85 && r.confidence < 95)
        .length,
      fair: ocrResults.filter((r) => r.confidence >= 70 && r.confidence < 85)
        .length,
      poor: ocrResults.filter((r) => r.confidence < 70).length,
    },
  };
}
