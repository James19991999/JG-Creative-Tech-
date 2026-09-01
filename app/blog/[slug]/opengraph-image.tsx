import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const size = ogImageSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  return renderOgImage({
    kicker: post?.category?.toUpperCase() ?? "INSIGHTS",
    title: post?.title ?? "Insights",
  });
}
