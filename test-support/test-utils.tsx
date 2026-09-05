import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import messages from "@/messages/en.json";

/**
 * Wraps a component with NextIntlClientProvider using the site's real
 * English messages (not a mock dictionary) - so a test failure here
 * means a genuinely missing/renamed translation key, not a stale
 * fixture drifting from the real messages/en.json file.
 */
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export function renderWithIntl(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
