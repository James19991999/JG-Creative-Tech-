"use client";

/**
 * "Clear Local Storage" action from the Cookie Policy's Data Retention
 * section. Clears both localStorage and sessionStorage (cookie consent,
 * funnel intake data) and reloads to reflect the reset state.
 */
export function ClearStorageButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        } catch {
          // ignore storage failures
        }
      }}
      className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all active:scale-95"
    >
      Clear Local Storage
    </button>
  );
}
