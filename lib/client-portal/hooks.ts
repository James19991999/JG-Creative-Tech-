"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  type FirestoreError,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase-client";

export type ClientDocument = {
  id: string;
  name: string;
  storagePath: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: "client" | "team";
  visibility: "shared" | "internal";
};

export type ClientInvoice = {
  id: string;
  number: string;
  amountCents: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issuedAt: string;
  dueAt: string;
};

export type ClientNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type ClientMessage = {
  id: string;
  body: string;
  sentBy: "client" | "team";
  createdAt: string;
};

export type ClientProfile = {
  displayName: string;
  company: string;
  cdnUptimePercent: number;
  regionsSynced: string;
  lastSecurityPatchAt: string;
  activeProjectName: string;
  activeProjectDescription: string;
  activeProjectCompletionPercent: number;
  activeProjectStatus: string;
  nextMilestoneTitle: string;
  nextMilestoneDate: string;
};

type CollectionState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

/**
 * Generic real-time subscription to a client's subcollection, ordered
 * by `orderField` descending. Every onSnapshot call here registers an
 * error callback - an unhandled Firestore listener error silently
 * leaves the UI in a stale "loading" state forever, which is a real
 * bug class, not a hypothetical one.
 */
function useClientSubcollection<T>(
  uid: string | undefined,
  subcollection: string,
  orderField: string
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    const db = getFirebaseDb();
    if (!db) {
      setState({ data: [], loading: false, error: "Portal is not configured." });
      return;
    }

    const q = query(
      collection(db, "clients", uid, subcollection),
      orderBy(orderField, "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as T)
        );
        setState({ data, loading: false, error: null });
      },
      (err: FirestoreError) => {
        setState({
          data: [],
          loading: false,
          error: "Couldn't load this section. Please refresh the page.",
        });
        console.error(`[client-portal] ${subcollection} listener error:`, err);
      }
    );

    return unsubscribe;
  }, [uid, subcollection, orderField]);

  return state;
}

export function useClientDocuments(uid: string | undefined) {
  return useClientSubcollection<ClientDocument>(uid, "documents", "uploadedAt");
}

export function useClientInvoices(uid: string | undefined) {
  return useClientSubcollection<ClientInvoice>(uid, "invoices", "issuedAt");
}

export function useClientNotifications(uid: string | undefined) {
  return useClientSubcollection<ClientNotification>(
    uid,
    "notifications",
    "createdAt"
  );
}

export function useClientMessages(uid: string | undefined) {
  return useClientSubcollection<ClientMessage>(uid, "messages", "createdAt");
}

export function useClientProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    if (!db) {
      setLoading(false);
      setError("Portal is not configured.");
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "clients", uid),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as ClientProfile) : null);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setLoading(false);
        setError("Couldn't load your profile. Please refresh the page.");
        console.error("[client-portal] profile listener error:", err);
      }
    );

    return unsubscribe;
  }, [uid]);

  return { profile, loading, error };
}
