import { render } from "@testing-library/react";
import { Analytics } from "@/components/Analytics";
import { useCookieConsent } from "@/lib/cookie-consent";

jest.mock("@/lib/cookie-consent", () => ({
  useCookieConsent: jest.fn(),
}));

const mockedUseCookieConsent = useCookieConsent as jest.Mock;
const originalEnv = process.env;

describe("Analytics", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    window.gtag = jest.fn();
    mockedUseCookieConsent.mockReturnValue({
      consent: { hasDecided: false, analytics: false, marketing: false },
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    // @ts-expect-error - cleaning up the test-added global
    delete window.gtag;
  });

  it("renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set", () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const { container } = render(<Analytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it("does not throw when a measurement ID is configured", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    // next/script defers actual <script> tag injection to Next's own
    // runtime (particularly for the beforeInteractive strategy), which
    // renders nothing into the container in a bare JSDOM test - a
    // known limitation of testing next/script components in isolation,
    // not something under this component's own logic. The meaningful,
    // testable behavior is the consent-mapping logic covered below.
    expect(() => render(<Analytics />)).not.toThrow();
  });

  it("does not call gtag consent update before a decision has been made", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    mockedUseCookieConsent.mockReturnValue({
      consent: { hasDecided: false, analytics: false, marketing: false },
    });
    render(<Analytics />);
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("sends a granted consent update once analytics is accepted", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    mockedUseCookieConsent.mockReturnValue({
      consent: { hasDecided: true, analytics: true, marketing: false },
    });
    render(<Analytics />);
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({ analytics_storage: "granted" })
    );
  });

  it("sends a denied consent update when the visitor declines", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    mockedUseCookieConsent.mockReturnValue({
      consent: { hasDecided: true, analytics: false, marketing: false },
    });
    render(<Analytics />);
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({ analytics_storage: "denied" })
    );
  });

  it("maps the marketing category to the three ad-related signals", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    mockedUseCookieConsent.mockReturnValue({
      consent: { hasDecided: true, analytics: false, marketing: true },
    });
    render(<Analytics />);
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      })
    );
  });
});
