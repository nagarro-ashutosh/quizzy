import type { Metadata } from "next";
import ResultPage from "../../../../features/participant/ResultPage";
import AppLayout from "@/features/components/AppLayout";

export const metadata: Metadata = {
  title: "Shared Assessment Result",
  description:
    "Shared assessment result summary with score and per-question breakdown.",
  alternates: {
    canonical: "/share/results",
  },
  openGraph: {
    title: "Shared Assessment Result",
    description: "Open a shared Assessly result summary.",
    type: "article",
  },
};

export default function Page() {
  return (
    <AppLayout>
      <section aria-label="Shared result">
        <h1>Shared assessment result</h1>
        <p>Review an Assessly score summary and per-question breakdown.</p>
        <ResultPage />
      </section>
    </AppLayout>
  );
}
