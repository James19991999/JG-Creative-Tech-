import { renderWithIntl, screen } from "@/test-support/test-utils";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { usePathname } from "@/i18n/navigation";

jest.mock("@/i18n/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;

describe("WhatsAppButton", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/");
  });

  it("renders a link to wa.me with the configured phone number", () => {
    renderWithIntl(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
  });

  it("includes a pre-filled default message in the link", () => {
    renderWithIntl(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    const href = link.getAttribute("href")!;
    expect(href).toContain("text=");
    const url = new URL(href);
    expect(url.searchParams.get("text")).toBeTruthy();
  });

  it("opens in a new tab safely (noopener noreferrer)", () => {
    renderWithIntl(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders on ordinary marketing pages", () => {
    mockedUsePathname.mockReturnValue("/about");
    renderWithIntl(<WhatsAppButton />);
    expect(screen.getByRole("link", { name: "Chat with us on WhatsApp" })).toBeInTheDocument();
  });

  it("is hidden on the discovery funnel step", () => {
    mockedUsePathname.mockReturnValue("/get-started/discovery");
    renderWithIntl(<WhatsAppButton />);
    expect(
      screen.queryByRole("link", { name: "Chat with us on WhatsApp" })
    ).not.toBeInTheDocument();
  });

  it("is hidden on the schedule-consultation funnel step", () => {
    mockedUsePathname.mockReturnValue("/schedule-consultation");
    renderWithIntl(<WhatsAppButton />);
    expect(
      screen.queryByRole("link", { name: "Chat with us on WhatsApp" })
    ).not.toBeInTheDocument();
  });
});
