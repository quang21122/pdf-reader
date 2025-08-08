import { gql } from "@apollo/client";

// PDF Files Mutations
export const INSERT_PDF_FILE = gql`
  mutation InsertPDFFile($object: PDFFileInput!) {
    insertPDFFile(object: $object) {
      id
      user_id
      filename
      file_path
      file_size
      upload_date
      public_url
      description
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PDF_FILE = gql`
  mutation UpdatePDFFile($id: UUID!, $changes: PDFFileUpdateInput!) {
    updatePDFFile(id: $id, changes: $changes) {
      id
      user_id
      filename
      file_path
      file_size
      upload_date
      public_url
      description
      created_at
      updated_at
    }
  }
`;

export const DELETE_PDF_FILE = gql`
  mutation DeletePDFFile($id: UUID!) {
    deletePDFFile(id: $id) {
      id
      filename
    }
  }
`;

// File Upload with Storage Operations
export const UPLOAD_PDF_FILE = gql`
  mutation UploadPDFFile($input: FileUploadInput!) {
    uploadPDFFile(input: $input) {
      id
      user_id
      filename
      file_path
      file_size
      upload_date
      public_url
      description
      created_at
      updated_at
    }
  }
`;

export const DELETE_PDF_FILE_WITH_STORAGE = gql`
  mutation DeletePDFFileWithStorage($id: UUID!, $user_id: UUID!) {
    deletePDFFileWithStorage(id: $id, user_id: $user_id) {
      id
      filename
      file_path
    }
  }
`;

export const GET_PDF_FILE_URL = gql`
  mutation GetPDFFileUrl($file_path: String!) {
    getPDFFileUrl(file_path: $file_path)
  }
`;

// Notes Mutations
export const INSERT_NOTE = gql`
  mutation InsertNote($object: notes_insert_input!) {
    insert_notes_one(object: $object) {
      id
      content
      page_number
      position_x
      position_y
      created_at
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: String!, $changes: notes_set_input!) {
    update_notes_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      content
      page_number
      position_x
      position_y
      updated_at
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    delete_notes_by_pk(id: $id) {
      id
      content
    }
  }
`;

// Highlights Mutations
export const INSERT_HIGHLIGHT = gql`
  mutation InsertHighlight($object: highlights_insert_input!) {
    insert_highlights_one(object: $object) {
      id
      page_number
      text_content
      position_data
      color
      created_at
    }
  }
`;

export const UPDATE_HIGHLIGHT = gql`
  mutation UpdateHighlight($id: String!, $changes: highlights_set_input!) {
    update_highlights_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      page_number
      text_content
      position_data
      color
      updated_at
    }
  }
`;

export const DELETE_HIGHLIGHT = gql`
  mutation DeleteHighlight($id: String!) {
    delete_highlights_by_pk(id: $id) {
      id
      text_content
    }
  }
`;

// OCR Results Mutations
export const INSERT_OCR_RESULT = gql`
  mutation InsertOCRResult($object: ocr_results_insert_input!) {
    insert_ocr_results_one(object: $object) {
      id
      page_number
      extracted_text
      confidence_score
      created_at
    }
  }
`;

export const INSERT_MULTIPLE_OCR_RESULTS = gql`
  mutation InsertMultipleOCRResults($objects: [ocr_results_insert_input!]!) {
    insert_ocr_results(objects: $objects) {
      affected_rows
      returning {
        id
        page_number
        extracted_text
        confidence_score
      }
    }
  }
`;

export const UPDATE_OCR_RESULT = gql`
  mutation UpdateOCRResult($id: String!, $changes: ocr_results_set_input!) {
    update_ocr_results_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      page_number
      extracted_text
      confidence_score
      updated_at
    }
  }
`;

export const DELETE_OCR_RESULT = gql`
  mutation DeleteOCRResult($id: String!) {
    delete_ocr_results_by_pk(id: $id) {
      id
      page_number
    }
  }
`;

// Batch Operations
export const DELETE_FILE_AND_RELATED_DATA = gql`
  mutation DeleteFileAndRelatedData($fileId: String!) {
    delete_ocr_results(where: { file_id: { _eq: $fileId } }) {
      affected_rows
    }
    delete_highlights(where: { file_id: { _eq: $fileId } }) {
      affected_rows
    }
    delete_notes(where: { file_id: { _eq: $fileId } }) {
      affected_rows
    }
    delete_pdf_files_by_pk(id: $fileId) {
      id
      filename
    }
  }
`;
