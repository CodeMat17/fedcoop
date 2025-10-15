import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Executives - FedCoop | Leadership Team",
  description:
    "Meet the dedicated executive team of FedCoop - Federation of Federal Government Staff Cooperative Societies. Our leaders serve with integrity, transparency, and commitment to our members.",
  openGraph: {
    title: "FedCoop Executives - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FedCoop's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
  twitter: {
    title: "FedCoop Executives - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FedCoop's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
};

export default function ExecutivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
