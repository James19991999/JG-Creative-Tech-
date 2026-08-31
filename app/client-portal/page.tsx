import type { Metadata } from "next";
import { ClientPortalDashboard } from "@/components/client-portal/Dashboard";

export const metadata: Metadata = {
  title: "Infrastructure Portal",
  description:
    "Your project command center. Track milestones, review deliverables, and message your JG Creative Tech team in one place.",
  alternates: { canonical: "/client-portal" },
  robots: { index: false, follow: false },
};

export default function ClientPortalPage() {
  return <ClientPortalDashboard />;
}
