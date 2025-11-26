import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memecoin Heatmap - Visualize Crypto Market Performance',
  description: 'Interactive heatmap visualization of Solana memecoins. See market cap distribution, 1h and 24h price changes at a glance. Identify trending tokens and market movements instantly.',
  keywords: ['crypto heatmap', 'memecoin heatmap', 'solana heatmap', 'token visualization', 'market cap treemap', 'crypto market overview'],
  openGraph: {
    title: 'Memecoin Heatmap - Visualize Crypto Market Performance',
    description: 'Interactive heatmap visualization of Solana memecoins. See market cap distribution and price changes at a glance.',
    url: 'https://www.topmemes.io/heatmap',
  },
  alternates: {
    canonical: 'https://www.topmemes.io/heatmap',
  },
};

export default function HeatmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
