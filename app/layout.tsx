import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Viewport, Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fedcoop.org"),
  title: {
    default:
      "FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies",
    template: "%s | FEDCOOP",
  },
  description:
    "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment. A Cooperative Nigeria without Hunger & Poverty.",
  applicationName: "FEDCOOP",
  keywords: [
    "FedCoop",
    "FEDCOOP",
    "Federation of Federal Cooperatives",
    "Cooperative Society Nigeria",
    "Federal Government Cooperatives",
    "Staff Cooperative",
    "MDAs Cooperative",
    "Workers Cooperative",
    "Economic Development Nigeria",
    "NNPC Cooperative",
    "CBN Cooperative",
    "Federal Ministry Cooperative",
    "Cooperative Investment",
    "Cooperative Training",
    "Abuja Cooperative",
    "NFVCB Cooperative",
  ],
  authors: [{ name: "FedCoop", url: "https://www.fedcoop.org" }],
  creator: "FEDCOOP",
  publisher: "FEDCOOP",
  category: "Organization",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    url: "https://www.fedcoop.org",
    title:
      "FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    siteName: "FedCoop",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies",
    description:
      "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
    images: ["/opengraph-image.jpg"],
    creator: "@FEDCOOP_ng",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" }, // ✅ Fixed: Consistent naming
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, // ✅ Fixed: Removed duplicate
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FEDCOOP",
  },
  alternates: {
    canonical: "https://www.fedcoop.org",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f59e0b",
  colorScheme: "light",
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
          <ClerkProvider>
            <ConvexClientProvider>
              <Navigation />
              <main>{children}</main>
              <Footer />
              <Toaster />
              <PWAInstallPrompt />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
