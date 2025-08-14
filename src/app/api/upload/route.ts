import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";


function getAuthenticatedSupabaseClient(token?: string) {
  if (!token) {
    return supabase;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const authenticatedSupabase = getAuthenticatedSupabaseClient(token);

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const user_id = formData.get("user_id") as string;
    const filename = formData.get("filename") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const isValidPDF =
      file.type === "application/pdf" ||
      filename.toLowerCase().endsWith(".pdf");

    if (!isValidPDF) {
      return NextResponse.json(
        { 
          error: `Invalid file type. Expected PDF, got: ${file.type || "unknown"}` 
        },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 50MB" },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const fileExtension = "pdf";
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${user_id}/${fileName}`;

    const { error: uploadError } = await authenticatedSupabase.storage
      .from("pdf")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = authenticatedSupabase.storage
      .from("pdf")
      .getPublicUrl(filePath);

    const fileMetadata = {
      id: fileId,
      user_id: user_id,
      filename: filename,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString(),
      public_url: urlData.publicUrl,
    };

    const { data, error } = await authenticatedSupabase
      .from("pdf_files")
      .insert([fileMetadata])
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      await authenticatedSupabase.storage.from("pdf").remove([filePath]);
      return NextResponse.json(
        { error: `Failed to save file metadata: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        filename: data.filename,
        file_path: data.file_path,
        file_size: data.file_size,
        upload_date: data.upload_date,
      },
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { 
        error: `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }` 
      },
      { status: 500 }
    );
  }
}
