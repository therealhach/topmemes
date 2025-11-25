'use client';

import { useMemo } from 'react';
import { TokenCategory } from '@/lib/helius';

interface TokenData {
  id: number;
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  price?: number;
  currentMcap: number;
  athPrice: number;
  percentToGainPeak: number;
  oneHourChange: number;
  twentyFourHourChange: number;
  twentyFourHourVolume: number;
  category: TokenCategory;
  liquidity?: number;
}

interface LeaderboardProps {
  tokens: TokenData[];
  onTokenClick: (token: TokenData) => void;
  onViewGainersLosers?: () => void;
  onViewClosestATH?: () => void;
}

const formatPrice = (price: number): string => {
  if (price < 0.000001) return `$${price.toFixed(8)}`;
  if (price < 0.00001) return `$${price.toFixed(7)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const formatPercentage = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

interface LeaderboardCardProps {
  title: string;
  icon: React.ReactNode;
  tokens: TokenData[];
  valueKey: 'twentyFourHourChange' | 'percentToGainPeak' | 'twentyFourHourVolume';
  formatValue: (token: TokenData) => string;
  valueColor: (token: TokenData) => string;
  onTokenClick: (token: TokenData) => void;
  onViewMore?: () => void;
}

function LeaderboardCard({ title, icon, tokens, formatValue, valueColor, onTokenClick, onViewMore }: LeaderboardCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
          >
            View More
          </button>
        )}
      </div>
      <div className="space-y-2">
        {tokens.slice(0, 3).map((token, index) => (
          <div
            key={token.address}
            onClick={() => onTokenClick(token)}
            className="flex items-center justify-between p-2 rounded-lg bg-black/30 hover:bg-cyan-900/20 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-4">{index + 1}</span>
              {token.logoUrl ? (
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {token.symbol.substring(0, 2)}
                </div>
              )}
              <span className="text-xs font-medium text-white group-hover:text-cyan-300 transition-colors">
                {token.symbol}
              </span>
            </div>
            <span className={`text-xs font-bold ${valueColor(token)}`}>
              {formatValue(token)}
            </span>
          </div>
        ))}
        {tokens.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-xs">
            No tokens available
          </div>
        )}
      </div>
    </div>
  );
}

export default function Leaderboard({ tokens, onTokenClick, onViewGainersLosers, onViewClosestATH }: LeaderboardProps) {
  // Top gainers (24h change)
  const topGainers = useMemo(() => {
    return [...tokens]
      .filter(t => t.twentyFourHourChange > 0)
      .sort((a, b) => b.twentyFourHourChange - a.twentyFourHourChange);
  }, [tokens]);

  // Closest to ATH (lowest % to gain)
  const closestToATH = useMemo(() => {
    return [...tokens]
      .filter(t => t.athPrice > 0 && t.percentToGainPeak > 0 && t.percentToGainPeak < 1000)
      .sort((a, b) => a.percentToGainPeak - b.percentToGainPeak);
  }, [tokens]);

  // Highest volume
  const highestVolume = useMemo(() => {
    return [...tokens]
      .filter(t => t.twentyFourHourVolume > 0)
      .sort((a, b) => b.twentyFourHourVolume - a.twentyFourHourVolume);
  }, [tokens]);

  // Top losers (24h change)
  const topLosers = useMemo(() => {
    return [...tokens]
      .filter(t => t.twentyFourHourChange < 0)
      .sort((a, b) => a.twentyFourHourChange - b.twentyFourHourChange);
  }, [tokens]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <LeaderboardCard
        title="Top Gainers"
        icon={
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        tokens={topGainers}
        valueKey="twentyFourHourChange"
        formatValue={(t) => formatPercentage(t.twentyFourHourChange)}
        valueColor={() => 'text-emerald-400'}
        onTokenClick={onTokenClick}
        onViewMore={onViewGainersLosers}
      />
      <LeaderboardCard
        title="Closest to ATH"
        icon={
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        tokens={closestToATH}
        valueKey="percentToGainPeak"
        formatValue={(t) => formatPercentage(t.percentToGainPeak)}
        valueColor={() => 'text-amber-400'}
        onTokenClick={onTokenClick}
        onViewMore={onViewClosestATH}
      />
      <LeaderboardCard
        title="Highest Volume"
        icon={
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        }
        tokens={highestVolume}
        valueKey="twentyFourHourVolume"
        formatValue={(t) => formatNumber(t.twentyFourHourVolume)}
        valueColor={() => 'text-cyan-400'}
        onTokenClick={onTokenClick}
      />
      <LeaderboardCard
        title="Top Losers"
        icon={
          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        }
        tokens={topLosers}
        valueKey="twentyFourHourChange"
        formatValue={(t) => formatPercentage(t.twentyFourHourChange)}
        valueColor={() => 'text-rose-400'}
        onTokenClick={onTokenClick}
        onViewMore={onViewGainersLosers}
      />
    </div>
  );
}
