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

  it("defaults analytics to on and marketing to off, matching the source design", () => {
    render(<CookiePreferences />);

    expect(screen.getByLabelText("Toggle analytics cookies")).toBeChecked();
    expect(screen.getByLabelText("Toggle marketing cookies")).not.toBeChecked();
  });

  it("toggles analytics off when clicked", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    const analyticsToggle = screen.getByLabelText("Toggle analytics cookies");
    await user.click(analyticsToggle);

    expect(analyticsToggle).not.toBeChecked();
  });

  it("toggles marketing on when clicked", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences />);

    const marketingToggle = screen.getByLabelText("Toggle marketing cookies");
    await user.click(marketingToggle);

    expect(marketingToggle).toBeChecked();
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
