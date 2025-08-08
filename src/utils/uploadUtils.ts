import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "@/graphql/client";
import {
  INSERT_PDF_FILE,
  UPDATE_PDF_FILE,
  DELETE_PDF_FILE,
} from "@/graphql/mutations";
import { GET_USER_PDF_FILES, GET_PDF_FILE_BY_ID } from "@/graphql/queries";
import type { FetchPolicy } from "@apollo/client";

export interface UploadResult {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
}

export interface UploadProgress {
  progress: number;
  status: string;
}

/**
 * Upload PDF file to Supabase Storage and save metadata to database
 */
export async function uploadPDFToSupabase(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // Validate file
    if (!file || file.type !== "application/pdf") {
      throw new Error("Please select a valid PDF file");
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size must be less than 50MB");
    }

    onProgress?.(10);

    // Generate unique file ID and path
    const fileId = uuidv4();
    const fileExtension = "pdf";
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    onProgress?.(20);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("pdf")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    onProgress?.(60);

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("pdf")
      .getPublicUrl(filePath);

    onProgress?.(80);

    // Save file metadata to database using GraphQL
    const fileMetadata = {
      id: fileId,
      user_id: userId,
      filename: file.name,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString(),
      public_url: urlData.publicUrl,
    };

    let dbData;
    try {
      const { data: gqlData } = await apolloClient.mutate({
        mutation: INSERT_PDF_FILE,
        variables: {
          object: fileMetadata,
        },
      });

      if (!gqlData?.insertPDFFile) {
        throw new Error("Failed to insert file metadata");
      }

      dbData = gqlData.insertPDFFile;
    } catch (gqlError) {
      console.error("GraphQL insert error:", gqlError);

      // If database insert fails, clean up the uploaded file
      await supabase.storage.from("pdf").remove([filePath]);

      throw new Error(
        `Failed to save file metadata: ${
          gqlError instanceof Error ? gqlError.message : "Unknown error"
        }`
      );
    }

    onProgress?.(100);

    return {
      id: dbData.id,
      filename: dbData.filename,
      file_path: dbData.file_path,
      file_size: dbData.file_size,
      upload_date: dbData.upload_date,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Get user's uploaded PDF files using GraphQL
 */
export async function getUserPDFFiles(userId: string) {
  try {
    // Try GraphQL first
    try {
      const { data: gqlData } = await apolloClient.query({
        query: GET_USER_PDF_FILES,
        variables: {
          userId: userId,
        },
        fetchPolicy: "cache-and-network" as FetchPolicy, // Always fetch fresh data
      });

      return gqlData?.getPDFFiles || [];
    } catch {
      // Fallback to REST API
      const { data, error } = await supabase
        .from("pdf_files")
        .select("*")
        .eq("user_id", userId)
        .order("upload_date", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch files: ${error.message}`);
      }

      return data || [];
    }
  } catch (error) {
    console.error("Failed to fetch user files:", error);
    throw new Error(
      `Failed to fetch files: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete PDF file from storage and database using GraphQL
 */
export async function deletePDFFile(fileId: string, userId: string) {
  try {
    // First get the file metadata using GraphQL
    const { data: gqlData } = await apolloClient.query({
      query: GET_PDF_FILE_BY_ID,
      variables: {
        id: fileId,
        userId: userId,
      },
    });

    const fileData = gqlData?.getPDFFile;
    if (!fileData) {
      throw new Error("File not found or access denied");
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("pdf")
      .remove([fileData.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database using GraphQL
    await apolloClient.mutate({
      mutation: DELETE_PDF_FILE,
      variables: {
        id: fileId,
      },
    });

    return true;
  } catch (error) {
    console.error("GraphQL delete file error:", error);
    throw new Error(
      `Failed to delete file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get PDF file download URL
 */
export async function getPDFDownloadUrl(filePath: string): Promise<string> {
  try {
    const { data } = supabase.storage.from("pdf").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Get download URL error:", error);
    throw new Error("Failed to get download URL");
  }
}

/**
 * Check if user has access to file using GraphQL
 */
export async function checkFileAccess(
  fileId: string,
  userId: string
): Promise<boolean> {
  try {
    const { data: gqlData } = await apolloClient.query({
      query: GET_PDF_FILE_BY_ID,
      variables: {
        id: fileId,
        userId: userId,
      },
    });

    return !!gqlData?.getPDFFile;
  } catch (error) {
    console.error("GraphQL check file access error:", error);
    return false;
  }
}

/**
 * Update file metadata using GraphQL
 */
export async function updatePDFFileMetadata(
  fileId: string,
  userId: string,
  updates: Partial<{
    filename: string;
    description: string;
  }>
) {
  try {
    const { data: gqlData } = await apolloClient.mutate({
      mutation: UPDATE_PDF_FILE,
      variables: {
        id: fileId,
        changes: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      },
    });

    if (!gqlData?.updatePDFFile) {
      throw new Error("Failed to update file metadata");
    }

    return gqlData.updatePDFFile;
  } catch (error) {
    console.error("GraphQL update file metadata error:", error);
    throw new Error(
      `Failed to update file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
