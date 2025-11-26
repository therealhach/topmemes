'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import Heatmap from '@/components/Heatmap';
import { getMemeTokensData, MemeTokenData } from '@/lib/helius';

// Note: Metadata is exported from a separate layout.tsx file for client components

export default function HeatmapPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<MemeTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const data = await getMemeTokensData();
        setTokens(data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
    // Refresh every 30 seconds for live feel
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTokenClick = useCallback((token: MemeTokenData) => {
    router.push(`/token/${token.address}`);
  }, [router]);

  return (
    <MainLayout>
      <main className="w-full max-w-7xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading heatmap...</p>
            </div>
          </div>
        ) : (
          <Heatmap tokens={tokens} onTokenClick={handleTokenClick} />
        )}
      </main>
    </MainLayout>
  );
}
