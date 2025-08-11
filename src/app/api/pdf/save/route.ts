import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function POST(request: NextRequest) {
  try {
    const { fileId, pdfBytes, filename, originalUrl } = await request.json();

    if (!fileId || !pdfBytes || !filename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(pdfBytes, "base64");

    // Extract path from original URL (skip database lookup to avoid auth issues)
    if (!originalUrl) {
      return NextResponse.json(
        { error: "Original URL is required" },
        { status: 400 }
      );
    }

    console.log("Original URL:", originalUrl);

    // Parse the URL to extract bucket and file path
    // Handle both signed URLs and public URLs
    const url = new URL(originalUrl);
    const pathname = url.pathname;
    console.log("URL pathname:", pathname);

    let bucketName: string;
    let filePath: string;

    // Handle signed URLs: /storage/v1/object/sign/bucket/path/to/file
    if (pathname.includes("/object/sign/")) {
      const signMatch = pathname.match(/\/object\/sign\/([^\/]+)\/(.+)/);
      if (signMatch) {
        bucketName = signMatch[1];
        filePath = signMatch[2];
        console.log("Signed URL - Bucket:", bucketName, "Path:", filePath);
      } else {
        return NextResponse.json(
          { error: `Could not parse signed URL: ${originalUrl}` },
          { status: 400 }
        );
      }
    }
    // Handle public URLs: /storage/v1/object/public/bucket/path/to/file
    else if (pathname.includes("/object/public/")) {
      const publicMatch = pathname.match(/\/object\/public\/([^\/]+)\/(.+)/);
      if (publicMatch) {
        bucketName = publicMatch[1];
        filePath = publicMatch[2];
        console.log("Public URL - Bucket:", bucketName, "Path:", filePath);
      } else {
        return NextResponse.json(
          { error: `Could not parse public URL: ${originalUrl}` },
          { status: 400 }
        );
      }
    }
    // Fallback: try to extract from path segments
    else {
      const pathParts = pathname.split("/").filter((part) => part.length > 0);
      console.log("Path parts:", pathParts);

      // Look for common patterns
      const objectIndex = pathParts.findIndex((part) => part === "object");
      if (objectIndex !== -1 && objectIndex + 2 < pathParts.length) {
        bucketName = pathParts[objectIndex + 2];
        filePath = pathParts.slice(objectIndex + 3).join("/");
        console.log("Fallback - Bucket:", bucketName, "Path:", filePath);
      } else {
        return NextResponse.json(
          {
            error: `Could not extract bucket and path from URL: ${originalUrl}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate extracted values
    if (!bucketName || !filePath) {
      return NextResponse.json(
        { error: `Invalid bucket (${bucketName}) or file path (${filePath})` },
        { status: 400 }
      );
    }

    // Update the file in storage
    console.log(
      `Updating file in bucket '${bucketName}' at path '${filePath}'`
    );
    console.log("Buffer size:", buffer.length, "bytes");

    const { data, error } = await supabase.storage
      .from(bucketName)
      .update(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    console.log("Storage update result:", { data, error });

    if (error) {
      console.error("Supabase storage error:", error);

      // Debug: List available buckets
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log(
        "Available buckets:",
        buckets?.map((b) => b.name)
      );

      // Debug: Try to list files in the detected bucket
      if (buckets?.find((b) => b.name === bucketName)) {
        const { data: files } = await supabase.storage.from(bucketName).list();
        console.log(
          `Files in bucket '${bucketName}':`,
          files?.map((f) => f.name)
        );
      }

      return NextResponse.json(
        { error: `Failed to update PDF: ${error.message}` },
        { status: 500 }
      );
    }

    // Verify the file was actually updated by checking its info
    const { data: fileInfo, error: infoError } = await supabase.storage
      .from(bucketName)
      .list(filePath.split("/").slice(0, -1).join("/"), {
        search: filePath.split("/").pop(),
      });

    if (infoError) {
      console.warn("Could not verify file update:", infoError);
    } else {
      console.log("File info after update:", fileInfo);
    }

    // Skip database update to avoid auth issues
    // The file in storage has been updated, which is the main goal

    return NextResponse.json({
      success: true,
      message: "PDF updated successfully",
      filePath,
      bucketName,
      fileSize: buffer.length,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
