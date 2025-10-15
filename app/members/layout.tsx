import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Member Cooperatives - FedCoop | Member Societies",
  description:
    "Discover the diverse network of cooperative societies that make up FedCoop - Federation of Federal Government Staff Cooperative Societies. Browse our active and registered member cooperatives across Nigeria.",
  openGraph: {
    title: "FedCoop Member Cooperatives - Our Network",
    description:
      "Explore the community of cooperative societies working together for mutual benefit. Join our federation of federal government staff cooperatives.",
  },
  twitter: {
    title: "FedCoop Member Cooperatives - Our Network",
    description:
      "Explore the community of cooperative societies working together for mutual benefit. Join our federation of federal government staff cooperatives.",
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
