import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";
import { getPortfolioProject, portfolioProjects } from "@/lib/portfolio";

export const size = ogImageSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const project = getPortfolioProject(params.slug);

  return renderOgImage({
    kicker: project?.category?.toUpperCase() ?? "PORTFOLIO",
    title: project?.name ?? "Portfolio",
  });
}
