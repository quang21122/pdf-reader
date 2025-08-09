import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar UUID

  type PDFFile {
    id: UUID!
    user_id: UUID!
    filename: String!
    file_path: String!
    file_size: Int!
    upload_date: DateTime!
    public_url: String
    description: String
    created_at: DateTime!
    updated_at: DateTime!
  }

  type OCRResult {
    id: UUID!
    file_id: UUID!
    user_id: UUID!
    page_number: Int!
    extracted_text: String
    confidence: Float
    language: String
    processing_date: DateTime!
    created_at: DateTime!
    updated_at: DateTime!
  }

  type Note {
    id: UUID!
    file_id: UUID!
    user_id: UUID!
    page_number: Int!
    content: String!
    position_x: Float
    position_y: Float
    created_at: DateTime!
    updated_at: DateTime!
  }

  input PDFFileInput {
    id: UUID!
    user_id: UUID!
    filename: String!
    file_path: String!
    file_size: Int!
    upload_date: DateTime!
    public_url: String
    description: String
  }

  input PDFFileUpdateInput {
    filename: String
    description: String
  }

  input OCRResultInput {
    file_id: UUID!
    user_id: UUID!
    page_number: Int!
    extracted_text: String
    confidence: Float
    language: String
  }

  input NoteInput {
    file_id: UUID!
    user_id: UUID!
    page_number: Int!
    content: String!
    position_x: Float
    position_y: Float
  }

  type Query {
    # PDF Files
    getPDFFiles(user_id: UUID!): [PDFFile!]!
    getPDFFile(id: UUID!, user_id: UUID!): PDFFile

    # OCR Results
    getOCRResults(file_id: UUID!, user_id: UUID!): [OCRResult!]!
    getOCRResult(id: UUID!, user_id: UUID!): OCRResult

    # Notes
    getNotes(file_id: UUID!, user_id: UUID!): [Note!]!
    getNote(id: UUID!, user_id: UUID!): Note
  }

  type Mutation {
    # PDF Files
    insertPDFFile(object: PDFFileInput!): PDFFile!
    updatePDFFile(id: UUID!, changes: PDFFileUpdateInput!): PDFFile!
    deletePDFFile(id: UUID!): PDFFile!

    # File Storage Operations (no upload via GraphQL)
    deletePDFFileWithStorage(id: UUID!, user_id: UUID!): PDFFile!
    getPDFFileUrl(file_path: String!): String!

    # OCR Results
    insertOCRResult(object: OCRResultInput!): OCRResult!
    insertOCRResults(objects: [OCRResultInput!]!): [OCRResult!]!
    updateOCRResult(id: UUID!, changes: OCRResultInput!): OCRResult!
    deleteOCRResult(id: UUID!): OCRResult!
    deleteOCRResults(file_id: UUID!): [OCRResult!]!

    # Notes
    insertNote(object: NoteInput!): Note!
    updateNote(id: UUID!, changes: NoteInput!): Note!
    deleteNote(id: UUID!): Note!
    deleteNotes(file_id: UUID!): [Note!]!
  }
`;
