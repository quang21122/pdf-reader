import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import OCRContent from "@/components/ocr/OCRContent";

export default function OCRPage() {
  return (
    <AuthGuard>
      <OCRContent />
    </AuthGuard>
  );
}
