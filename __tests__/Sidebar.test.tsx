import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-support/test-utils";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";

const items: SidebarItem[] = [
  { label: "Overview", href: "/client-portal", icon: "dashboard" },
  { label: "Projects", href: "/client-portal#projects", icon: "folder" },
];

describe("Sidebar", () => {
  it("renders all provided navigation items", () => {
    render(<Sidebar items={items} activeHref="/client-portal" />);

    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
  });

  it("marks the active item with aria-current", () => {
    render(<Sidebar items={items} activeHref="/client-portal" />);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the optional brand label when provided", () => {
    render(
      <Sidebar items={items} activeHref="/client-portal" brandLabel="Client Portal" />
    );

    expect(screen.getByText("Client Portal")).toBeInTheDocument();
  });

  it("exposes a labeled navigation landmark", () => {
    render(<Sidebar items={items} activeHref="/client-portal" />);

    expect(screen.getByRole("navigation", { name: "Sidebar" })).toBeInTheDocument();
  });
});
