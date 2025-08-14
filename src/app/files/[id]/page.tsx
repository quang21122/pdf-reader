import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { FileViewerContent } from "@/components/file-viewer";

export default function FileViewerPage() {
  return (
    <AuthGuard>
      <FileViewerContent />
    </AuthGuard>
  );
}
