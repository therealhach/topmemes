import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Tracker - Monitor Your Solana Holdings',
  description: 'Track your Solana memecoin portfolio in real-time. Connect your Phantom wallet to see your holdings, balances, and total portfolio value. View swap history and token performance.',
  keywords: ['solana portfolio', 'crypto portfolio tracker', 'memecoin holdings', 'wallet tracker', 'phantom wallet', 'solana holdings'],
  openGraph: {
    title: 'Portfolio Tracker - Monitor Your Solana Holdings',
    description: 'Track your Solana memecoin portfolio in real-time. Connect your wallet to see holdings and swap history.',
    url: 'https://www.topmemes.io/portfolio',
  },
  alternates: {
    canonical: 'https://www.topmemes.io/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
