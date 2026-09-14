import { render, screen, act } from "@testing-library/react";
import { CountUp } from "@/components/CountUp";

let intersectionCallback: (entries: { isIntersecting: boolean }[]) => void;
let rafCallbacks: FrameRequestCallback[] = [];

beforeEach(() => {
  rafCallbacks = [];

  // Full control over when "scrolled into view" fires, rather than
  // relying on jsdom's real (nonexistent) layout/scroll behavior.
  (global as any).IntersectionObserver = jest.fn().mockImplementation((callback) => {
    intersectionCallback = callback;
    return { observe: jest.fn(), disconnect: jest.fn() };
  });

  // Queue rAF callbacks instead of running them immediately, so tests
  // can advance the animation deterministically frame by frame.
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    rafCallbacks.push(cb);
    return rafCallbacks.length;
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

function flushOneFrame(time: number) {
  const callbacks = rafCallbacks.splice(0, rafCallbacks.length);
  act(() => {
    callbacks.forEach((cb) => cb(time));
  });
}

describe("CountUp", () => {
  it("renders non-numeric values statically with no animation machinery", () => {
    render(<CountUp value="Real-time" />);
    expect(screen.getByText("Real-time")).toBeInTheDocument();
    // No IntersectionObserver should even be constructed for a value
    // that can never animate.
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("starts a numeric value at zero (with the original suffix) before scrolling into view", () => {
    render(<CountUp value="25+" />);
    expect(screen.getByText("0+", { exact: true })).toBeInTheDocument();
  });

  it("does not start counting before the element intersects", () => {
    render(<CountUp value="98%" />);
    expect(rafCallbacks.length).toBe(0);
  });

  it("starts counting once it scrolls into view", () => {
    render(<CountUp value="98%" />);
    intersectionCallback([{ isIntersecting: true }]);
    expect(rafCallbacks.length).toBeGreaterThan(0);
  });

  it("lands on the exact original string once the animation completes", () => {
    render(<CountUp value="25+" />);
    intersectionCallback([{ isIntersecting: true }]);

    // First frame establishes the animation start time (elapsed = 0);
    // a second frame at t = duration (1800ms) later should push
    // progress to 1 and settle on the exact final text.
    flushOneFrame(1000);
    flushOneFrame(1000 + 1800);

    // Both the aria-hidden visible span and the sr-only span now
    // contain the same final text, so this deliberately checks for
    // at least one match rather than a single unique one.
    expect(screen.getAllByText("25+", { exact: true }).length).toBeGreaterThan(0);
  });

  it("preserves decimal precision from the original value while counting", () => {
    render(<CountUp value="4.5x" />);
    intersectionCallback([{ isIntersecting: true }]);
    flushOneFrame(1000);
    flushOneFrame(1000 + 1800);
    expect(screen.getAllByText("4.5x", { exact: true }).length).toBeGreaterThan(0);
  });

  it("does not restart the animation on a second intersection event", () => {
    render(<CountUp value="25+" />);
    intersectionCallback([{ isIntersecting: true }]);
    flushOneFrame(1000);
    flushOneFrame(1000 + 1800);
    expect(screen.getAllByText("25+", { exact: true }).length).toBeGreaterThan(0);

    // Simulate scrolling past and back into view again
    intersectionCallback([{ isIntersecting: false }]);
    intersectionCallback([{ isIntersecting: true }]);
    // No new frames should have been queued - it already ran once.
    expect(rafCallbacks.length).toBe(0);
  });

  it("jumps straight to the final value when prefers-reduced-motion is set, no animation", () => {
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(<CountUp value="98%" />);
    expect(screen.getAllByText("98%", { exact: true }).length).toBeGreaterThan(0);
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("keeps the real final value available to screen readers at all times via a visually-hidden span", () => {
    const { container } = render(<CountUp value="25+" />);
    // Before any animation starts, the visible text is "0+" but the
    // sr-only text must already say the real value - a screen reader
    // should never announce the interim "0" state.
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toHaveTextContent("25+");
  });

  it("marks the animated visible number as aria-hidden so screen readers don't read interim values", () => {
    const { container } = render(<CountUp value="25+" />);
    const visible = container.querySelector('[aria-hidden="true"]');
    expect(visible).toHaveTextContent("0+");
  });
});
