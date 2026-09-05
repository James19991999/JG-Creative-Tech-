import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "Solutions - JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "SOLUTIONS",
    title: "Engineering built to survive your busiest week",
  });
}
