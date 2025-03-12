import type { MetadataRoute } from "next";

export const AppName = "Axolotl Time";
export const AppDescription = "Work and party with folk across the universe.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: AppName,
    short_name: "Axolotl Time",
    description: AppDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#06050d",
    theme_color: "#06050d",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
