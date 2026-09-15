import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";
import { newClientSignupEmail } from "@/lib/email/templates";
import { siteConfig } from "@/lib/site-config";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 100;

/**
 * POST /api/client-portal/sign-up
 *
 * Body: { email, password, displayName }
 *
 * Creates a real Firebase Auth account plus a clients/{uid} profile
 * document - the same two things scripts/create-client-account.mjs
 * does manually, now exposed as a public endpoint. This is a genuine
 * change from this project's original design (accounts were
 * previously admin-provisioned only) - made deliberately, not a
 * silent reversal: new accounts are flagged with
 * activeProjectStatus "New sign-up - pending review" (visible in the
 * admin overview) and the site owner gets a real email the moment one
 * is created, via sendEmailBestEffort - the same email infrastructure
 * every other notification in this project already uses. Account
 * creation and dashboard access are not blocked on that review
 * happening; a "pending, can't log in yet" gate would be a real,
 * separate feature requiring its own auth state, not something to add
 * silently as part of this route.
 *
 * Uses the Admin SDK for the Firestore profile write rather than
 * having the client write it directly, which is deliberate:
 * firestore.rules makes the clients/{uid} profile document read-only
 * from the client side, by design, so that a signed-in client can
 * never edit their own project-status fields or invoices later. That
 * rule stays completely untouched by this route.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`client-signup:${ip}`)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 }
    );
  }

  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) {
    return NextResponse.json(
      { error: "The client portal is not configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email).trim()
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password)
      : "";
  const displayName =
    typeof body === "object" && body !== null && "displayName" in body
      ? String((body as { displayName: unknown }).displayName).trim()
      : "";

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }
  if (displayName.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const existing = await auth.getUserByEmail(email).catch(() => null);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists. Try signing in instead." },
      { status: 409 }
    );
  }

  let uid: string;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || undefined,
    });
    uid = userRecord.uid;
  } catch (error) {
    console.error("[client-portal-signup] Failed to create auth user:", error);
    return NextResponse.json(
      { error: "Couldn't create your account. Please try again." },
      { status: 502 }
    );
  }

  try {
    await db
      .collection("clients")
      .doc(uid)
      .set({
        displayName,
        company: "",
        cdnUptimePercent: 0,
        regionsSynced: "",
        lastSecurityPatchAt: "",
        activeProjectName: "",
        activeProjectDescription: "",
        activeProjectCompletionPercent: 0,
        activeProjectStatus: "New sign-up - pending review",
        nextMilestoneTitle: "",
        nextMilestoneDate: "",
      });
  } catch (error) {
    console.error(`[client-portal-signup] Auth user ${uid} created but profile write failed:`, error);
  }

  const emailConfig = getEmailConfig();
  if (emailConfig) {
    await sendEmailBestEffort(
      emailConfig,
      { to: siteConfig.contact.email, ...newClientSignupEmail(email, displayName) },
      "client portal signup notification"
    );
  }

  return NextResponse.json({ success: true });
}
