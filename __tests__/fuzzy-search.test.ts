import { fuzzyMatch, fuzzySearch } from "@/lib/fuzzy-search";

describe("fuzzyMatch", () => {
  it("matches an exact substring", () => {
    expect(fuzzyMatch("port", "Portfolio")).not.toBeNull();
  });

  it("matches a non-contiguous subsequence in order", () => {
    expect(fuzzyMatch("svcs", "Services")).not.toBeNull();
  });

  it("returns null when the characters aren't all present in order", () => {
    expect(fuzzyMatch("xyz", "Portfolio")).toBeNull();
  });

  it("returns null when characters are present but out of order", () => {
    expect(fuzzyMatch("oilfotr", "Portfolio")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(fuzzyMatch("PORT", "portfolio")).not.toBeNull();
    expect(fuzzyMatch("port", "PORTFOLIO")).not.toBeNull();
  });

  it("scores a contiguous match higher than a scattered one", () => {
    const contiguous = fuzzyMatch("port", "Portfolio")!;
    const scattered = fuzzyMatch("port", "Please open a request today")!;
    expect(contiguous).toBeGreaterThan(scattered);
  });

  it("scores a match at the start of the string higher than mid-string", () => {
    const atStart = fuzzyMatch("about", "About Us")!;
    const midString = fuzzyMatch("about", "Read more about us here")!;
    expect(atStart).toBeGreaterThan(midString);
  });

  it("returns 0 (a match, not null) for an empty query", () => {
    expect(fuzzyMatch("", "Portfolio")).toBe(0);
  });
});

describe("fuzzySearch", () => {
  const items = [
    { title: "Solutions", category: "Pages", description: "Our engineering services" },
    { title: "About Us", category: "Pages", description: "Who we are" },
    { title: "Portfolio", category: "Pages", description: "Case studies and client work" },
    {
      title: "Why Kenyan SMEs Need Real Infrastructure",
      category: "Insights",
      description: "A post about solutions and websites",
    },
  ];

  it("returns an empty array for an empty query", () => {
    expect(fuzzySearch("", items)).toEqual([]);
  });

  it("returns an empty array for whitespace-only query", () => {
    expect(fuzzySearch("   ", items)).toEqual([]);
  });

  it("finds items by title", () => {
    const results = fuzzySearch("portfolio", items);
    expect(results[0].item.title).toBe("Portfolio");
  });

  it("ranks a title match above a description-only match for the same query", () => {
    const results = fuzzySearch("solutions", items);
    expect(results[0].item.title).toBe("Solutions");
  });

  it("still finds a description-only match, just ranked lower", () => {
    const results = fuzzySearch("solutions", items);
    const titles = results.map((r) => r.item.title);
    expect(titles).toContain("Why Kenyan SMEs Need Real Infrastructure");
  });

  it("excludes items that don't match at all", () => {
    const results = fuzzySearch("zzz-no-match-zzz", items);
    expect(results).toEqual([]);
  });

  it("respects the limit parameter", () => {
    const manyItems = Array.from({ length: 20 }, (_, i) => ({
      title: `Page ${i}`,
      category: "Pages",
      description: "test page",
    }));
    const results = fuzzySearch("page", manyItems, 5);
    expect(results.length).toBe(5);
  });

  it("matches by category", () => {
    const results = fuzzySearch("insights", items);
    expect(results.map((r) => r.item.title)).toContain(
      "Why Kenyan SMEs Need Real Infrastructure"
    );
  });
});
