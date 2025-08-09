-- Add soft delete functionality to pdf_files table
ALTER TABLE pdf_files ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for deleted_at column for better performance
CREATE INDEX IF NOT EXISTS idx_pdf_files_deleted_at ON pdf_files(deleted_at);

-- Update RLS policies to exclude soft deleted files from normal queries
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own files" ON pdf_files;
DROP POLICY IF EXISTS "Users can insert their own files" ON pdf_files;
DROP POLICY IF EXISTS "Users can update their own files" ON pdf_files;
DROP POLICY IF EXISTS "Users can delete their own files" ON pdf_files;

-- Create new policies that exclude soft deleted files
-- Users can only see their own non-deleted files
CREATE POLICY "Users can view their own non-deleted files" ON pdf_files
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can view their own deleted files (for trash functionality)
CREATE POLICY "Users can view their own deleted files" ON pdf_files
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Users can only insert their own files
CREATE POLICY "Users can insert their own files" ON pdf_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own files (including soft delete/restore)
CREATE POLICY "Users can update their own files" ON pdf_files
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only hard delete their own files (for permanent deletion)
CREATE POLICY "Users can delete their own files" ON pdf_files
    FOR DELETE USING (auth.uid() = user_id);

-- Add soft delete functionality to ocr_results table
ALTER TABLE ocr_results ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_ocr_results_deleted_at ON ocr_results(deleted_at);

-- Update OCR results policies
DROP POLICY IF EXISTS "Users can view their own OCR results" ON ocr_results;
CREATE POLICY "Users can view their own non-deleted OCR results" ON ocr_results
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Add soft delete functionality to notes table
ALTER TABLE notes ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_deleted_at ON notes(deleted_at);

-- Update notes policies
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
CREATE POLICY "Users can view their own non-deleted notes" ON notes
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
