import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "Insights - JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "INSIGHTS",
    title: "Field notes from the build",
  });
}
