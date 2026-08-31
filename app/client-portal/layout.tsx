import { AuthProvider } from "@/components/client-portal/AuthProvider";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
