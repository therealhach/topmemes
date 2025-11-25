import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memecoin Prices, Token Market Caps, and Analytics | TopMemes.io",
  description: "Track top meme tokens on Crypto with real-time prices, market caps, and analytics. Discover trending memecoins and make informed investment decisions.",
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
