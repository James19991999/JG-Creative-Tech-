"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";

/**
 * Lightweight admin overview - built for the moment James takes on
 * more than one client and manually digging through the Firebase
 * Console for each one stops scaling. Deliberately NOT a full admin
 * dashboard (no client creation, no invoice editing, no document
 * management here) - those still happen via Firebase Console/Admin
 * SDK as before. This page only solves the specific pain named when
 * this was requested: seeing everyone's clients, invoices, and
 * unanswered messages in one place, plus replying to a message
 * without leaving the browser.
 *
 * Access is gated on a Firebase custom claim (admin: true on the ID
 * token), verified server-side by every /api/admin/* route - this
 * page's own client-side check is just for a clean "access denied"
 * message, not the real security boundary. See lib/admin-auth.ts and
 * scripts/grant-admin-claim.mjs for how that claim actually gets set.
 */

type OverviewClient = {
  uid: string;
  email: string;
  displayName: string;
  company: string;
  activeProjectName: string;
  activeProjectStatus: string;
};

type OverviewInvoice = {
  uid: string;
  clientEmail: string;
  id: string;
  number: string;
  amountCents: number;
  currency: string;
  status: string;
  dueAt: string;
};

type OverviewMessageThread = {
  uid: string;
  clientEmail: string;
  lastMessage: { body: string; sentBy: string; createdAt: string };
  needsReply: boolean;
};

type Overview = {
  clients: OverviewClient[];
  invoices: OverviewInvoice[];
  messageThreads: OverviewMessageThread[];
};

const STATUS_STYLES: Record<string, string> = {
  overdue: "bg-error-container text-on-error-container",
  sent: "bg-tertiary-container text-on-tertiary-container",
  paid: "bg-secondary-container text-on-secondary-container",
  draft: "bg-surface-container text-on-surface-variant",
};

