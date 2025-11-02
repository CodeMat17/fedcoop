import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FEDCOOP Events | Conferences & Activities",
  description:
    "Stay updated with FEDCOOP’s upcoming events, conferences, workshops, and activities that bring cooperative societies together across Nigeria.",
  openGraph: {
    title: "FEDCOOP Events & Activities",
    description:
      "Explore FEDCOOP’s schedule of events, workshops, and conferences aimed at empowering cooperative societies across Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FEDCOOP Events & Activities",
    description:
      "Check out upcoming events, workshops, and conferences hosted by FEDCOOP for cooperative societies across Nigeria.",
  },
};

export default function AboutFEDCOOPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
