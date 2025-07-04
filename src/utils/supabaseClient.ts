import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface PDFFile {
  id: string
  user_id: string
  filename: string
  file_path: string
  file_size: number
  upload_date: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  file_id: string
  content: string
  page_number: number
  position_x?: number
  position_y?: number
  created_at: string
  updated_at: string
}

export interface Highlight {
  id: string
  user_id: string
  file_id: string
  page_number: number
  text_content: string
  position_data: any // JSON data for highlight position
  color: string
  created_at: string
  updated_at: string
}

export interface OCRResult {
  id: string
  file_id: string
  page_number: number
  extracted_text: string
  confidence_score?: number
  created_at: string
  updated_at: string
}
