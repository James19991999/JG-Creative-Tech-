"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";
import {
  useClientDocuments,
  useClientInvoices,
  useClientNotifications,
  useClientProfile,
} from "@/lib/client-portal/hooks";
import {
  ClientPortalActionError,
  downloadClientDocument,
  markNotificationRead,
  sendClientMessage,
  uploadClientDocument,
} from "@/lib/client-portal/actions";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const INVOICE_STATUS_STYLES: Record<string, string> = {
  paid: "bg-secondary/10 text-secondary",
  sent: "bg-primary-container/20 text-ink",
  overdue: "bg-error-container text-on-error-container",
  draft: "bg-surface-container text-on-surface-variant",
};

export function ClientPortalDashboard() {
  const { user, loading: authLoading, configured, signOut } = useClientPortalAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && configured && !user) {
      router.replace("/client-portal/sign-in");
    }
  }, [authLoading, configured, user, router]);

  const uid = user?.uid;
  const { profile, loading: profileLoading } = useClientProfile(uid);
  const { data: documents, loading: docsLoading, error: docsError } =
    useClientDocuments(uid);
  const { data: invoices, loading: invoicesLoading } = useClientInvoices(uid);
  const { data: notifications } = useClientNotifications(uid);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messageState, setMessageState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [messageError, setMessageError] = useState<string | null>(null);

  const documentsRef = useRef<HTMLDivElement>(null);
  const invoicesRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!configured) {
    return (
      <main
        id="main-content"
        className="min-h-screen flex items-center justify-center px-6"
      >
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

  const displayName = profile?.displayName || user.email || "there";
  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !uid) return;
    setUploading(true);
    setUploadError(null);
    try {
      await uploadClientDocument(uid, file);
    } catch (err) {
      setUploadError(
        err instanceof ClientPortalActionError
          ? err.message
          : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(storagePath: string, name: string) {
    setDownloadError(null);
    try {
      await downloadClientDocument(storagePath, name);
    } catch {
      setDownloadError(`Couldn't download ${name}. Please try again.`);
    }
  }

  async function handleSendMessage() {
    if (!uid) return;
    setMessageState("sending");
    setMessageError(null);
    try {
      await sendClientMessage(uid, messageBody);
      setMessageState("sent");
      setMessageBody("");
    } catch (err) {
      setMessageState("error");
      setMessageError(
        err instanceof ClientPortalActionError
          ? err.message
          : "Couldn't send your message. Please try again."
      );
    }
  }

  async function handleOpenNotifications() {
    setNotifOpen((open) => !open);
    if (!uid) return;
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      await markNotificationRead(uid, n.id);
    }
  }

  const hasProject = Boolean(profile?.activeProjectName);

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0 md:pl-20">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl whisper-shadow flex justify-between items-center px-6 py-4 max-w-full md:pl-26">
        <h1 className="text-xl font-newsreader font-bold text-ink">
          Infrastructure Portal
        </h1>
        <div className="flex items-center gap-4 relative">
          <button
            type="button"
            aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
            onClick={handleOpenNotifications}
            className="relative material-symbols-outlined text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors duration-300"
          >
            notifications
            {unreadCount > 0 ? (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            ) : null}
          </button>
          {notifOpen ? (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-surface-container-lowest rounded-xl whisper-shadow p-2 z-50">
              {notifications.length === 0 ? (
                <p className="text-sm text-on-surface-variant p-4 text-center">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-lg hover:bg-surface-container">
                    <p className="font-bold text-sm text-ink">{n.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{n.body}</p>
                    <p className="text-[10px] text-on-surface-variant/70 mt-1">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : null}
          <div
            className="w-10 h-10 rounded-full bg-primary-container overflow-hidden ring-2 ring-white/20 flex items-center justify-center text-on-primary-container font-bold text-sm"
            aria-hidden="true"
          >
            {initials(displayName)}
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm font-bold text-on-surface-variant hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main id="main-content" className="pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section className="mt-8">
          <span className="text-accent font-medium text-xs tracking-[0.2em] uppercase mb-2 block">
            Executive Overview
          </span>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="font-newsreader text-5xl md:text-6xl font-semibold text-ink tracking-tight">
                Welcome back, {profileLoading ? "…" : displayName}
              </h2>
              <p className="text-on-surface-variant mt-3 max-w-xl text-lg leading-relaxed">
                {hasProject
                  ? profile?.activeProjectDescription
                  : "Your account is set up and ready. Your project details will appear here once your team adds them."}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-full whisper-shadow">
              <span className="bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full">
                SECURE PORTAL
              </span>
              {lastSignIn ? (
                <span className="text-on-surface-variant text-xs pr-4">
                  Last sign-in: {lastSignIn}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Active Project Card */}
          <div className="md:col-span-8 bg-primary text-on-primary rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  aria-hidden="true"
                >
                  account_tree
                </span>
                <span className="text-on-primary-container font-medium tracking-widest text-xs uppercase">
                  Active Project
                </span>
              </div>
              {hasProject ? (
                <>
                  <h3 className="font-newsreader text-4xl font-semibold mb-2">
                    {profile?.activeProjectName}
                  </h3>
                  <p className="text-on-primary-container max-w-sm">
                    {profile?.activeProjectDescription}
                  </p>
                </>
              ) : (
                <p className="text-on-primary-container max-w-sm">
                  No active project has been assigned to your account yet.
                </p>
              )}
            </div>
            {hasProject ? (
              <div className="z-10 w-full mt-12">
                <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <span className="text-4xl font-bold tracking-tighter">
                      {profile?.activeProjectCompletionPercent ?? 0}%
                    </span>
                    <p className="text-xs uppercase tracking-widest text-white/70">
                      Completion Rate
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-widest text-white/70 block mb-1">
                      Status
                    </span>
                    <span className="bg-on-primary-container/20 text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
                      {profile?.activeProjectStatus || "—"}
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-on-primary-container rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, profile?.activeProjectCompletionPercent ?? 0))}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Upcoming Milestone */}
          <div className="md:col-span-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-[2rem] p-8 flex flex-col justify-between ghost-border">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-tertiary" aria-hidden="true">
                  event_upcoming
                </span>
              </div>
              <span className="text-on-tertiary-fixed-variant font-bold text-xs tracking-widest uppercase">
                Upcoming Milestone
              </span>
              <h3 className="font-newsreader text-3xl font-semibold mt-4 leading-tight">
                {profile?.nextMilestoneTitle || "No milestone scheduled"}
              </h3>
            </div>
            {profile?.nextMilestoneDate ? (
              <div className="mt-8 border-t border-tertiary-fixed-dim pt-6">
                <p className="text-2xl font-bold tracking-tighter">
                  {formatDate(profile.nextMilestoneDate)}
                </p>
              </div>
            ) : null}
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300 disabled:opacity-60 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    upload_file
                  </span>
                </div>
                <span className="font-bold text-ink">
                  {uploading ? "Uploading…" : "Upload Documents"}
                </span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />

            <button
              type="button"
              onClick={() => setMessageOpen(true)}
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    forum
                  </span>
                </div>
                <span className="font-bold text-ink">Message Team</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                invoicesRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    receipt_long
                  </span>
                </div>
                <span className="font-bold text-ink">View Invoices</span>
              </div>
            </button>
          </div>

          {/* Documents */}
          <div
            ref={documentsRef}
            className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-newsreader text-2xl font-semibold">Documents</h3>
            </div>
            {uploadError ? (
              <p role="alert" className="text-error text-sm font-bold mb-4">
                {uploadError}
              </p>
            ) : null}
            {downloadError ? (
              <p role="alert" className="text-error text-sm font-bold mb-4">
                {downloadError}
              </p>
            ) : null}
            {docsError ? (
              <p role="alert" className="text-error text-sm font-bold mb-4">
                {docsError}
              </p>
            ) : null}
            {docsLoading ? (
              <p className="text-on-surface-variant text-sm">Loading documents…</p>
            ) : documents.length === 0 ? (
              <p className="text-on-surface-variant text-sm">
                No documents yet. Use &quot;Upload Documents&quot; to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {documents.map((docItem) => (
                  <div
                    key={docItem.id}
                    className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-white hover:shadow-lg transition-all ghost-border"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined" aria-hidden="true">
                          description
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-ink truncate">
                          {docItem.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          {formatBytes(docItem.sizeBytes)} · {formatDate(docItem.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-on-surface-variant uppercase px-3 py-1 bg-surface-container rounded-full hidden sm:inline">
                        {docItem.visibility}
                      </span>
                      <button
                        type="button"
                        aria-label={`Download ${docItem.name}`}
                        onClick={() =>
                          handleDownload(docItem.storagePath, docItem.name)
                        }
                        className="material-symbols-outlined text-on-surface-variant hover:text-ink"
                      >
                        download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Invoices */}
        <section ref={invoicesRef} className="scroll-mt-24">
          <h3 className="font-newsreader text-2xl font-semibold mb-6">Invoices</h3>
          {invoicesLoading ? (
            <p className="text-on-surface-variant text-sm">Loading invoices…</p>
          ) : invoices.length === 0 ? (
            <p className="text-on-surface-variant text-sm">
              No invoices on file yet.
            </p>
          ) : (
            <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl ghost-border"
                >
                  <div>
                    <h4 className="font-bold text-ink">Invoice {inv.number}</h4>
                    <p className="text-xs text-on-surface-variant">
                      Issued {formatDate(inv.issuedAt)} · Due {formatDate(inv.dueAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-ink">
                      {(inv.amountCents / 100).toLocaleString(undefined, {
                        style: "currency",
                        currency: inv.currency || "USD",
                      })}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${INVOICE_STATUS_STYLES[inv.status] ?? "bg-surface-container text-on-surface-variant"}`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Infrastructure Accent Section */}
        {profile?.cdnUptimePercent ? (
          <section className="py-12 border-l-4 border-on-tertiary-container pl-8">
            <h4 className="font-newsreader text-3xl font-semibold text-ink">
              System Integrity Report
            </h4>
            <p className="text-on-surface-variant mt-2 max-w-2xl">
              CDN performance is at {profile.cdnUptimePercent}% uptime.
              {profile.regionsSynced
                ? ` Clusters synchronized: ${profile.regionsSynced}.`
                : ""}
              {profile.lastSecurityPatchAt
                ? ` All security patches deployed as of ${formatDate(profile.lastSecurityPatchAt)}.`
                : ""}
            </p>
          </section>
        ) : null}
      </main>

      {/* Message Team Modal */}
      {messageOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-team-title"
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-6"
        >
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full whisper-shadow">
            <h3 id="message-team-title" className="font-newsreader text-2xl font-bold text-ink mb-4">
              Message your team
            </h3>
            {messageState === "sent" ? (
              <div>
                <p className="text-on-surface-variant mb-6">
                  Your message has been sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMessageOpen(false);
                    setMessageState("idle");
                  }}
                  className="w-full bg-primary text-on-primary font-bold py-3 rounded-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {messageError ? (
                  <p role="alert" className="text-error text-sm font-bold mb-4">
                    {messageError}
                  </p>
                ) : null}
                <label htmlFor="message-body" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message-body"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  placeholder="What's on your mind?"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMessageOpen(false)}
                    className="flex-1 border border-outline-variant text-ink font-bold py-3 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={messageState === "sending"}
                    className="flex-1 bg-primary text-on-primary font-bold py-3 rounded-full disabled:opacity-60"
                  >
                    {messageState === "sending" ? "Sending…" : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* BottomNavBar */}
      <nav
        aria-label="Mobile"
        className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-6 bg-white/90 backdrop-blur-2xl rounded-t-[24px] shadow-[0_-8px_40px_-12px_rgba(25,28,30,0.06)] z-50 md:hidden"
      >
        <a
          className="flex flex-col items-center gap-1 bg-gradient-to-br from-primary to-primary-container text-white rounded-full px-5 py-2.5 shadow-lg scale-105 transition-transform duration-300"
          href="/client-portal"
          aria-current="page"
        >
          <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Overview</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2.5 hover:text-secondary active:scale-90 transition-all duration-300" href="/portfolio">
          <span className="material-symbols-outlined" aria-hidden="true">account_tree</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Projects</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2.5 hover:text-secondary active:scale-90 transition-all duration-300" href="/contact">
          <span className="material-symbols-outlined" aria-hidden="true">chat_bubble</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Support</span>
        </a>
      </nav>

      {/* Desktop Sidebar */}
      <nav
        aria-label="Sidebar"
        className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-surface-container-low z-[60]"
      >
        <div className="mb-12">
          <span className="material-symbols-outlined text-ink text-3xl" aria-hidden="true">token</span>
        </div>
        <div className="flex flex-col gap-8">
          <a href="/client-portal" aria-current="page" aria-label="Overview" className="material-symbols-outlined text-primary bg-white p-3 rounded-2xl shadow-md">
            dashboard
          </a>
          <a href="/portfolio" aria-label="Projects" className="material-symbols-outlined text-on-surface-variant hover:text-ink transition-colors">
            account_tree
          </a>
          <a href="/contact" aria-label="Support" className="material-symbols-outlined text-on-surface-variant hover:text-ink transition-colors">
            chat_bubble
          </a>
        </div>
      </nav>
    </div>
  );
}
