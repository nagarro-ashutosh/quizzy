import TestBuilderPage from "@/features/admin/TestBuilderPage";
import ProtectedLayout from "@/features/components/ProtectedLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Test",
  description: "Create a timed assessment by selecting questions.",
  alternates: {
    canonical: "/admin/tests/new",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Tests() {
  return (
    <ProtectedLayout role={"admin"}>
      <TestBuilderPage />
    </ProtectedLayout>
  );
}
