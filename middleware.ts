import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /*
   * Match every path except:
   * - /api/* (contact/newsletter/booking/webhook routes - not pages)
   * - /client-portal/* (auth-gated internal tool, deliberately kept
   *   English-only and outside the locale system - see the client
   *   portal setup notes in README.md)
   * - Next.js internals and static files
   */
  matcher: [
    "/((?!api|client-portal|_next|_vercel|.*\\..*).*)",
  ],
};
