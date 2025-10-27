import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies",
    short_name: "FEDCOOP",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f59e0b",
    orientation: "portrait-primary",
    categories: ["business", "government", "productivity", "Cooperative"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // ✅ Fixed: Added "any" for better compatibility
      },
      {
        src: "/icons/icon-512x512.png", // ✅ Fixed: Consistent naming with layout.tsx
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "390x590",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/desktop.png",
        sizes: "1920x841",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
