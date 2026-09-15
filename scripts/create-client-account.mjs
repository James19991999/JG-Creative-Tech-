/**
 * One-off script to create a real client portal account: a Firebase
 * Auth user (email/password) plus their clients/{uid} profile
 * document, in one command instead of the two-step manual process in
 * README.md §6a (Firebase Console -> Add user, then Firestore Console
 * -> create the profile document by hand).
 *
 * There is still no self-service, public sign-up form - that remains
 * a deliberate choice (see README.md's "What deliberately isn't
 * built"). This script doesn't change that; it's a faster way for
 * *you* to do the same manual provisioning step you'd otherwise do by
 * clicking through two different Firebase Console screens.
 *
 * Usage (Node 20.6+, which has built-in --env-file support - no
 * extra dependency needed):
 *
 *   node --env-file=.env.local scripts/create-client-account.mjs you@example.com "A Temporary Password123" "Your Name"
 *
 * The person should change that password via Firebase Auth's own
 * password-reset flow on first login - there's no in-app password
 * reset UI, same reasoning as there being no sign-up UI.
 *
 * The profile document is created with placeholder project fields
 * (safe, empty-ish defaults matching what the dashboard already shows
 * for a client with no active project yet) - update them for real
 * later via the Firestore Console or the admin overview page, the
 * same way you'd update any other client's profile.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [, , email, password, displayName] = process.argv;

if (!email || !password) {
  console.error(
    'Usage: node --env-file=.env.local scripts/create-client-account.mjs <email> <password> ["Display Name"]'
  );
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.\n" +
      "Run this with --env-file pointing at the .env file that has them, e.g.:\n" +
      "  node --env-file=.env.local scripts/create-client-account.mjs <email> <password>"
  );
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth();
const db = getFirestore();

async function main() {
  const existing = await auth.getUserByEmail(email).catch(() => null);
  if (existing) {
    console.error(
      `An account already exists for ${email} (uid: ${existing.uid}). ` +
        "This script only creates new accounts - use the Firebase Console to change an existing password."
    );
    process.exit(1);
  }

  const userRecord = await auth.createUser({
    email,
    password,
    displayName: displayName || undefined,
  });

  await db
    .collection("clients")
    .doc(userRecord.uid)
    .set({
      displayName: displayName || "",
      company: "",
      cdnUptimePercent: 0,
      regionsSynced: "",
      lastSecurityPatchAt: "",
      activeProjectName: "",
      activeProjectDescription: "",
      activeProjectCompletionPercent: 0,
      activeProjectStatus: "",
      nextMilestoneTitle: "",
      nextMilestoneDate: "",
    });

  console.log(`Created client portal account for ${email} (uid: ${userRecord.uid}).`);
  console.log(
    "Sign in at /client-portal/sign-in with this email and the password you just set. " +
      "Change it via Firebase Auth's own password-reset flow once signed in - " +
      "there's no in-app way to change it, by design."
  );
  console.log(
    "Profile fields are empty placeholders - fill in real project details via the " +
      "Firestore Console (clients/" + userRecord.uid + ") or ask an admin to do it."
  );
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
