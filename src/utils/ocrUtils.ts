import Tesseract from "tesseract.js";

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
 * Extract text from PDF using OCR
 */
export async function extractTextFromPDFWithOCR(
  pdfUrl: string,
  options: {
    language?: string;
    onProgress?: (progress: OCRProgress) => void;
  } = {}
): Promise<OCRResult[]> {
  const { language = "eng", onProgress } = options;

  try {
    // Convert PDF to images
    onProgress?.({ status: "Converting PDF to images...", progress: 0 });

    // Dynamically import pdfToImages to avoid server-side issues
    const { pdfToImages } = await import("./pdfUtils");
    const images = await pdfToImages(pdfUrl);

    const results: OCRResult[] = [];
    const totalPages = images.length;

    for (let i = 0; i < images.length; i++) {
      const pageNumber = i + 1;

      onProgress?.({
        status: `Processing page ${pageNumber} of ${totalPages}...`,
        progress: (i / totalPages) * 100,
      });

      const { data } = await Tesseract.recognize(images[i], language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            onProgress?.({
              status: `OCR processing page ${pageNumber}...`,
              progress: ((i + m.progress) / totalPages) * 100,
            });
          }
        },
      });

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

    onProgress?.({ status: "OCR completed!", progress: 100 });
    return results;
  } catch (error) {
    console.error("Error in OCR processing:", error);
    throw error;
  }
}

/**
 * Extract text from a single image
 */
export async function extractTextFromImage(
  imageUrl: string,
  options: {
    language?: string;
    onProgress?: (progress: OCRProgress) => void;
  } = {}
): Promise<OCRResult> {
  const { language = "eng", onProgress } = options;

  try {
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
