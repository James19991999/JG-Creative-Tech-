import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * POST /api/admin/reply
 *
 * Body: { uid: string, body: string }
 *
 * Writes a team reply into one client's message thread
 * (clients/{uid}/messages), via Admin SDK - the only way a "team"
 * message can be written at all, since Firestore Security Rules only
 * ever allow a client to create their own messages with
 * sentBy == "client" (see firestore.rules). This route is what
 * actually produces the other half of a real conversation the client
 * portal's message thread UI has been able to display since it was
 * built, but had no way to populate until now.
 */
export async function POST(request: Request) {
  const db = getAdminDb();
  const auth = getAdminAuth();
  if (!db || !auth) {
    return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });
  }

  const adminUid = await verifyAdminRequest(request, auth);
  if (!adminUid) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const uid =
    typeof body === "object" && body !== null && "uid" in body
      ? String((body as { uid: unknown }).uid)
      : null;
  const messageBody =
    typeof body === "object" && body !== null && "body" in body
      ? String((body as { body: unknown }).body).trim()
      : null;

  if (!uid) {
    return NextResponse.json({ error: "uid is required." }, { status: 400 });
  }
  if (!messageBody || messageBody.length === 0) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (messageBody.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  await db.collection("clients").doc(uid).collection("messages").add({
    body: messageBody,
    sentBy: "team",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
