/**
 * One-off script to grant admin access to a client portal account.
 *
 * There is no self-service or in-app way to become an admin - this is
 * intentional. Granting admin access is a deliberate, manual action
 * you take once per person who needs it, using your own Firebase
 * service account credentials (the same ones the app's server-side
 * routes already use), not something exposed through the app itself.
 *
 * Usage (Node 20.6+, which has built-in --env-file support - no
 * extra dependency needed):
 *
 *   node --env-file=.env.local scripts/grant-admin-claim.mjs you@example.com
 *
 * You can pass either the person's email or their Firebase Auth UID.
 * Run it again with the same identifier and --revoke to remove admin
 * access later:
 *
 *   node --env-file=.env.local scripts/grant-admin-claim.mjs you@example.com --revoke
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const identifier = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!identifier) {
  console.error("Usage: node --env-file=.env.local scripts/grant-admin-claim.mjs <email-or-uid> [--revoke]");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.\n" +
      "Run this with --env-file pointing at the .env file that has them, e.g.:\n" +
      "  node --env-file=.env.local scripts/grant-admin-claim.mjs <email-or-uid>"
  );
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth();

async function main() {
  const user = identifier.includes("@")
    ? await auth.getUserByEmail(identifier)
    : await auth.getUser(identifier);

  await auth.setCustomUserClaims(user.uid, { admin: !revoke });

  console.log(
    `${revoke ? "Revoked" : "Granted"} admin access for ${user.email} (uid: ${user.uid}).`
  );
  console.log(
    "They'll need to sign out and back in (or wait up to an hour) for the change to take effect - " +
      "custom claims are embedded in the ID token, which only refreshes on a new sign-in or its own expiry."
  );
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
