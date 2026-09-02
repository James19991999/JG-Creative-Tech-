"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";

type State = "idle" | "submitting" | "error";

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "That email or password isn't right.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

function friendlyAuthError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    return FIREBASE_ERROR_MESSAGES[code] ?? "Sign-in failed. Please try again.";
  }
  return "Sign-in failed. Please try again.";
}

export function SignInForm() {
  const { signIn, configured } = useClientPortalAuth();
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError(null);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await signIn(email, password);
      router.push("/client-portal");
    } catch (err) {
      setState("error");
      setError(friendlyAuthError(err));
    }
  }

  if (!configured) {
    return (
      <div className="bg-surface-container-lowest p-8 rounded-xl whisper-shadow max-w-md mx-auto">
        <p className="text-on-surface-variant text-sm leading-relaxed">
          The client portal isn&apos;t configured yet. It needs Firebase
          credentials set as environment variables before anyone can sign
          in — see the portal setup notes in the README.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-surface-container-lowest p-8 rounded-xl whisper-shadow max-w-md mx-auto"
    >
      {error ? (
        <p role="alert" className="text-error text-sm font-bold mb-6">
          {error}
        </p>
      ) : null}

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-bold text-ink mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-bold text-ink mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100"
      >
        {state === "submitting" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
