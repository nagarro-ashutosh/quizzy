import ProtectedLayout from "@/features/components/ProtectedLayout";
import TestListPage from "@/features/participant/TestListPage";

export default function Page() {
  return (
    <ProtectedLayout role="participant">
      <TestListPage />
    </ProtectedLayout>
  );
}
