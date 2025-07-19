import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password - PDF Reader",
  description: "Set a new password for your PDF Reader account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
