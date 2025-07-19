import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In - PDF Reader",
  description: "Sign in to your PDF Reader account",
};

export default function LoginPage() {
  return <LoginForm />;
}
