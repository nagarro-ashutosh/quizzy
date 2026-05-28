import { Metadata } from "next";
import LoginPage from "@/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};

export default function Page() {
  return <LoginPage />;
}
