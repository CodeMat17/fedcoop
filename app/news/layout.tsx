import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest News & Updates - FedCoop | Cooperative News",
  description:
    "Stay informed about the latest developments in the cooperative movement. Read news, updates, and announcements from FedCoop - Federation of Federal Government Staff Cooperative Societies.",
  openGraph: {
    title: "FedCoop News & Updates - Latest Cooperative News",
    description:
      "Discover the latest news and developments from FedCoop and the cooperative movement in Nigeria. Stay connected with our community.",
  },
  twitter: {
    title: "FedCoop News & Updates - Latest Cooperative News",
    description:
      "Discover the latest news and developments from FedCoop and the cooperative movement in Nigeria. Stay connected with our community.",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
