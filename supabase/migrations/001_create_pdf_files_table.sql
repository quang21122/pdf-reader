-- Create pdf_files table
CREATE TABLE IF NOT EXISTS pdf_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    public_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdf_files_user_id ON pdf_files(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_files_upload_date ON pdf_files(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_files_filename ON pdf_files(filename);

-- Enable Row Level Security (RLS)
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own files
CREATE POLICY "Users can view their own files" ON pdf_files
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own files
CREATE POLICY "Users can insert their own files" ON pdf_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own files
CREATE POLICY "Users can update their own files" ON pdf_files
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own files
CREATE POLICY "Users can delete their own files" ON pdf_files
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pdf_files_updated_at
    BEFORE UPDATE ON pdf_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for PDF files (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf', 'pdf', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
-- Users can upload files to their own folder
CREATE POLICY "Users can upload files to their own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'pdf' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can view files in their own folder
CREATE POLICY "Users can view files in their own folder" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'pdf' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update files in their own folder
CREATE POLICY "Users can update files in their own folder" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'pdf' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete files in their own folder
CREATE POLICY "Users can delete files in their own folder" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'pdf' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create OCR results table for storing OCR processing results
CREATE TABLE IF NOT EXISTS ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES pdf_files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    extracted_text TEXT,
    confidence DECIMAL(5,2),
    language VARCHAR(10) DEFAULT 'eng',
    processing_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for OCR results
CREATE INDEX IF NOT EXISTS idx_ocr_results_file_id ON ocr_results(file_id);
CREATE INDEX IF NOT EXISTS idx_ocr_results_user_id ON ocr_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_results_page_number ON ocr_results(page_number);

-- Enable RLS for OCR results
ALTER TABLE ocr_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for OCR results
CREATE POLICY "Users can view their own OCR results" ON ocr_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OCR results" ON ocr_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OCR results" ON ocr_results
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OCR results" ON ocr_results
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for OCR results updated_at
CREATE TRIGGER update_ocr_results_updated_at
    BEFORE UPDATE ON ocr_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create notes table for PDF annotations
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES pdf_files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    position_x DECIMAL(10,6),
    position_y DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_file_id ON notes(file_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_page_number ON notes(page_number);

-- Enable RLS for notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notes
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for notes updated_at
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
