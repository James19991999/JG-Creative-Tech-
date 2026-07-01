import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JG Creative Tech Solution",
    short_name: "JG Creative Tech",
    description:
      "Premium digital infrastructure, web development, and growth strategy for Kenyan SMEs.",
    start_url: "/",
    display: "standalone",
    background_color: "#001e40",
    theme_color: "#001e40",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "technology"],
  };
}
