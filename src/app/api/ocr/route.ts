import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDFWithOCR } from '@/utils/ocrUtils'

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, language = 'eng' } = await request.json()

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      )
    }

    // Extract text using OCR
    const results = await extractTextFromPDFWithOCR(pdfUrl, {
      language,
      onProgress: (progress) => {
        // In a real implementation, you might want to use WebSockets
        // or Server-Sent Events to send progress updates to the client
        console.log('OCR Progress:', progress)
      }
    })

    return NextResponse.json({
      success: true,
      results,
      totalPages: results.length,
      averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    })

  } catch (error) {
    console.error('OCR API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process OCR request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'OCR API endpoint',
    supportedLanguages: ['eng', 'vie', 'fra', 'deu', 'spa'],
    methods: ['POST']
  })
}
