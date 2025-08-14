import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pdfUrl = body?.pdfUrl;

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "OCR processing is handled client-side for privacy and performance",
        clientSideOnly: true,
        instructions: {
          component:
            "Use the OCRProcessor component from @/components/ocr/OCRProcessor",
          function: "Use extractTextFromPDFWithOCR from @/utils/ocrUtils",
        },
        supportedLanguages: [
          { code: "eng", name: "English" },
          { code: "vie", name: "Vietnamese" },
          { code: "fra", name: "French" },
          { code: "deu", name: "German" },
          { code: "spa", name: "Spanish" },
          { code: "chi_sim", name: "Chinese (Simplified)" },
          { code: "jpn", name: "Japanese" },
          { code: "kor", name: "Korean" },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OCR API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "OCR API Information Endpoint",
    description:
      "This endpoint provides information about client-side OCR capabilities",
    clientSideOnly: true,
    supportedLanguages: [
      "English (eng)",
      "Vietnamese (vie)",
      "French (fra)",
      "German (deu)",
      "Spanish (spa)",
      "Chinese Simplified (chi_sim)",
      "Japanese (jpn)",
      "Korean (kor)",
    ],
    usage: {
      component: "Import OCRProcessor from @/components/ocr/OCRProcessor",
      function: "Import extractTextFromPDFWithOCR from @/utils/ocrUtils",
    },
    methods: ["GET", "POST"],
  });
}
