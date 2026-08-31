"use client";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase-client";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB

export class ClientPortalActionError extends Error {}

/**
 * Uploads a file to Storage under the client's own path and records it
 * in Firestore. Storage Security Rules independently enforce that a
 * user can only write under clients/{their own uid}/... - this
 * client-side check is just a fast, friendly failure, not the real
 * boundary.
 */
export async function uploadClientDocument(uid: string, file: File): Promise<void> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ClientPortalActionError(
      "That file is larger than the 20MB upload limit."
    );
  }

  const storage = getFirebaseStorage();
  const db = getFirebaseDb();
  if (!storage || !db) {
    throw new ClientPortalActionError("Portal is not configured.");
  }

  const storagePath = `clients/${uid}/documents/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, { contentType: file.type });

  await addDoc(collection(db, "clients", uid, "documents"), {
    name: file.name,
    storagePath,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: "client",
    visibility: "shared",
  });
}

/**
 * Resolves a real, time-limited download URL for a stored document and
 * triggers a browser download. Throws if Storage rules reject the
 * request (e.g. the document doesn't belong to this user).
 */
export async function downloadClientDocument(
  storagePath: string,
  fileName: string
): Promise<void> {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new ClientPortalActionError("Portal is not configured.");
  }
  const url = await getDownloadURL(ref(storage, storagePath));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Writes a message to the client's message thread. */
export async function sendClientMessage(uid: string, body: string): Promise<void> {
  const trimmed = body.trim();
  if (!trimmed) {
    throw new ClientPortalActionError("Message can't be empty.");
  }
  if (trimmed.length > 2000) {
    throw new ClientPortalActionError("Message is too long (2000 characters max).");
  }

  const db = getFirebaseDb();
  if (!db) {
    throw new ClientPortalActionError("Portal is not configured.");
  }

  await addDoc(collection(db, "clients", uid, "messages"), {
    body: trimmed,
    sentBy: "client",
    createdAt: new Date().toISOString(),
  });
}

/** Marks a single notification as read. */
export async function markNotificationRead(uid: string, notificationId: string) {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, "clients", uid, "notifications", notificationId), {
    read: true,
  });
}
