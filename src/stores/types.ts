// Common types for Zustand stores

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface PDFFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  user_id: string;
  status: "uploading" | "uploaded" | "processing" | "ready" | "error";
  ocr_status?: "pending" | "processing" | "completed" | "failed";
  ocr_text?: string;
  page_count?: number;
}

export interface OCRResult {
  id: string;
  file_id: string;
  page_number: number;
  text: string;
  confidence: number;
  processing_time: number;
  created_at: string;
}

export interface OCRProgress {
  file_id: string;
  total_pages: number;
  processed_pages: number;
  current_page: number;
  status: "idle" | "processing" | "completed" | "error";
  error?: string;
  start_time?: number;
  estimated_time_remaining?: number;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
  persistent?: boolean;
  read?: boolean;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  ocr_language: string;
  auto_ocr: boolean;
  notifications_enabled: boolean;
  max_file_size: number;
  pdf_viewer_zoom: number;
  pdf_viewer_fit_mode: "width" | "height" | "page";
}

export interface UIState {
  sidebar_open: boolean;
  loading_states: Record<string, boolean>;
  modal_states: Record<string, boolean>;
  current_page: string;
  breadcrumbs: Array<{ label: string; path: string }>;
}
