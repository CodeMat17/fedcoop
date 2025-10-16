import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FedCoop | Mission, Vision & Services",
  description:
    "Learn about FedCoop — our mission, vision, values, services, and the cooperative federation that empowers cooperative societies across Nigeria. Together, we prosper.",
  openGraph: {
    title: "About FedCoop | Our Mission & Vision",
    description:
      "FedCoop is the federation of federal government staff cooperatives in Nigeria. We provide advocacy, capacity building, financial support, and digital transformation for cooperative societies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About FedCoop | Mission & Values",
    description:
      "Explore the vision, mission, and services of FedCoop — uniting cooperative societies across Nigeria for shared progress.",
  },
};

export default function AboutFedCoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
