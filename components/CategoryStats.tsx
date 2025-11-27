'use client';

import { TokenData } from './TokenTable';

interface CategoryStatsProps {
  tokens: TokenData[];
  category: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

const formatPercentage = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'dogs': return '🐕';
    case 'cats': return '🐱';
    case 'frogs': return '🐸';
    case 'ai': return '🤖';
    default: return '✨';
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'dogs': return 'Dog';
    case 'cats': return 'Cat';
    case 'frogs': return 'Frog';
    case 'ai': return 'AI';
    default: return 'Other';
  }
};

export default function CategoryStats({ tokens, category }: CategoryStatsProps) {
  // Filter tokens by category
  const categoryTokens = tokens.filter(t => t.category === category);

  if (categoryTokens.length === 0) return null;

  // Calculate stats
  const totalMcap = categoryTokens.reduce((sum, t) => sum + (t.currentMcap || 0), 0);
  const totalVolume = categoryTokens.reduce((sum, t) => sum + (t.twentyFourHourVolume || 0), 0);

  // Calculate average 1h and 24h changes
  const avg1hChange = categoryTokens.reduce((sum, t) => sum + (t.oneHourChange || 0), 0) / categoryTokens.length;
  const avg24hChange = categoryTokens.reduce((sum, t) => sum + (t.twentyFourHourChange || 0), 0) / categoryTokens.length;

  const emoji = getCategoryEmoji(category);
  const label = getCategoryLabel(category);

  return (
    <div className="w-full max-w-6xl mb-4">
      <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/50 to-gray-900/80 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{emoji}</span>
          <h3 className="text-sm font-semibold text-white">{label} Memecoins Overview</h3>
          <span className="text-xs text-gray-500">({categoryTokens.length} tokens)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Market Cap */}
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 mb-1">Total {label} Mcap</p>
            <p className="text-sm font-bold text-white">{formatNumber(totalMcap)}</p>
          </div>

          {/* 24h Volume */}
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 mb-1">24h Volume</p>
            <p className="text-sm font-bold text-white">{formatNumber(totalVolume)}</p>
          </div>

          {/* Avg 1h Change */}
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 mb-1">Avg 1h Change</p>
            <p className={`text-sm font-bold ${avg1hChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercentage(avg1hChange)}
            </p>
          </div>

          {/* Avg 24h Change */}
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 mb-1">Avg 24h Change</p>
            <p className={`text-sm font-bold ${avg24hChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercentage(avg24hChange)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
