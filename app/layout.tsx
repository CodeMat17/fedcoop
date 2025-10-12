import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "FedCoop - Federation of Federal Government Staff Cooperative Societies",
  description:
    "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment. A Cooperative Nigeria without Hunger & Poverty.",
  keywords: [
    "FedCoop",
    "Federation",
    "Cooperative",
    "Nigeria",
    "Federal Government",
    "Staff Cooperative",
    "MDAs",
    "Workers Cooperative",
    "Economic Development",
    "NNPC",
    "CBN",
    "EFCC",
    "Federal Ministry",
    "Agriculture",
    "Trade",
    "Investment",
  ],
  authors: [{ name: "FedCoop" }],
  creator: "FedCoop",
  publisher: "FedCoop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://fedcoop.ng",
    title:
      "FedCoop - Federation of Federal Government Staff Cooperative Societies",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    siteName: "FedCoop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FedCoop - Federation of Federal Government Staff Cooperative Societies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "FedCoop - Federation of Federal Government Staff Cooperative Societies",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://fedcoop.ng",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <ConvexClientProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
