'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import TokenDetailView from '@/components/TokenDetailView';
import { getMemeTokensData } from '@/lib/helius';
import { TokenData } from '@/components/TokenTable';

// Calculate percent to gain to reach ATH
function calculatePercentToGainPeak(price: number | undefined, athPrice: number): number {
  if (!price || price === 0 || !athPrice) return 0;
  return ((athPrice - price) / price) * 100;
}

export default function TokenDetailPage() {
  const router = useRouter();
  const params = useParams();
  const address = params.address as string;

  const [token, setToken] = useState<TokenData | null>(null);
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTokens() {
      try {
        const tokens = await getMemeTokensData();

        // Add percentToGainPeak to each token
        const tokensWithPercent: TokenData[] = tokens.map(t => ({
          ...t,
          id: 0, // Add missing id field
          percentToGainPeak: calculatePercentToGainPeak(t.price, t.athPrice),
        })) as TokenData[];

        setAllTokens(tokensWithPercent);

        // Find the token by address
        const foundToken = tokensWithPercent.find(t => t.address === address);
        if (foundToken) {
          setToken(foundToken);
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTokens();
  }, [address]);

  const handleTokenSelect = useCallback((selectedToken: TokenData) => {
    router.push(`/token/${selectedToken.address}`);
  }, [router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full max-w-6xl flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!token) {
    return (
      <MainLayout>
        <div className="w-full max-w-6xl text-center py-20">
          <h2 className="text-xl font-bold text-white mb-2">Token not found</h2>
          <p className="text-gray-400 mb-4">The token you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Go back home
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="w-full max-w-full xl:max-w-[1700px] flex items-start justify-center animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <TokenDetailView
          token={token}
          onBack={() => router.push('/')}
          allTokens={allTokens}
          onTokenSelect={handleTokenSelect}
        />
      </main>
    </MainLayout>
  );
}
