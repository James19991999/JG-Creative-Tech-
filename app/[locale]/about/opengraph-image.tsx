import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "About JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "ABOUT",
    title: "The team behind the infrastructure",
  });
}
