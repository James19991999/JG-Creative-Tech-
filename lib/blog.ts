import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601
  author: string;
  category: string;
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

function computeReadingTime(markdownBody: string): number {
  const words = markdownBody.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders inline markdown (bold, italic, inline code, links) within a
 * single line of already-escaped text. Order matters: bold (**) is
 * matched before italic (*) so a bold run's asterisks aren't
 * mistaken for two separate italic runs.
 */
function renderInline(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

/**
 * Minimal, dependency-free markdown renderer covering exactly what
 * this project's posts use: h2/h3 headings, paragraphs, bold/italic/
 * inline-code/links, and unordered/ordered lists. Deliberately not a
 * full CommonMark implementation - if a future post needs tables,
 * nested lists, or images, extend this rather than reaching for a
 * heavier dependency, unless the need genuinely outgrows it.
 */
export function renderMarkdown(markdownBody: string): string {
  const blocks = markdownBody.trim().split(/\n\s*\n/);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    if (lines[0].startsWith("## ")) {
      html.push(`<h2>${renderInline(escapeHtml(lines[0].slice(3)))}</h2>`);
      continue;
    }
    if (lines[0].startsWith("### ")) {
      html.push(`<h3>${renderInline(escapeHtml(lines[0].slice(4)))}</h3>`);
      continue;
    }

    const isUnorderedList = lines.every((l) => /^[-*]\s/.test(l));
    if (isUnorderedList) {
      const items = lines
        .map((l) => `<li>${renderInline(escapeHtml(l.replace(/^[-*]\s/, "")))}</li>`)
        .join("");
      html.push(`<ul>${items}</ul>`);
      continue;
    }

    const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l));
    if (isOrderedList) {
      const items = lines
        .map((l) => `<li>${renderInline(escapeHtml(l.replace(/^\d+\.\s/, "")))}</li>`)
        .join("");
      html.push(`<ol>${items}</ol>`);
      continue;
    }

    html.push(`<p>${renderInline(escapeHtml(lines.join(" ")))}</p>`);
  }

  return html.join("\n");
}

/**
 * Reads and parses every .md file in content/blog at build time (this
 * runs in generateStaticParams / Server Components only - never
 * shipped to the client). Frontmatter drives listing metadata; the
 * body is rendered to HTML once here rather than per-request.
 */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      author: (data.author as string) ?? "JG Creative Tech Solution",
      category: data.category as string,
      readingTimeMinutes: computeReadingTime(content),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    author: (data.author as string) ?? "JG Creative Tech Solution",
    category: data.category as string,
    readingTimeMinutes: computeReadingTime(content),
    html: renderMarkdown(content),
  };
}
