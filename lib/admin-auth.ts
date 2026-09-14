import type { Auth } from "firebase-admin/auth";

/**
 * Verifies a request's Firebase ID token AND that it carries the
 * `admin: true` custom claim - not just that the caller is signed in
 * (any client can do that). Custom claims are Firebase's own
 * recommended mechanism for role-based access exactly like this: the
 * claim is embedded in the ID token itself and verified server-side
 * via the Admin SDK, so it can't be forged by editing a Firestore
 * document a regular client could otherwise read.
 *
 * Granting the claim is a deliberate, manual, one-off action (see
 * scripts/grant-admin-claim.mjs and the README) - there is no
 * self-service way to become an admin from within the app itself.
 *
 * Returns the admin's own uid on success, or null - callers should
 * treat null as "respond 401/403", never fall through as if verified.
 */
export async function verifyAdminRequest(
  request: Request,
  auth: Auth
): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) return null;

  try {
    const decoded = await auth.verifyIdToken(idToken);
    if (decoded.admin !== true) return null;
    return decoded.uid;
  } catch {
    return null;
  }
}
