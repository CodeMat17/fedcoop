import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FedCoop Events | Conferences & Activities",
  description:
    "Stay updated with FedCoop’s upcoming events, conferences, workshops, and activities that bring cooperative societies together across Nigeria.",
  openGraph: {
    title: "FedCoop Events & Activities",
    description:
      "Explore FedCoop’s schedule of events, workshops, and conferences aimed at empowering cooperative societies across Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FedCoop Events & Activities",
    description:
      "Check out upcoming events, workshops, and conferences hosted by FedCoop for cooperative societies across Nigeria.",
  },
};

export default function AboutFedCoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
