'use client';

import { useState, useMemo } from 'react';
import { MemeTokenData } from '@/lib/helius';

interface HeatmapProps {
  tokens: MemeTokenData[];
  onTokenClick?: (token: MemeTokenData) => void;
}

type TimeframeOption = '1h' | '24h';

export default function Heatmap({ tokens, onTokenClick }: HeatmapProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('24h');
  const [hoveredToken, setHoveredToken] = useState<MemeTokenData | null>(null);

  // Sort tokens by market cap for treemap layout
  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => (b.currentMcap || 0) - (a.currentMcap || 0));
  }, [tokens]);

  // Calculate the total market cap for sizing
  const totalMarketCap = useMemo(() => {
    return sortedTokens.reduce((sum, t) => sum + (t.currentMcap || 0), 0);
  }, [sortedTokens]);

  // Get performance value based on timeframe
  const getPerformance = (token: MemeTokenData) => {
    return timeframe === '1h' ? token.oneHourChange : token.twentyFourHourChange;
  };

  // Get color based on performance
  const getColor = (performance: number) => {
    if (performance >= 20) return 'bg-emerald-500';
    if (performance >= 10) return 'bg-emerald-600';
    if (performance >= 5) return 'bg-emerald-700';
    if (performance >= 2) return 'bg-emerald-800';
    if (performance >= 0) return 'bg-emerald-900';
    if (performance >= -2) return 'bg-rose-900';
    if (performance >= -5) return 'bg-rose-800';
    if (performance >= -10) return 'bg-rose-700';
    if (performance >= -20) return 'bg-rose-600';
    return 'bg-rose-500';
  };

  // Get text color for contrast
  const getTextColor = (performance: number) => {
    if (Math.abs(performance) >= 5) return 'text-white';
    return 'text-gray-300';
  };

  // Calculate treemap layout using squarified algorithm
  const calculateTreemap = useMemo(() => {
    if (sortedTokens.length === 0) return [];

    const containerWidth = 100; // percentage
    const containerHeight = 100; // percentage

    interface TreemapItem {
      token: TokenData;
      x: number;
      y: number;
      width: number;
      height: number;
    }

    const items: TreemapItem[] = [];

    // Simple row-based layout
    let currentY = 0;
    let currentX = 0;
    let rowHeight = 0;
    let rowTokens: { token: TokenData; width: number }[] = [];

    const minBoxSize = 8; // minimum percentage width/height

    sortedTokens.forEach((token, index) => {
      const mcapRatio = (token.currentMcap || 0) / totalMarketCap;
      // Scale the area, with minimum size
      const area = Math.max(mcapRatio * 100, 2);

      // Determine size based on rank
      let boxWidth: number;
      let boxHeight: number;

      if (index < 3) {
        // Top 3 get large boxes
        boxWidth = 25;
        boxHeight = 30;
      } else if (index < 10) {
        // Top 10 get medium boxes
        boxWidth = 16;
        boxHeight = 20;
      } else if (index < 25) {
        // Next tier
        boxWidth = 12;
        boxHeight = 15;
      } else {
        // Rest get smaller boxes
        boxWidth = Math.max(minBoxSize, Math.sqrt(area) * 3);
        boxHeight = Math.max(minBoxSize, Math.sqrt(area) * 3);
      }

      // Check if we need a new row
      if (currentX + boxWidth > containerWidth) {
        currentX = 0;
        currentY += rowHeight;
        rowHeight = 0;
      }

      items.push({
        token,
        x: currentX,
        y: currentY,
        width: boxWidth,
        height: boxHeight,
      });

      currentX += boxWidth;
      rowHeight = Math.max(rowHeight, boxHeight);
    });

    return items;
  }, [sortedTokens, totalMarketCap]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return `$${price.toFixed(9)}`;
    if (price < 0.0001) return `$${price.toFixed(6)}`;
    if (price < 0.01) return `$${price.toFixed(4)}`;
    if (price < 1) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Market Heatmap</h2>
          <span className="text-xs text-gray-500">{tokens.length} tokens</span>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setTimeframe('1h')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeframe === '1h'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            1H
          </button>
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeframe === '24h'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            24H
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mb-4 text-[10px]">
        <span className="text-gray-500 mr-2">Performance:</span>
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 bg-rose-500 rounded-sm"></div>
          <div className="w-6 h-3 bg-rose-600 rounded-sm"></div>
          <div className="w-6 h-3 bg-rose-700 rounded-sm"></div>
          <div className="w-6 h-3 bg-rose-800 rounded-sm"></div>
          <div className="w-6 h-3 bg-rose-900 rounded-sm"></div>
          <div className="w-6 h-3 bg-emerald-900 rounded-sm"></div>
          <div className="w-6 h-3 bg-emerald-800 rounded-sm"></div>
          <div className="w-6 h-3 bg-emerald-700 rounded-sm"></div>
          <div className="w-6 h-3 bg-emerald-600 rounded-sm"></div>
          <div className="w-6 h-3 bg-emerald-500 rounded-sm"></div>
        </div>
        <span className="text-gray-500 ml-2">-20% → +20%</span>
      </div>

      {/* Heatmap Grid */}
      <div className="relative w-full h-[600px] bg-black/30 rounded-xl overflow-hidden border border-gray-800/50">
        <div className="absolute inset-0 flex flex-wrap content-start p-1 gap-1">
          {sortedTokens.map((token, index) => {
            const performance = getPerformance(token);
            const mcapRatio = (token.currentMcap || 0) / totalMarketCap;

            // Calculate size class based on market cap ranking
            let sizeClass = '';
            let showDetails = false;

            if (index < 3) {
              sizeClass = 'w-[180px] h-[140px]';
              showDetails = true;
            } else if (index < 8) {
              sizeClass = 'w-[140px] h-[110px]';
              showDetails = true;
            } else if (index < 15) {
              sizeClass = 'w-[110px] h-[85px]';
              showDetails = true;
            } else if (index < 30) {
              sizeClass = 'w-[85px] h-[65px]';
              showDetails = false;
            } else {
              sizeClass = 'w-[65px] h-[50px]';
              showDetails = false;
            }

            return (
              <button
                key={token.address}
                onClick={() => onTokenClick?.(token)}
                onMouseEnter={() => setHoveredToken(token)}
                onMouseLeave={() => setHoveredToken(null)}
                className={`${sizeClass} ${getColor(performance)} rounded-lg p-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:z-10 hover:shadow-lg hover:shadow-black/50 relative overflow-hidden group`}
              >
                {/* Background pattern for visual interest */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>

                {/* Token Logo */}
                {showDetails && token.logoUrl && (
                  <img
                    src={token.logoUrl}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full mb-1 border border-white/20"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {/* Symbol */}
                <span className={`font-bold ${getTextColor(performance)} ${showDetails ? 'text-sm' : 'text-xs'} truncate max-w-full`}>
                  {token.symbol}
                </span>

                {/* Performance */}
                <span className={`font-semibold ${getTextColor(performance)} ${showDetails ? 'text-sm' : 'text-[10px]'}`}>
                  {performance >= 0 ? '+' : ''}{performance.toFixed(1)}%
                </span>

                {/* Market Cap - only on larger boxes */}
                {showDetails && (
                  <span className={`text-[10px] ${getTextColor(performance)} opacity-70 mt-0.5`}>
                    {formatNumber(token.currentMcap)}
                  </span>
                )}

                {/* Chain indicator */}
                {index < 15 && (
                  <div className="absolute top-1 right-1">
                    {token.chain === 'ethereum' ? (
                      <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-3 h-3 opacity-60" />
                    ) : (
                      <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="SOL" className="w-3 h-3 opacity-60" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredToken && (
          <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 z-20 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              {hoveredToken.logoUrl && (
                <img src={hoveredToken.logoUrl} alt={hoveredToken.symbol} className="w-8 h-8 rounded-full" />
              )}
              <div>
                <p className="font-bold text-white">{hoveredToken.name}</p>
                <p className="text-xs text-gray-400">{hoveredToken.symbol}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-white font-medium">{formatPrice(hoveredToken.price || 0)}</p>
              </div>
              <div>
                <p className="text-gray-500">Market Cap</p>
                <p className="text-white font-medium">{formatNumber(hoveredToken.currentMcap)}</p>
              </div>
              <div>
                <p className="text-gray-500">1H Change</p>
                <p className={`font-medium ${hoveredToken.oneHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {hoveredToken.oneHourChange >= 0 ? '+' : ''}{hoveredToken.oneHourChange.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">24H Change</p>
                <p className={`font-medium ${hoveredToken.twentyFourHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {hoveredToken.twentyFourHourChange >= 0 ? '+' : ''}{hoveredToken.twentyFourHourChange.toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Click to view details</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-400">
            Gainers: <span className="text-emerald-400 font-medium">{tokens.filter(t => getPerformance(t) > 0).length}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded"></div>
          <span className="text-gray-400">
            Losers: <span className="text-rose-400 font-medium">{tokens.filter(t => getPerformance(t) < 0).length}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400">
            Neutral: <span className="text-gray-300 font-medium">{tokens.filter(t => getPerformance(t) === 0).length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
