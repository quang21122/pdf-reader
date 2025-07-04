// Client-only PDF utilities - DO NOT IMPORT ON SERVER SIDE
"use client";

/**
 * Convert PDF pages to images for OCR processing - CLIENT SIDE ONLY
 */
export async function pdfToImages(
  pdfUrl: string,
  scale: number = 2
): Promise<string[]> {
  // Ensure we're in a browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error(
      "pdfToImages can only be used in a browser environment."
    );
  }

  try {
    // Dynamic import to avoid server-side issues
    const pdfjsLib = await import("pdfjs-dist");

    // Configure PDF.js worker for client-side
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const images: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

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
    }

    return images;
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw error;
  }
}

/**
 * Extract text content from PDF file - CLIENT SIDE ONLY
 */
export async function extractTextFromPDF(pdfUrl: string): Promise<string[]> {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error(
      "extractTextFromPDF can only be used in a browser environment."
    );
  }

  try {
    // Dynamic import to avoid server-side issues
    const pdfjsLib = await import("pdfjs-dist");

    // Configure PDF.js worker for client-side
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const textPages: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      textPages.push(pageText);
    }

    return textPages;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

/**
 * Get PDF metadata - CLIENT SIDE ONLY
 */
export async function getPDFMetadata(pdfUrl: string) {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error(
      "getPDFMetadata can only be used in a browser environment."
    );
  }

  try {
    // Dynamic import to avoid server-side issues
    const pdfjsLib = await import("pdfjs-dist");

    // Configure PDF.js worker for client-side
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const metadata = await pdf.getMetadata();

    return {
      numPages: pdf.numPages,
      info: metadata.info,
      metadata: metadata.metadata,
    };
  } catch (error) {
    console.error("Error getting PDF metadata:", error);
    throw error;
  }
}

/**
 * Search text in PDF pages - CLIENT SIDE ONLY
 */
export async function searchInPDF(
  pdfUrl: string,
  searchTerm: string
): Promise<
  Array<{
    pageNumber: number;
    matches: Array<{ text: string; index: number }>;
  }>
> {
  try {
    const textPages = await extractTextFromPDF(pdfUrl);
    const results: Array<{
      pageNumber: number;
      matches: Array<{ text: string; index: number }>;
    }> = [];

    textPages.forEach((pageText, index) => {
      const regex = new RegExp(searchTerm, "gi");
      const matches: Array<{ text: string; index: number }> = [];
      let match;

      while ((match = regex.exec(pageText)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
        });
      }

      if (matches.length > 0) {
        results.push({
          pageNumber: index + 1,
          matches,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Error searching in PDF:", error);
    throw error;
  }
}
