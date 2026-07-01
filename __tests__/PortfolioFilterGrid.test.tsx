import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PortfolioFilterGrid } from "@/components/PortfolioFilterGrid";
import type { PortfolioProject } from "@/lib/portfolio";

const projects: PortfolioProject[] = [
  {
    slug: "sammy-dylax-logistics",
    name: "Sammy Dylax Logistics",
    client: "Sammy Dylax",
    category: "Infrastructure & Custom SaaS",
    tagline: "Fleet Management",
    heroImage: "https://example.com/a.jpg",
    heroImageAlt: "alt a",
    summary: "summary",
    challenge: "challenge",
    approach: "approach",
    outcome: "outcome",
    stats: [],
    services: [],
  },
  {
    slug: "gm-global-ventures",
    name: "GM Global Ventures",
    client: "GM Global",
    category: "Brand Identity & Web Ecosystem",
    tagline: "Brand refresh",
    heroImage: "https://example.com/b.jpg",
    heroImageAlt: "alt b",
    summary: "summary",
    challenge: "challenge",
    approach: "approach",
    outcome: "outcome",
    stats: [],
    services: [],
  },
];

describe("PortfolioFilterGrid", () => {
  it("renders all projects under the default 'All Projects' filter", () => {
    render(<PortfolioFilterGrid projects={projects} />);

    expect(screen.getByRole("link", { name: /Sammy Dylax Logistics/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GM Global Ventures/ })).toBeInTheDocument();
  });

  it("links each project card to its case study page", () => {
    render(<PortfolioFilterGrid projects={projects} />);

    const link = screen.getByRole("link", { name: /Sammy Dylax Logistics/ });
    expect(link).toHaveAttribute("href", "/portfolio/sammy-dylax-logistics");
  });

  it("filters projects when a category tab is selected", async () => {
    const user = userEvent.setup();
    render(<PortfolioFilterGrid projects={projects} />);

    await user.click(screen.getByRole("tab", { name: "Branding" }));

    expect(screen.getByRole("link", { name: /GM Global Ventures/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Sammy Dylax Logistics/ })).not.toBeInTheDocument();
  });

  it("shows an empty state with a contact link when no projects match", async () => {
    const user = userEvent.setup();
    render(<PortfolioFilterGrid projects={[]} />);

    await user.click(screen.getByRole("tab", { name: "SaaS" }));

    expect(screen.getByText(/No projects in this category yet/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tell us what you're building/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("marks the active filter tab with aria-selected", async () => {
    const user = userEvent.setup();
    render(<PortfolioFilterGrid projects={projects} />);

    const allTab = screen.getByRole("tab", { name: "All Projects" });
    expect(allTab).toHaveAttribute("aria-selected", "true");

    const brandingTab = screen.getByRole("tab", { name: "Branding" });
    await user.click(brandingTab);

    expect(brandingTab).toHaveAttribute("aria-selected", "true");
    expect(allTab).toHaveAttribute("aria-selected", "false");
  });
});
