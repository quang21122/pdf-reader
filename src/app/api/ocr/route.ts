import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    // OCR processing should be done on the client side due to browser-specific APIs
    // This endpoint serves as a placeholder for future server-side OCR implementation
    return NextResponse.json(
      {
        error:
          "OCR processing must be done on the client side. Please use the client-side OCR utilities.",
        suggestion:
          "Use the extractTextFromPDFWithOCR function from @/utils/ocrUtils in your React components.",
        clientSideOnly: true,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("OCR API Error:", error);
    return NextResponse.json(
      { error: "Failed to process OCR request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "OCR API endpoint",
    supportedLanguages: ["eng", "vie", "fra", "deu", "spa"],
    methods: ["POST"],
  });
}
