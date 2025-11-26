import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";
import { WebsiteJsonLd, OrganizationJsonLd, FAQJsonLd } from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://www.topmemes.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TopMemes.io - Live Memecoin Prices, Charts & Solana Token Tracker",
    template: "%s | TopMemes.io",
  },
  description: "Track trending Solana memecoins with real-time prices, market caps, 24h volume, and interactive charts. Swap tokens via Jupiter DEX, monitor your portfolio, and discover the next 100x meme coin.",
  keywords: [
    "memecoin",
    "meme coin",
    "solana memecoins",
    "crypto memes",
    "meme token tracker",
    "solana token prices",
    "dexscreener alternative",
    "jupiter swap",
    "solana dex",
    "dogwifhat",
    "bonk",
    "pepe solana",
    "meme coin prices",
    "crypto heatmap",
    "solana portfolio tracker",
    "memecoin analytics",
    "trending memecoins",
    "best meme coins",
    "new meme coins",
    "meme coin market cap",
  ],
  authors: [{ name: "TopMemes.io" }],
  creator: "TopMemes.io",
  publisher: "TopMemes.io",
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
    locale: "en_US",
    url: siteUrl,
    siteName: "TopMemes.io",
    title: "TopMemes.io - Live Memecoin Prices, Charts & Solana Token Tracker",
    description: "Track trending Solana memecoins with real-time prices, market caps, and interactive charts. Swap tokens via Jupiter DEX and discover the next 100x meme coin.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TopMemes.io - Solana Memecoin Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopMemes.io - Live Memecoin Prices & Solana Token Tracker",
    description: "Track trending Solana memecoins with real-time prices, market caps, and charts. Swap via Jupiter DEX.",
    images: ["/og-image.png"],
    creator: "@topmemes_io",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "cryptocurrency",
  classification: "Cryptocurrency Tracking",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/garet" rel="stylesheet" />
        <link rel="preconnect" href="https://api.dexscreener.com" />
        <link rel="preconnect" href="https://pro-api.coingecko.com" />
        <link rel="dns-prefetch" href="https://api.dexscreener.com" />
        <link rel="dns-prefetch" href="https://pro-api.coingecko.com" />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <FAQJsonLd />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
