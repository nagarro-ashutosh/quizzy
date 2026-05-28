import QuestionImportPage from "@/features/admin/QuestionImportPage";
import ProtectedLayout from "@/features/components/ProtectedLayout";

export default function Question() {
  return (
    <ProtectedLayout role={"admin"}>
      <>
        <QuestionImportPage />
      </>
    </ProtectedLayout>
  );
}
