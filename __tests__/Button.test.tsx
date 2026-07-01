import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders as a link when href is provided", () => {
    render(<Button href="/contact">Contact Us</Button>);

    const link = screen.getByRole("link", { name: "Contact Us" });
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("renders as a native button when href is omitted", () => {
    render(<Button>Submit</Button>);

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("fires onClick handlers when rendered as a button", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders an icon when provided", () => {
    const { container } = render(
      <Button href="/solutions" icon="arrow_forward">
        View Solutions
      </Button>
    );

    expect(container.querySelector(".material-symbols-outlined")).toBeInTheDocument();
  });

  it("respects the disabled attribute on native buttons", () => {
    render(<Button disabled>Sending...</Button>);

    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
  });

  it("applies secondary variant styling", () => {
    render(<Button href="/about" variant="secondary">Learn More</Button>);

    const link = screen.getByRole("link", { name: "Learn More" });
    expect(link).toHaveClass("border");
  });
});
