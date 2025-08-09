import { apolloClient } from "@/graphql/client";
import {
  UPDATE_PDF_FILE,
  DELETE_PDF_FILE_WITH_STORAGE,
  GET_PDF_FILE_URL,
  SOFT_DELETE_PDF_FILE,
  RESTORE_PDF_FILE,
} from "@/graphql/mutations";
import { GET_USER_PDF_FILES, GET_PDF_FILE_BY_ID } from "@/graphql/queries";
import { supabase } from "@/utils/supabaseClient";

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
 * Upload PDF file using REST API (includes storage and database operations)
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

    console.log("Client-side file details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("filename", file.name);

    onProgress?.(30);

    // Get auth token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Upload file using REST API
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    onProgress?.(80);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const result = await response.json();

    onProgress?.(100);

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return {
      id: result.data.id,
      filename: result.data.filename,
      file_path: result.data.file_path,
      file_size: result.data.file_size,
      upload_date: result.data.upload_date,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Get user's uploaded PDF files using GraphQL only
 */
export async function getUserPDFFiles(userId: string) {
  try {
    const { data: gqlData } = await apolloClient.query({
      query: GET_USER_PDF_FILES,
      variables: {
        userId: userId,
      },
      fetchPolicy: "cache-first", // Use cache if available, otherwise fetch
    });

    return gqlData?.getPDFFiles || [];
  } catch (error) {
    console.error("GraphQL fetch user files error:", error);
    throw new Error(
      `Failed to fetch files: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Soft delete PDF file (move to trash) using GraphQL
 */
export async function softDeletePDFFile(fileId: string, userId: string) {
  try {
    const { data: gqlData } = await apolloClient.mutate({
      mutation: SOFT_DELETE_PDF_FILE,
      variables: {
        id: fileId,
        user_id: userId,
      },
    });

    if (!gqlData?.softDeletePDFFile) {
      throw new Error("Failed to move file to trash");
    }

    return gqlData.softDeletePDFFile;
  } catch (error) {
    console.error("GraphQL soft delete file error:", error);
    throw new Error(
      `Failed to move file to trash: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Restore PDF file from trash using GraphQL
 */
export async function restorePDFFile(fileId: string, userId: string) {
  try {
    const { data: gqlData } = await apolloClient.mutate({
      mutation: RESTORE_PDF_FILE,
      variables: {
        id: fileId,
        user_id: userId,
      },
    });

    if (!gqlData?.restorePDFFile) {
      throw new Error("Failed to restore file");
    }

    return gqlData.restorePDFFile;
  } catch (error) {
    console.error("GraphQL restore file error:", error);
    throw new Error(
      `Failed to restore file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Permanently delete PDF file from storage and database using GraphQL
 */
export async function deletePDFFile(fileId: string, userId: string) {
  try {
    // Delete from both storage and database using GraphQL mutation
    const { data: gqlData } = await apolloClient.mutate({
      mutation: DELETE_PDF_FILE_WITH_STORAGE,
      variables: {
        id: fileId,
        user_id: userId,
      },
    });

    if (!gqlData?.deletePDFFileWithStorage) {
      throw new Error("Failed to delete file");
    }

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
 * Get PDF file download URL using GraphQL with Supabase fallback
 */
export async function getPDFDownloadUrl(filePath: string): Promise<string> {
  try {
    // Try GraphQL first
    const { data: gqlData } = await apolloClient.mutate({
      mutation: GET_PDF_FILE_URL,
      variables: {
        file_path: filePath,
      },
    });

    if (gqlData?.getPDFFileUrl) {
      return gqlData.getPDFFileUrl;
    }

    // Fallback to direct Supabase client
    console.warn("GraphQL failed, using Supabase client fallback");
    return await getPDFDownloadUrlDirect(filePath);
  } catch (error) {
    console.error("GraphQL get download URL error:", error);

    // Fallback to direct Supabase client
    try {
      console.warn("Using Supabase client fallback");
      return await getPDFDownloadUrlDirect(filePath);
    } catch (fallbackError) {
      console.error("Supabase fallback also failed:", fallbackError);
      throw new Error(
        "Failed to get download URL from both GraphQL and Supabase"
      );
    }
  }
}

/**
 * Get PDF file download URL directly from Supabase (fallback method)
 */
export async function getPDFDownloadUrlDirect(
  filePath: string
): Promise<string> {
  try {
    // Clean the file path - remove any leading slashes or bucket name
    let cleanPath = filePath;
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.substring(1);
    }
    // Remove bucket name if it's included in the path
    if (cleanPath.startsWith("pdf-files/")) {
      cleanPath = cleanPath.substring(10);
    }
    if (cleanPath.startsWith("pdf/")) {
      cleanPath = cleanPath.substring(4);
    }

    console.log("Getting signed URL for path:", cleanPath);

    // Create signed URL with 1 hour expiry
    const { data, error } = await supabase.storage
      .from("pdf")
      .createSignedUrl(cleanPath, 3600);

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Storage error: ${error.message}`);
    }

    if (!data?.signedUrl) {
      throw new Error("No signed URL returned from Supabase");
    }

    console.log("Successfully created signed URL");
    return data.signedUrl;
  } catch (error) {
    console.error("Direct Supabase URL generation failed:", error);
    throw error;
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
