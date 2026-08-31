"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isPortalConfigured } from "@/lib/firebase-client";

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Wraps the client portal. Subscribes to Firebase Auth state and makes
 * { user, loading, signIn, signOut } available via useClientPortalAuth().
 *
 * This is a UX convenience, not the security boundary - the real
 * boundary is Firestore/Storage Security Rules, which independently
 * verify auth.uid on every read/write regardless of what this
 * component renders. See firestore.rules / storage.rules.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isPortalConfigured();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Portal is not configured.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useClientPortalAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useClientPortalAuth must be used within AuthProvider");
  }
  return ctx;
}
