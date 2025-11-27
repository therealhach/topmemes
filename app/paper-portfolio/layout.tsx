import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paper Portfolio | TopMemes.io - Track Memecoin ATH Returns',
  description: 'Create a paper portfolio to track potential returns if your favorite memecoins reach their all-time highs. Simulate investments without real money.',
  keywords: ['paper portfolio', 'memecoin tracker', 'ATH calculator', 'crypto simulator', 'solana memecoins'],
};

export default function PaperPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
