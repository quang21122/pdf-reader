import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { TrashContent } from "@/components/trash";

export default function TrashPage() {
  return (
    <AuthGuard>
      <TrashContent />
    </AuthGuard>
  );
}
