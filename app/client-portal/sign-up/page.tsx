import type { Metadata } from "next";
import { SignUpForm } from "@/components/client-portal/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account | Infrastructure Portal",
  robots: { index: false, follow: false },
};

export default function ClientPortalSignUpPage() {
  return (
    <main
      id="main-content"
      className="bg-surface min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-newsreader text-3xl font-bold text-ink">
            Create Your Account
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            Set up portal access to view your documents, invoices, and project
            status.
          </p>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Already have an account?{" "}
          <a href="/client-portal/sign-in" className="text-ink font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
