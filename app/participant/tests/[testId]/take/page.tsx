import ProtectedLayout from "@/features/components/ProtectedLayout";
import TestTakingPage from "@/features/participant/TestTakingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Assessment",
  description:
    "Timed assessment screen with keyboard-friendly navigation and auto-submit.",
  alternates: {
    canonical: "/participant/tests/take",
  },
  robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return (
    <ProtectedLayout role="participant">
      <TestTakingPage />
    </ProtectedLayout>
  );
}
