import { render, screen } from "@testing-library/react";
import { FeatureCard } from "@/components/ui/FeatureCard";

describe("FeatureCard", () => {
  it("renders the title and description", () => {
    render(
      <FeatureCard
        icon="developer_mode"
        title="Web Development"
        description="Scalable, high-performance web applications."
      />
    );

    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(
      screen.getByText("Scalable, high-performance web applications.")
    ).toBeInTheDocument();
  });

  it("renders the title as a heading", () => {
    render(
      <FeatureCard
        icon="architecture"
        title="Editorial Design"
        description="Elevating brand identity."
      />
    );

    expect(
      screen.getByRole("heading", { name: "Editorial Design" })
    ).toBeInTheDocument();
  });

  it("hides decorative icons from assistive technology", () => {
    const { container } = render(
      <FeatureCard
        icon="hub"
        title="Digital Coaching"
        description="Empowering your team."
      />
    );

    const icon = container.querySelector(".material-symbols-outlined");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders optional decoration content when provided", () => {
    render(
      <FeatureCard
        icon="hub"
        title="Digital Coaching"
        description="Empowering your team."
        decoration={<span data-testid="decoration">hub</span>}
      />
    );

    expect(screen.getByTestId("decoration")).toBeInTheDocument();
  });

  it("applies dark variant styling", () => {
    const { container } = render(
      <FeatureCard
        icon="architecture"
        title="Editorial Design"
        description="Elevating brand identity."
        variant="dark"
      />
    );

    expect(container.firstChild).toHaveClass("bg-primary-container");
  });
});
