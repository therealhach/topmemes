'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import PortfolioView from '@/components/PortfolioView';
import { getMemeTokensData } from '@/lib/helius';
import { TokenData } from '@/components/TokenTable';

export default function PortfolioPage() {
  const router = useRouter();
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);

  useEffect(() => {
    async function loadTokens() {
      try {
        const tokens = await getMemeTokensData();
        setAllTokens(tokens as TokenData[]);
      } catch (error) {
        console.error('Error loading tokens:', error);
      }
    }
    loadTokens();
  }, []);

  return (
    <MainLayout>
      <main className="w-full max-w-full xl:max-w-[1700px] flex items-start justify-center animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <PortfolioView
          onBack={() => router.push('/')}
          onSelectToken={(address) => {
            router.push(`/token/${address}`);
          }}
        />
      </main>
    </MainLayout>
  );
}
