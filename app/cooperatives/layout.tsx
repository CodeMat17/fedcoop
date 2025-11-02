import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Member Cooperatives - FEDCOOP | Member Societies",
  description:
    "Discover the diverse network of cooperative societies that make up FEDCOOP - Federation of Federal Government Staff Cooperative Societies. Browse our active and registered member cooperatives across Nigeria.",
  openGraph: {
    title: "FEDCOOP Member Cooperatives - Our Network",
    description:
      "Explore the community of cooperative societies working together for mutual benefit. Join our federation of federal government staff cooperatives.",
  },
  twitter: {
    title: "FEDCOOP Member Cooperatives - Our Network",
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
