import "@testing-library/jest-dom";

// jsdom doesn't implement matchMedia - needed by ThemeToggle/theme-init
// (prefers-color-scheme detection) and any future prefers-reduced-motion
// checks. Defaults to "no match" (light mode / no reduced motion);
// individual tests override with their own mock when they need to
// assert dark-mode-specific behavior.
//
// Guarded because this same setup file also runs for tests that use
// `@jest-environment node` (API route handlers, which have no window
// at all) - skip this entirely there rather than crash every node-
// environment test file on import.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
