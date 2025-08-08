import { gql } from "@apollo/client";

// PDF Files Queries
export const GET_USER_PDF_FILES = gql`
  query GetPDFFiles($userId: UUID!) {
    getPDFFiles(user_id: $userId) {
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

export const GET_PDF_FILE_BY_ID = gql`
  query GetPDFFileById($id: UUID!, $userId: UUID!) {
    getPDFFile(id: $id, user_id: $userId) {
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

// Notes Queries
export const GET_NOTES_BY_FILE = gql`
  query GetNotesByFile($fileId: String!, $userId: String!) {
    notes(
      where: { file_id: { _eq: $fileId }, user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      content
      page_number
      position_x
      position_y
      created_at
      updated_at
    }
  }
`;

export const GET_NOTE_BY_ID = gql`
  query GetNoteById($id: String!, $userId: String!) {
    notes(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
      id
      content
      page_number
      position_x
      position_y
      file_id
      created_at
      updated_at
    }
  }
`;

// Highlights Queries
export const GET_HIGHLIGHTS_BY_FILE = gql`
  query GetHighlightsByFile($fileId: String!, $userId: String!) {
    highlights(
      where: { file_id: { _eq: $fileId }, user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      page_number
      text_content
      position_data
      color
      created_at
      updated_at
    }
  }
`;

export const GET_HIGHLIGHT_BY_ID = gql`
  query GetHighlightById($id: String!, $userId: String!) {
    highlights(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
      id
      page_number
      text_content
      position_data
      color
      file_id
      created_at
      updated_at
    }
  }
`;

// OCR Results Queries
export const GET_OCR_RESULTS_BY_FILE = gql`
  query GetOCRResultsByFile($fileId: String!) {
    ocr_results(
      where: { file_id: { _eq: $fileId } }
      order_by: { page_number: asc }
    ) {
      id
      page_number
      extracted_text
      confidence_score
      created_at
      updated_at
    }
  }
`;

export const GET_OCR_RESULT_BY_PAGE = gql`
  query GetOCRResultByPage($fileId: String!, $pageNumber: Int!) {
    ocr_results(
      where: { file_id: { _eq: $fileId }, page_number: { _eq: $pageNumber } }
    ) {
      id
      page_number
      extracted_text
      confidence_score
      created_at
      updated_at
    }
  }
`;

// Search Queries
export const SEARCH_IN_FILES = gql`
  query SearchInFiles($userId: String!, $searchTerm: String!) {
    pdf_files(where: { user_id: { _eq: $userId } }) {
      id
      filename
      file_path
      notes(where: { content: { _ilike: $searchTerm } }) {
        id
        content
        page_number
      }
      ocr_results(where: { extracted_text: { _ilike: $searchTerm } }) {
        id
        page_number
        extracted_text
      }
    }
  }
`;

// Dashboard/Statistics Queries
export const GET_USER_STATS = gql`
  query GetUserStats($userId: String!) {
    pdf_files_aggregate(where: { user_id: { _eq: $userId } }) {
      aggregate {
        count
      }
    }
    notes_aggregate(where: { user_id: { _eq: $userId } }) {
      aggregate {
        count
      }
    }
    highlights_aggregate(where: { user_id: { _eq: $userId } }) {
      aggregate {
        count
      }
    }
  }
`;
