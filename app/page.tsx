'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import TokenTable, { TokenData } from '@/components/TokenTable';
import Leaderboard from '@/components/Leaderboard';
import GainersLosersView from '@/components/GainersLosersView';
import ClosestToATHView from '@/components/ClosestToATHView';
import { TokenCategory, Chain } from '@/lib/helius';
import { loadWatchlist } from '@/lib/watchlist';

type CategoryFilter = TokenCategory | 'all';
type ChainFilter = Chain | 'all';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Get filters from URL
  const categoryFilter = (searchParams.get('category') as CategoryFilter) || 'all';
  const chainFilter = (searchParams.get('chain') as ChainFilter) || 'all';
  const showLeaderboard = searchParams.get('leaderboard') !== 'false';
  const viewMode = searchParams.get('view') || 'table';

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

  const handleViewGainersLosers = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'gainers-losers');
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const handleViewClosestATH = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'closest-ath');
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const handleBackToTable = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  }, [router, searchParams]);

  return (
    <>
      {/* Leaderboard Section */}
      {showLeaderboard && allTokens.length > 0 && viewMode === 'table' && (
        <div className="w-full max-w-6xl animate-fade-in-up mb-4" style={{ animationDelay: '0.1s' }}>
          <Leaderboard
            tokens={allTokens}
            onTokenClick={handleTokenSelect}
            onViewGainersLosers={handleViewGainersLosers}
            onViewClosestATH={handleViewClosestATH}
          />
        </div>
      )}

      <main className="w-full max-w-full xl:max-w-[1700px] flex items-start justify-center animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: '0.2s', opacity: 0 }}>
        {viewMode === 'table' && (
          <TokenTable
            showWatchlistOnly={false}
            onWatchlistChange={handleWatchlistChange}
            categoryFilter={categoryFilter}
            chainFilter={chainFilter}
            onTokensLoaded={handleTokensLoaded}
            onTokenSelect={handleTokenSelect}
          />
        )}
        {viewMode === 'gainers-losers' && (
          <GainersLosersView
            tokens={allTokens}
            onBack={handleBackToTable}
          />
        )}
        {viewMode === 'closest-ath' && (
          <ClosestToATHView
            tokens={allTokens}
            onBack={handleBackToTable}
          />
        )}
      </main>
    </>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="w-full max-w-6xl flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </MainLayout>
  );
}
