import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Board Directors - FedCoop | Leadership Team",
  description:
    "Meet the dedicated director team of FedCoop - Federation of Federal Government Staff Cooperative Societies. Our leaders serve with integrity, transparency, and commitment to our members.",
  openGraph: {
    title: "FedCoop Board of Directors - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FedCoop's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
  twitter: {
    title: "FedCoop Board of Directors - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FedCoop's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
};

export default function DirectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
