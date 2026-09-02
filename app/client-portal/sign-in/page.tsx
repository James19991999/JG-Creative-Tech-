import type { Metadata } from "next";
import { SignInForm } from "@/components/client-portal/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Infrastructure Portal",
  robots: { index: false, follow: false },
};

export default function ClientPortalSignInPage() {
  return (
    <main
      id="main-content"
      className="bg-surface min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-newsreader text-3xl font-bold text-ink">
            Infrastructure Portal
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            Sign in to view your documents, invoices, and project status.
          </p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
