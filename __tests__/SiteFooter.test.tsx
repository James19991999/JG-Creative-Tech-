import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-support/test-utils";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  footerCompanyLinks,
  footerLegalLinks,
  footerServiceLinks,
  siteConfig,
} from "@/lib/site-config";

describe("SiteFooter", () => {
  it("renders every configured service link with a working href", () => {
    render(<SiteFooter />);

    footerServiceLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href
      );
    });
  });

  it("renders every configured company link with a working href", () => {
    render(<SiteFooter />);

    footerCompanyLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href
      );
    });
  });

  it("renders every configured legal link with a working href", () => {
    render(<SiteFooter />);

    footerLegalLinks.forEach((link) => {
      // Legal labels appear once in the bottom bar; getAllByRole guards
      // against any future duplicate-label additions elsewhere in the footer.
      const matches = screen.getAllByRole("link", { name: link.label });
      expect(matches.some((el) => el.getAttribute("href") === link.href)).toBe(true);
    });
  });

  it("links the LinkedIn icon to the real profile, not a bare placeholder", () => {
    render(<SiteFooter />);

    const linkedin = screen.getByRole("link", {
      name: /linkedin/i,
    });
    expect(linkedin).toHaveAttribute("href", siteConfig.social.linkedin);
    expect(linkedin.getAttribute("href")).not.toBe("https://linkedin.com");
  });

  it("links the GitHub icon to the real profile", () => {
    render(<SiteFooter />);

    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("href", siteConfig.social.github);
  });

  it("opens external social links in a new tab safely", () => {
    render(<SiteFooter />);

    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links the email icon to a real mailto address", () => {
    render(<SiteFooter />);

    const email = screen.getByRole("link", { name: /email jg creative tech/i });
    expect(email).toHaveAttribute("href", `mailto:${siteConfig.contact.email}`);
  });

  it("does not render a placeholder phone number", () => {
    render(<SiteFooter />);

    expect(screen.queryByText(/\+254 700 000 000/)).not.toBeInTheDocument();
  });
});
