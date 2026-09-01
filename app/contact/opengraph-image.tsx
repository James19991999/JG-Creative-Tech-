import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "Contact JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "GET IN TOUCH",
    title: "Let's talk about what you're building",
  });
}
