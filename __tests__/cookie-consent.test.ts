import { renderHook, act } from "@testing-library/react";
import { useCookieConsent } from "@/lib/cookie-consent";

describe("useCookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts undecided when nothing is stored", async () => {
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {});
    expect(result.current.consent).toEqual({
      hasDecided: false,
      analytics: false,
      marketing: false,
    });
  });

  it("acceptAll grants both categories", async () => {
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {
      result.current.acceptAll();
    });
    expect(result.current.consent).toEqual({
      hasDecided: true,
      analytics: true,
      marketing: true,
    });
  });

  it("declineAll denies both categories", async () => {
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {
      result.current.declineAll();
    });
    expect(result.current.consent).toEqual({
      hasDecided: true,
      analytics: false,
      marketing: false,
    });
  });

  it("setCategory updates one category independently of the other", async () => {
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {
      result.current.setCategory("analytics", true);
    });
    expect(result.current.consent).toEqual({
      hasDecided: true,
      analytics: true,
      marketing: false,
    });
  });

  it("persists the decision to localStorage under the unified key", async () => {
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {
      result.current.acceptAll();
    });
    const stored = JSON.parse(localStorage.getItem("jg-cookie-consent-detailed")!);
    expect(stored).toEqual({ hasDecided: true, analytics: true, marketing: true });
  });

  it("migrates a legacy 'accepted' decision to full consent on first read", async () => {
    localStorage.setItem("jg-cookie-consent", "accepted");
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {});
    expect(result.current.consent).toEqual({
      hasDecided: true,
      analytics: true,
      marketing: true,
    });
  });

  it("migrates a legacy 'declined' decision to full denial on first read", async () => {
    localStorage.setItem("jg-cookie-consent", "declined");
    const { result } = renderHook(() => useCookieConsent());
    await act(async () => {});
    expect(result.current.consent).toEqual({
      hasDecided: true,
      analytics: false,
      marketing: false,
    });
  });

  it("keeps two independent hook instances (e.g. banner + preferences panel) in sync", async () => {
    const bannerHook = renderHook(() => useCookieConsent());
    const preferencesHook = renderHook(() => useCookieConsent());

    await act(async () => {
      bannerHook.result.current.acceptAll();
    });

    expect(preferencesHook.result.current.consent).toEqual({
      hasDecided: true,
      analytics: true,
      marketing: true,
    });
  });
});
