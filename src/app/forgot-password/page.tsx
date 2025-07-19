import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu - PDF Reader",
  description: "Reset mật khẩu cho tài khoản PDF Reader của bạn",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
