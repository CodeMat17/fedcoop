import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FEDCOOP | Mission, Vision & Services",
  description:
    "Learn about FEDCOOP — our mission, vision, values, services, and the cooperative federation that empowers cooperative societies across Nigeria. Together, we prosper.",
  openGraph: {
    title: "About FEDCOOP | Our Mission & Vision",
    description:
      "Federal Civil Service Staff of Nigeria Cooperative Societies. We provide advocacy, capacity building, financial support, and digital transformation for cooperative societies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About FEDCOOP | Mission & Values",
    description:
      "Explore the vision, mission, and services of FEDCOOP — uniting cooperative societies across Nigeria for shared progress.",
  },
};

export default function AboutFedCoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
