"use client";

export function OfflineReloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center gap-2 rounded-full font-bold font-manrope transition-all gradient-primary text-on-primary whisper-shadow hover:opacity-90 active:scale-95 px-8 py-4 text-base"
    >
      Try Again
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        refresh
      </span>
    </button>
  );
}
