import AdminDashboard from "@/features/admin/AdminDashboard";
import ProtectedLayout from "@/features/components/ProtectedLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard showing the test result",
  alternates: {
    canonical: "/admin",
  },
};

export default function Admin() {
  return (
    <ProtectedLayout role={"admin"}>
      <AdminDashboard />
    </ProtectedLayout>
  );
}
