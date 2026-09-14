import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

/**
 * GET /api/admin/overview
 *
 * The whole point of this route: everything an admin needs to see
 * across every client, in one call, without opening the Firebase
 * Console. Uses Admin SDK exclusively (bypasses Firestore Security
 * Rules entirely, same as every other privileged operation in this
 * project) rather than loosening the existing client-side rules,
 * which stay exactly as restrictive as before - a regular client's
 * own browser still cannot read another client's data under any
 * circumstance; only this server route, gated on the admin custom
 * claim, can.
 */
export async function GET(request: Request) {
  const db = getAdminDb();
  const auth = getAdminAuth();
  if (!db || !auth) {
    return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });
  }

  const adminUid = await verifyAdminRequest(request, auth);
  if (!adminUid) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const [clientsSnapshot, invoicesSnapshot, messagesSnapshot] = await Promise.all([
    db.collection("clients").get(),
    db.collectionGroup("invoices").get(),
    db.collectionGroup("messages").orderBy("createdAt", "desc").get(),
  ]);

  // Resolve every client's email once, reused across invoices and
  // message threads below rather than looking it up per-invoice.
  const emailByUid = new Map<string, string>();
  await Promise.all(
    clientsSnapshot.docs.map(async (doc) => {
      try {
        const userRecord = await auth.getUser(doc.id);
        emailByUid.set(doc.id, userRecord.email ?? "(no email)");
      } catch {
        emailByUid.set(doc.id, "(account not found)");
      }
    })
  );

  const clients = clientsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: emailByUid.get(doc.id) ?? "(unknown)",
      displayName: data.displayName ?? "",
      company: data.company ?? "",
      activeProjectName: data.activeProjectName ?? "",
      activeProjectStatus: data.activeProjectStatus ?? "",
    };
  });

  const invoices = invoicesSnapshot.docs
    .map((doc) => {
      const uid = doc.ref.parent.parent?.id;
      if (!uid) return null;
      const data = doc.data();
      return {
        uid,
        clientEmail: emailByUid.get(uid) ?? "(unknown)",
        id: doc.id,
        number: data.number,
        amountCents: data.amountCents,
        currency: data.currency,
        status: data.status,
        dueAt: data.dueAt,
      };
    })
    .filter((invoice): invoice is NonNullable<typeof invoice> => invoice !== null)
    // Overdue first, then sent, so what actually needs attention floats
    // to the top rather than being sorted chronologically.
    .sort((a, b) => {
      const priority: Record<string, number> = { overdue: 0, sent: 1, paid: 2, draft: 3 };
      return (priority[a.status] ?? 4) - (priority[b.status] ?? 4);
    });

  // Group messages by client, keep only the most recent one per
  // client (messages arrive newest-first from the orderBy above, so
  // the first one seen per uid is the latest) - a thread "needs
  // reply" only when the client spoke last.
  const latestMessageByUid = new Map<
    string,
    { body: string; sentBy: string; createdAt: string }
  >();
  for (const doc of messagesSnapshot.docs) {
    const uid = doc.ref.parent.parent?.id;
    if (!uid || latestMessageByUid.has(uid)) continue;
    const data = doc.data();
    latestMessageByUid.set(uid, {
      body: data.body,
      sentBy: data.sentBy,
      createdAt: data.createdAt,
    });
  }

  const messageThreads = Array.from(latestMessageByUid.entries()).map(([uid, last]) => ({
    uid,
    clientEmail: emailByUid.get(uid) ?? "(unknown)",
    lastMessage: last,
    needsReply: last.sentBy === "client",
  }));

  return NextResponse.json({ clients, invoices, messageThreads });
}