export default function AdminOverviewPage() {
  const { user, loading: authLoading, configured } = useClientPortalAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sendingReplyFor, setSendingReplyFor] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && configured && !user) {
      router.replace("/client-portal/sign-in");
    }
  }, [authLoading, configured, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function checkAdminAndLoad() {
      const tokenResult = await user!.getIdTokenResult();
      if (cancelled) return;

      if (tokenResult.claims.admin !== true) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);

      try {
        const res = await fetch("/api/admin/overview", {
          headers: { Authorization: `Bearer ${tokenResult.token}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(data.error || "Couldn't load the overview.");
          return;
        }
        setOverview(data);
      } catch {
        if (!cancelled) setLoadError("Couldn't load the overview. Please refresh.");
      }
    }

    checkAdminAndLoad();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleReply(uid: string) {
    const body = (replyDrafts[uid] || "").trim();
    if (!body || !user) return;

    setSendingReplyFor(uid);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid, body }),
      });
      if (!res.ok) throw new Error("Reply failed");

      setReplyDrafts((prev) => ({ ...prev, [uid]: "" }));
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              messageThreads: prev.messageThreads.map((t) =>
                t.uid === uid
                  ? {
                      ...t,
                      needsReply: false,
                      lastMessage: { body, sentBy: "team", createdAt: new Date().toISOString() },
                    }
                  : t
              ),
            }
          : prev
      );
    } catch {
      setLoadError("Couldn't send that reply. Please try again.");
    } finally {
      setSendingReplyFor(null);
    }
  }

  if (!configured) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-surface px-6">
        <p className="text-on-surface-variant text-center max-w-md">
          The client portal isn&apos;t configured yet. It needs Firebase
          credentials set as environment variables — see the portal setup
          notes in the README.
        </p>
      </main>
    );
  }

  if (authLoading || !user || isAdmin === null) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Loading…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-surface px-6">
        <div className="text-center max-w-sm">
          <p className="font-newsreader text-2xl font-bold text-ink mb-2">Access denied</p>
          <p className="text-on-surface-variant mb-6">
            This page is only available to admin accounts.
          </p>
          <a href="/client-portal" className="text-ink font-bold hover:underline">
            Back to your portal
          </a>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface px-6 md:px-12 py-12 max-w-6xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <h1 className="font-newsreader text-3xl font-bold text-ink">Admin Overview</h1>
        <a href="/client-portal" className="text-sm font-bold text-on-surface-variant hover:text-ink">
          Back to your portal
        </a>
      </header>

      {loadError ? (
        <p role="alert" className="text-error font-bold">
          {loadError}
        </p>
      ) : null}

      {!overview ? (
        <p className="text-on-surface-variant">Loading overview…</p>
      ) : (
        <>
          <section>
            {(() => {
              const pendingCount = overview.clients.filter((c) =>
                c.activeProjectStatus.toLowerCase().includes("pending review")
              ).length;
              return (
                <h2 className="font-newsreader text-xl font-bold text-ink mb-4">
                  Clients ({overview.clients.length}
                  {pendingCount > 0
                    ? `, ${pendingCount} new sign-up${pendingCount === 1 ? "" : "s"} ${
                        pendingCount === 1 ? "needs" : "need"
                      } review`
                    : ""}
                  )
                </h2>
              );
            })()}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ghost-border">
              {overview.clients.length === 0 ? (
                <p className="p-6 text-on-surface-variant">No clients yet.</p>
              ) : (
                overview.clients.map((c) => {
                  const isPendingReview = c.activeProjectStatus
                    .toLowerCase()
                    .includes("pending review");
                  return (
                    <div
                      key={c.uid}
                      className={`flex flex-wrap items-center justify-between gap-3 p-5 border-b border-outline-variant/20 last:border-0 ${
                        isPendingReview ? "border-l-4 border-l-tertiary bg-tertiary-container/10" : ""
                      }`}
                    >
                      <div>
                        <p className="font-bold text-ink">{c.displayName || c.email}</p>
                        <p className="text-xs text-on-surface-variant">
                          {c.email} {c.company ? `· ${c.company}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        {isPendingReview ? (
                          <span className="text-xs font-bold uppercase text-tertiary">
                            New sign-up - needs review
                          </span>
                        ) : c.activeProjectName ? (
                          <p className="text-sm text-on-surface-variant">
                            {c.activeProjectName} - {c.activeProjectStatus}
                          </p>
                        ) : c.activeProjectStatus ? (
                          <p className="text-sm text-on-surface-variant">{c.activeProjectStatus}</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section>
            <h2 className="font-newsreader text-xl font-bold text-ink mb-4">
              Invoices ({overview.invoices.length})
            </h2>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ghost-border">
              {overview.invoices.length === 0 ? (
                <p className="p-6 text-on-surface-variant">No invoices yet.</p>
              ) : (
                overview.invoices.map((inv) => (
                  <div
                    key={`${inv.uid}-${inv.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-outline-variant/20 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-ink">
                        {inv.number} · {inv.clientEmail}
                      </p>
                      <p className="text-xs text-on-surface-variant">Due {inv.dueAt}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-ink">
                        {(inv.amountCents / 100).toLocaleString(undefined, {
                          style: "currency",
                          currency: inv.currency || "USD",
                        })}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          STATUS_STYLES[inv.status] ?? "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="font-newsreader text-xl font-bold text-ink mb-4">
              Message threads ({overview.messageThreads.filter((t) => t.needsReply).length} need a
              reply)
            </h2>
            <div className="space-y-3">
              {overview.messageThreads.length === 0 ? (
                <p className="text-on-surface-variant">No messages yet.</p>
              ) : (
                overview.messageThreads
                  .slice()
                  .sort((a, b) => Number(b.needsReply) - Number(a.needsReply))
                  .map((thread) => (
                    <div
                      key={thread.uid}
                      className={`bg-surface-container-lowest rounded-2xl p-5 ghost-border ${
                        thread.needsReply ? "border-l-4 border-l-tertiary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-ink">{thread.clientEmail}</p>
                        {thread.needsReply ? (
                          <span className="text-xs font-bold uppercase text-tertiary">
                            Needs reply
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-on-surface-variant mb-3">
                        <span className="font-bold">
                          {thread.lastMessage.sentBy === "client" ? "Them: " : "You: "}
                        </span>
                        {thread.lastMessage.body}
                      </p>
                      <div className="flex gap-2">
                        <label htmlFor={`reply-${thread.uid}`} className="sr-only">
                          Reply to {thread.clientEmail}
                        </label>
                        <input
                          id={`reply-${thread.uid}`}
                          type="text"
                          value={replyDrafts[thread.uid] || ""}
                          onChange={(e) =>
                            setReplyDrafts((prev) => ({ ...prev, [thread.uid]: e.target.value }))
                          }
                          placeholder="Type a reply…"
                          className="flex-1 px-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleReply(thread.uid)}
                          disabled={
                            sendingReplyFor === thread.uid || !(replyDrafts[thread.uid] || "").trim()
                          }
                          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-bold disabled:opacity-50"
                        >
                          {sendingReplyFor === thread.uid ? "Sending…" : "Send"}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
