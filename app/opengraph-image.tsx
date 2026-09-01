import { renderOgImage, ogImageSize, ogContentType } from "@/lib/og-template";

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = "JG Creative Tech Solution";

export default function Image() {
  return renderOgImage({
    kicker: "DIGITAL INFRASTRUCTURE",
    title: "Future-ready technology for Kenyan SMEs",
  });
}
