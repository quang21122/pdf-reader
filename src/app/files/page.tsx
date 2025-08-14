import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { FilesContent } from "@/components/files";

export default function FilesPage() {
  return (
    <AuthGuard>
      <FilesContent />
    </AuthGuard>
  );
}
