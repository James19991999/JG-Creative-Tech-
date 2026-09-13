"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";
import { useClientInvoice, useClientProfile } from "@/lib/client-portal/hooks";
import { siteConfig } from "@/lib/site-config";

/**
 * A real, downloadable invoice/receipt - no PDF-generation library
 * needed. This page is deliberately styled for print (see the
 * print:* utility classes and the "Download as PDF" button, which
 * just calls window.print() - browsers' native print-to-PDF is a
 * first-class feature, not a workaround). Chrome, Safari, and Edge
 * all support "Save as PDF" as a print destination out of the box.
 *
 * Gated the same way as the dashboard itself: client-side auth check
 * plus Firestore Security Rules as the real boundary (a client can
 * only ever read their own uid's invoices, enforced server-side
 * regardless of what this page does).
 */
function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvoiceReceiptPage() {
  const { user, loading: authLoading, configured } = useClientPortalAuth();
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();

  useEffect(() => {
    if (!authLoading && configured && !user) {
      router.replace("/client-portal/sign-in");
    }
  }, [authLoading, configured, user, router]);

  const uid = user?.uid;
  const { invoice, loading: invoiceLoading } = useClientInvoice(uid, params.invoiceId);
  const { profile } = useClientProfile(uid);

  if (!configured) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
        <p className="text-on-surface-variant text-center max-w-md">
          The client portal isn&apos;t configured yet. It needs Firebase
          credentials set as environment variables — see the portal setup
          notes in the README.
        </p>
      </main>
    );
  }

  if (authLoading || !user) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Loading…</p>
      </main>
    );
  }

  if (invoiceLoading) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Loading invoice…</p>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">
            That invoice couldn&apos;t be found.
          </p>
          <a href="/client-portal" className="text-primary font-bold hover:underline">
            Back to your portal
          </a>
        </div>
      </main>
    );
  }

  const displayName = profile?.displayName || user.email || "Client";

  return (
    <>
      <main id="main-content" className="min-h-screen bg-surface py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Controls - hidden when printing */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <a
              href="/client-portal"
              className="text-sm font-bold text-on-surface-variant hover:text-ink transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                arrow_back
              </span>
              Back to portal
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-primary text-on-primary font-bold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                download
              </span>
              Download as PDF
            </button>
          </div>

          {/* Receipt document */}
          <div className="bg-surface-container-lowest rounded-2xl p-10 print:rounded-none print:p-0 ghost-border print:border-0">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-outline-variant/30">
              <div>
                <h1 className="font-newsreader text-2xl font-bold text-ink">
                  {siteConfig.fullName}
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  {siteConfig.contact.address}
                </p>
                <p className="text-sm text-on-surface-variant">{siteConfig.contact.email}</p>
              </div>
              <div className="text-right">
                <p className="font-newsreader text-3xl font-bold text-ink">
                  {invoice.status === "paid" ? "Receipt" : "Invoice"}
                </p>
                <p className="text-sm text-on-surface-variant mt-1">#{invoice.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Billed to
                </p>
                <p className="text-ink font-bold">{displayName}</p>
                {profile?.company ? (
                  <p className="text-sm text-on-surface-variant">{profile.company}</p>
                ) : null}
                {user.email ? (
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  {invoice.status === "paid" ? "Paid on" : "Due"}
                </p>
                <p className="text-ink font-bold">
                  {invoice.status === "paid"
                    ? formatDate(invoice.paidAt)
                    : formatDate(invoice.dueAt)}
                </p>
                <p className="text-sm text-on-surface-variant mt-3">
                  Issued {formatDate(invoice.issuedAt)}
                </p>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-6 flex items-center justify-between mb-8">
              <div>
                <p className="font-bold text-ink">Professional services</p>
                <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wide">
                  {invoice.status}
                </p>
              </div>
              <p className="font-newsreader text-2xl font-bold text-ink">
                {(invoice.amountCents / 100).toLocaleString(undefined, {
                  style: "currency",
                  currency: invoice.currency || "USD",
                })}
              </p>
            </div>

            {invoice.intasendInvoiceId ? (
              <p className="text-xs text-on-surface-variant">
                Payment reference: {invoice.intasendInvoiceId}
              </p>
            ) : null}

            <p className="text-xs text-on-surface-variant mt-10 pt-6 border-t border-outline-variant/30 text-center">
              Thank you for your business.
            </p>
          </div>
        </div>
      </main>

      {/* Print styles - a clean receipt on its own page, no app chrome */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          header, footer, nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
