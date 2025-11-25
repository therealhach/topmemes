'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import TokenTable, { TokenData } from '@/components/TokenTable';
import Leaderboard from '@/components/Leaderboard';
import { loadWatchlist } from '@/lib/watchlist';

export default function WatchlistPage() {
  const router = useRouter();
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    setWatchlistCount(loadWatchlist().length);
  }, []);

  const handleWatchlistChange = useCallback(() => {
    setWatchlistCount(loadWatchlist().length);
  }, []);

  const handleTokensLoaded = useCallback((tokens: TokenData[]) => {
    setAllTokens(tokens);
  }, []);

  const handleTokenSelect = useCallback((token: TokenData) => {
    router.push(`/token/${token.address}`);
  }, [router]);

  return (
    <MainLayout>
      {allTokens.length > 0 && (
        <div className="w-full max-w-6xl animate-fade-in-up mb-4" style={{ animationDelay: '0.1s' }}>
          <Leaderboard
            tokens={allTokens}
            onTokenClick={handleTokenSelect}
            onViewGainersLosers={() => router.push('/?view=gainers-losers')}
            onViewClosestATH={() => router.push('/?view=closest-ath')}
          />
        </div>
      )}

      <main className="w-full max-w-full xl:max-w-[1700px] flex items-start justify-center animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <TokenTable
          showWatchlistOnly={true}
          onWatchlistChange={handleWatchlistChange}
          categoryFilter="all"
          chainFilter="all"
          onTokensLoaded={handleTokensLoaded}
          onTokenSelect={handleTokenSelect}
        />
      </main>
    </MainLayout>
  );
}
