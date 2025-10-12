import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FedCoop - Federation of Federal Government Staff Cooperatives",
    short_name: "FedCoop",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
