import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Watchlist - Track Your Favorite Memecoins',
  description: 'Create and manage your personal memecoin watchlist. Monitor your favorite Solana tokens with real-time prices, market caps, and performance metrics.',
  keywords: ['crypto watchlist', 'memecoin tracker', 'token watchlist', 'solana watchlist', 'favorite tokens'],
  openGraph: {
    title: 'My Watchlist - Track Your Favorite Memecoins',
    description: 'Create and manage your personal memecoin watchlist with real-time prices and performance metrics.',
    url: 'https://www.topmemes.io/watchlist',
  },
  alternates: {
    canonical: 'https://www.topmemes.io/watchlist',
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
