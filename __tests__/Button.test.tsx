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

  it("applies a magnetic transform toward the cursor on primary buttons", () => {
    render(<Button href="/contact">Get Started</Button>);
    const link = screen.getByRole("link", { name: "Get Started" });

    jest.spyOn(link, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 40,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(link, { clientX: 70, clientY: 20 });
    // cursor is 20px right of center (70 - 50) and 0px vertically off
    // (20 - 20); strength 0.25 -> expect a rightward pull, no vertical
    expect(link.style.transform).toBe("translate(5px, 0px)");
  });

  it("resets the magnetic transform when the cursor leaves", () => {
    render(<Button href="/contact">Get Started</Button>);
    const link = screen.getByRole("link", { name: "Get Started" });

    jest.spyOn(link, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 40,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(link, { clientX: 70, clientY: 20 });
    fireEvent.mouseLeave(link);
    expect(link.style.transform).toBe("translate(0px, 0px)");
  });

  it("does not apply a magnetic transform on secondary/tertiary buttons", () => {
    render(
      <Button href="/about" variant="secondary">
        Learn More
      </Button>
    );
    const link = screen.getByRole("link", { name: "Learn More" });
    expect(link.style.transform).toBe("");
  });
});
