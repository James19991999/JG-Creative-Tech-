import { getAllPosts, getPostBySlug } from "@/lib/blog";

describe("getAllPosts", () => {
  it("finds every markdown file in content/blog", () => {
    const posts = getAllPosts();
    expect(posts.length).toBe(3);
  });

  it("sorts posts newest first", () => {
    const posts = getAllPosts();
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("parses required frontmatter fields for every post", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.category).toBeTruthy();
      expect(post.readingTimeMinutes).toBeGreaterThan(0);
    }
  });

  it("derives the slug from the filename", () => {
    const posts = getAllPosts();
    const slugs = posts.map((p) => p.slug);
    expect(slugs).toContain("infrastructure-vs-websites");
    expect(slugs).toContain("sammy-dylax-case-study");
    expect(slugs).toContain("hidden-cost-cheap-hosting");
  });
});

describe("getPostBySlug", () => {
  it("returns null for a slug that doesn't exist", () => {
    expect(getPostBySlug("does-not-exist")).toBeNull();
  });

  it("returns the full post with rendered HTML for a real slug", () => {
    const post = getPostBySlug("infrastructure-vs-websites");
    expect(post).not.toBeNull();
    expect(post?.title).toBe(
      "Why Kenyan SMEs Need Real Infrastructure, Not Just a Website"
    );
    expect(post?.html).toContain("<h2");
    expect(post?.html).toContain("<p>");
  });

  it("renders markdown emphasis and links to real HTML tags", () => {
    const post = getPostBySlug("hidden-cost-cheap-hosting");
    expect(post?.html).toMatch(/<strong>/);
  });
});
