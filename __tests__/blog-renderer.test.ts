import { renderMarkdown } from "@/lib/blog";

describe("renderMarkdown", () => {
  it("renders h2 and h3 headings", () => {
    expect(renderMarkdown("## Heading Two")).toBe("<h2>Heading Two</h2>");
    expect(renderMarkdown("### Heading Three")).toBe("<h3>Heading Three</h3>");
  });

  it("renders bold, italic, inline code, and links within a paragraph", () => {
    const html = renderMarkdown(
      "Some *italic* and **bold** and `code` and a [link](https://example.com)."
    );
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<code>code</code>");
    expect(html).toContain('<a href="https://example.com">link</a>');
  });

  it("does not mangle bold text into nested italics", () => {
    const html = renderMarkdown("This is **fully bold** text.");
    expect(html).toBe("<p>This is <strong>fully bold</strong> text.</p>");
    expect(html).not.toContain("<em>");
  });

  it("renders unordered lists", () => {
    const html = renderMarkdown("- First item\n- Second item");
    expect(html).toBe("<ul><li>First item</li><li>Second item</li></ul>");
  });

  it("renders ordered lists", () => {
    const html = renderMarkdown("1. Step one\n2. Step two");
    expect(html).toBe("<ol><li>Step one</li><li>Step two</li></ol>");
  });

  it("joins multi-line paragraphs with a space", () => {
    const html = renderMarkdown("Line one\nstill the same paragraph.");
    expect(html).toBe("<p>Line one still the same paragraph.</p>");
  });

  it("separates blank-line-delimited blocks into distinct paragraphs", () => {
    const html = renderMarkdown("First paragraph.\n\nSecond paragraph.");
    expect(html).toBe("<p>First paragraph.</p>\n<p>Second paragraph.</p>");
  });

  it("escapes raw HTML instead of executing or injecting it", () => {
    const html = renderMarkdown("<script>alert('xss')</script> should be inert.");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes HTML inside list items too", () => {
    const html = renderMarkdown("- <img src=x onerror=alert(1)>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});
