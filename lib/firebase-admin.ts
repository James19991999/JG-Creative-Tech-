import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin initialization for server-side use only (API routes).
 * Never import this from client components.
 *
 * Required environment variables (see .env.example):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (escape newlines as \n when stored in .env)
 *
 * If these are not configured, getAdminDb() returns null and callers
 * should fall back gracefully (e.g. log the submission) rather than
 * crash the request - this keeps local development and CI green
 * without requiring real Firebase credentials.
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
    return null;
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return app;
}

export function getAdminDb(): Firestore | null {
  const adminApp = getAdminApp();
  if (!adminApp) return null;
  return getFirestore(adminApp);
}
