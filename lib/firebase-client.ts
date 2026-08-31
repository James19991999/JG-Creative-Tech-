"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Client-side Firebase initialization for the Client Portal (auth,
 * Firestore, Storage). Client-only - never import from a Server
 * Component or API route (use lib/firebase-admin.ts there instead).
 *
 * Required environment variables (see .env.example):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * If these aren't configured, every getter below returns null and
 * callers should show a clear "portal not configured" state rather
 * than crash - same fallback pattern as lib/firebase-admin.ts.
 */

let app: FirebaseApp | null | undefined;

function getClientApp(): FirebaseApp | null {
  if (app !== undefined) return app;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.projectId || !config.appId) {
    app = null;
    return app;
  }

  app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
  return app;
}

export function isPortalConfigured(): boolean {
  return getClientApp() !== null;
}

export function getFirebaseAuth(): Auth | null {
  const clientApp = getClientApp();
  if (!clientApp) return null;
  return getAuth(clientApp);
}

export function getFirebaseDb(): Firestore | null {
  const clientApp = getClientApp();
  if (!clientApp) return null;
  return getFirestore(clientApp);
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const clientApp = getClientApp();
  if (!clientApp) return null;
  return getStorage(clientApp);
}
