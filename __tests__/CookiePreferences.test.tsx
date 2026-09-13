import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookiePreferences } from "@/components/CookiePreferences";

describe("CookiePreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all three cookie category cards", () => {
    render(<CookiePreferences />);

    expect(screen.getByText("Essential Cookies")).toBeInTheDocument();
    expect(screen.getByText("Analytics & Performance")).toBeInTheDocument();
    expect(screen.getByText("Marketing & Advertising")).toBeInTheDocument();
  });

  it("marks Essential Cookies as mandatory with no toggle", () => {
    render(<CookiePreferences />);

    expect(screen.getByText("Mandatory")).toBeInTheDocument();
    expect(screen.getByText("Always Active")).toBeInTheDocument();
  });

  it("defaults both categories to off until an explicit decision is made", () => {
    render(<CookiePreferences />);

    // Real analytics is now wired to this consent state (see
    // components/Analytics.tsx) - defaulting a category to "on"
    // before the visitor has made any decision would mean tracking
    // fires without genuine consent, so both must start denied.
    expect(screen.getByLabelText("Toggle analytics cookies")).not.toBeChecked();
    expect(screen.getByLabelText("Toggle marketing cookies")).not.toBeChecked();
  });

  it("toggles analytics on when clicked", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    const analyticsToggle = screen.getByLabelText("Toggle analytics cookies");
    await user.click(analyticsToggle);

    expect(analyticsToggle).toBeChecked();
  });

  it("toggles marketing on when clicked", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    const marketingToggle = screen.getByLabelText("Toggle marketing cookies");
    await user.click(marketingToggle);

    expect(marketingToggle).toBeChecked();
  });

  it("toggling one category doesn't affect the other", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    await user.click(screen.getByLabelText("Toggle analytics cookies"));

    expect(screen.getByLabelText("Toggle analytics cookies")).toBeChecked();
    expect(screen.getByLabelText("Toggle marketing cookies")).not.toBeChecked();
  });

  it("persists preference changes to localStorage", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    await user.click(screen.getByLabelText("Toggle marketing cookies"));

    const stored = JSON.parse(localStorage.getItem("jg-cookie-consent-detailed") ?? "{}");
    expect(stored.marketing).toBe(true);
  });

  it("shows a saved confirmation message after toggling", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    await user.click(screen.getByLabelText("Toggle marketing cookies"));

    expect(await screen.findByText("Preferences saved.")).toBeInTheDocument();
  });
});
