import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Firebase Admin initialization for server-side use only (API routes).
 * Never import this from client components.
 *
 * Required environment variables (see .env.example):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (escape newlines as \n when stored in .env)
 *
 * These names do NOT have an _ADMIN_ infix and are NOT prefixed with
 * NEXT_PUBLIC_ - they're easy to confuse with the six separate
 * NEXT_PUBLIC_FIREBASE_* client-side variables (used by
 * lib/firebase-client.ts), which are a different set of values from a
 * different part of the Firebase Console (Project Settings -> General
 * -> Your apps) than these three (Project Settings -> Service
 * Accounts -> Generate new private key). Having the client-side vars
 * set correctly (so the sign-in/sign-up forms render at all) says
 * nothing about whether these three server-side ones are - they're
 * genuinely independent, and it's entirely possible for one set to be
 * right while the other is missing.
 *
 * If these are not configured, getAdminDb()/getAdminAuth() return
 * null and callers should fall back gracefully (e.g. log the
 * submission, or return a clear 503) rather than crash the request -
 * this keeps local development and CI green without requiring real
 * Firebase credentials.
 */

let app: App | null = null;

function getAdminApp(): App | null {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    // Named individually rather than one blanket "not configured" -
    // this is the actual, actionable diagnostic: which of the three
    // is actually missing, right now, in this environment, rather
    // than leaving that as a guessing game every time this fires.
    const missing = [
      !projectId && "FIREBASE_PROJECT_ID",
      !clientEmail && "FIREBASE_CLIENT_EMAIL",
      !privateKey && "FIREBASE_PRIVATE_KEY",
    ].filter(Boolean);
    console.error(
      `[firebase-admin] Not initializing - missing: ${missing.join(", ")}. ` +
        "These are server-side env vars (no _ADMIN_ infix, no NEXT_PUBLIC_ prefix) - " +
        "check they're set in this exact environment (Vercel project settings for " +
        "the live site, or .env.local for local dev - the two are separate)."
    );
    return null;
  }

  try {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return app;
  } catch (error) {
    // A present-but-malformed private key (e.g. corrupted during
    // copy-paste into the env var, missing its BEGIN/END markers)
    // would otherwise throw here uncaught, crashing every request
    // that touches Firebase rather than degrading to the same clean
    // "not configured" 503 a genuinely missing key produces.
    console.error(
      "[firebase-admin] initializeApp failed - FIREBASE_PRIVATE_KEY is present but " +
        "may be malformed (check it still has its full -----BEGIN/END PRIVATE KEY----- " +
        "markers and escaped newlines after being pasted into the env var):",
      error
    );
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  const adminApp = getAdminApp();
  if (!adminApp) return null;
  return getFirestore(adminApp);
}

export function getAdminAuth(): Auth | null {
  const adminApp = getAdminApp();
  if (!adminApp) return null;
  return getAuth(adminApp);
}
