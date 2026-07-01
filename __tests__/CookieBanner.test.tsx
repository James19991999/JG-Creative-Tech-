import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBanner } from "@/components/CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the banner when no prior consent decision exists", async () => {
    render(<CookieBanner />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("renders Accept and Decline options", async () => {
    render(<CookieBanner />);
    expect(await screen.findByRole("button", { name: "Accept all" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("links to the cookie policy", async () => {
    render(<CookieBanner />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("link", { name: "Cookie Policy" })).toHaveAttribute(
      "href",
      "/legal/cookies"
    );
  });

  it("dismisses the banner and stores consent when Accept is clicked", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(await screen.findByRole("button", { name: "Accept all" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem("jg-cookie-consent")).toBe("accepted");
  });

  it("dismisses the banner and stores decline when Decline is clicked", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(await screen.findByRole("button", { name: "Decline" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem("jg-cookie-consent")).toBe("declined");
  });

  it("does not render when consent is already stored", async () => {
    localStorage.setItem("jg-cookie-consent", "accepted");
    render(<CookieBanner />);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
