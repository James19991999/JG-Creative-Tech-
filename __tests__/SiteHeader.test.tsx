import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders the wordmark linking to home", () => {
    render(<SiteHeader />);

    const wordmark = screen.getByRole("link", { name: "JG Creative Tech" });
    expect(wordmark).toHaveAttribute("href", "/");
  });

  it("renders all primary navigation links in the desktop nav", () => {
    render(<SiteHeader />);

    const desktopNav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(desktopNav).getByRole("link", { name: "Solutions" })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: "Portfolio" })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renders the primary call to action", () => {
    render(<SiteHeader />);

    const cta = screen.getByRole("link", { name: "Get Started" });
    expect(cta).toHaveAttribute("href", "/schedule-consultation");
  });

  it("marks the active link with aria-current in the desktop nav", () => {
    render(<SiteHeader activeHref="/about" />);

    const desktopNav = screen.getByRole("navigation", { name: "Primary" });
    const aboutLink = within(desktopNav).getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive links with aria-current in the desktop nav", () => {
    render(<SiteHeader activeHref="/about" />);

    const desktopNav = screen.getByRole("navigation", { name: "Primary" });
    const solutionsLink = within(desktopNav).getByRole("link", { name: "Solutions" });
    expect(solutionsLink).not.toHaveAttribute("aria-current");
  });

  it("exposes a labeled navigation landmark", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("hides the mobile drawer by default", () => {
    const { container } = render(<SiteHeader />);

    const drawer = container.querySelector("#mobile-nav-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the mobile drawer when the hamburger button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const drawer = container.querySelector("#mobile-nav-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "false");
  });

  it("exposes pages not reachable from the bottom nav inside the drawer", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const drawer = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(drawer).getByRole("link", { name: "Digital Architecture" })).toHaveAttribute(
      "href",
      "/digital-architecture"
    );
    expect(within(drawer).getByRole("link", { name: "Innovation Lab" })).toHaveAttribute(
      "href",
      "/innovation-lab"
    );
    expect(within(drawer).getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/legal/privacy"
    );
  });

  it("closes the drawer when the hamburger is toggled again", async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteHeader />);

    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(toggle);
    expect(container.querySelector("#mobile-nav-drawer")).toHaveAttribute(
      "aria-hidden",
      "false"
    );

    await user.click(screen.getByRole("button", { name: "Close navigation menu" }));
    expect(container.querySelector("#mobile-nav-drawer")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
});
