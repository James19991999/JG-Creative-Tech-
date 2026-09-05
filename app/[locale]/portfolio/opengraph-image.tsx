import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "Portfolio - JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "PORTFOLIO",
    title: "Real systems, running in production",
  });
}
