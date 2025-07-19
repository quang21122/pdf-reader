import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up - PDF Reader",
  description: "Create a new account to use PDF Reader",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
