/**
 * Sets the .dark class on <html> before first paint, so the page
 * never flashes the light theme before JS hydrates and corrects it.
 * This has to run as a genuinely blocking inline script (not a React
 * effect, which only runs after hydration) - see its use in
 * app/layout.tsx via next/script with strategy="beforeInteractive".
 *
 * Kept as a small standalone string (not a .tsx component) because
 * inline scripts can't import anything - this needs to be completely
 * self-contained.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("jgct-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;
