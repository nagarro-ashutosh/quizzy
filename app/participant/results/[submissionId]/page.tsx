import ProtectedLayout from "@/features/components/ProtectedLayout";
import ResultPage from "@/features/participant/ResultPage";

export default function Page() {
  return (
    <ProtectedLayout role="participant">
      <ResultPage />
    </ProtectedLayout>
  );
}
