import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Board Directors - FEDCOOP | Leadership Team",
  description:
    "Meet the dedicated director team of FEDCOOP - Federation of Federal Government Staff Cooperative Societies. Our leaders serve with integrity, transparency, and commitment to our members.",
  openGraph: {
    title: "FEDCOOP Board of Directors - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FEDCOOP's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
  twitter: {
    title: "FEDCOOP Board of Directors - Meet Our Leadership Team",
    description:
      "Meet the dedicated leaders serving FEDCOOP's members and community with passion and expertise. Elected by our membership to guide our cooperative forward.",
  },
};

export default function DirectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
