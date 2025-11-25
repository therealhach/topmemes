'use client';

import { useMemo } from 'react';
import { TokenData } from './TokenTable';

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

interface ClosestToATHViewProps {
  tokens: TokenData[];
  onBack: () => void;
}

export default function ClosestToATHView({ tokens, onBack }: ClosestToATHViewProps) {
  const closestToATH = useMemo(() => {
    return [...tokens]
      .filter(t => t.athPrice > 0 && t.percentToGainPeak > 0 && t.percentToGainPeak < 10000)
      .sort((a, b) => a.percentToGainPeak - b.percentToGainPeak);
  }, [tokens]);

  // Calculate progress percentage (how close to ATH, inverted so lower % to gain = higher progress)
  const getProgressPercentage = (token: TokenData): number => {
    if (!token.athPrice || !token.price) return 0;
    const progress = (token.price / token.athPrice) * 100;
    return Math.min(progress, 100);
  };

  // Get number of filled blocks (out of 10)
  const getFilledBlocks = (progress: number): number => {
    return Math.round(progress / 10);
  };

  // Get color based on progress
  const getBlockColor = (progress: number): string => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-cyan-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  // Segmented progress bar component
  const SegmentedProgressBar = ({ progress }: { progress: number }) => {
    const filledBlocks = getFilledBlocks(progress);
    const blockColor = getBlockColor(progress);
    const totalBlocks = 10;

    return (
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: totalBlocks }).map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-3 rounded-[2px] ${
              index < filledBlocks ? blockColor : 'bg-gray-700/50'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h1 className="text-sm font-bold text-white">Closest to All-Time High</h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-900/60 via-cyan-900/60 to-teal-900/60 border-b border-cyan-500/20">
              <th className="px-3 py-2 text-left text-[10px] font-semibold text-cyan-300">#</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold text-cyan-300">Token</th>
              <th className="px-3 py-2 text-right text-[10px] font-semibold text-cyan-300">Current Price</th>
              <th className="px-3 py-2 text-right text-[10px] font-semibold text-cyan-300">ATH Price</th>
              <th className="px-3 py-2 text-center text-[10px] font-semibold text-cyan-300 w-48">Progress to ATH</th>
              <th className="px-3 py-2 text-right text-[10px] font-semibold text-cyan-300">% to ATH</th>
            </tr>
          </thead>
          <tbody>
            {closestToATH.map((token, index) => {
              const progress = getProgressPercentage(token);

              return (
                <tr
                  key={token.address}
                  className={`${index % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-800/40'} hover:bg-cyan-900/20 transition-colors border-b border-cyan-500/10`}
                >
                  <td className="px-3 py-2.5 text-[10px] text-gray-400">{index + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {token.logoUrl ? (
                        <img
                          src={token.logoUrl}
                          alt={token.name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[8px] font-bold">
                          {token.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-white">{token.symbol}</span>
                        {token.chain === 'ethereum' ? (
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-2 h-2" />
                        ) : (
                          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="SOL" className="w-1.5 h-1.5" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[10px] text-right text-gray-200">{formatPrice(token.price || 0)}</td>
                  <td className="px-3 py-2.5 text-[10px] text-right text-amber-400">{formatPrice(token.athPrice)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <SegmentedProgressBar progress={progress} />
                      <span className="text-[9px] text-gray-400 w-10 text-right">{progress.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[10px] text-right font-semibold text-teal-400">
                    {formatPercentage(token.percentToGainPeak)}
                  </td>
                </tr>
              );
            })}
            {closestToATH.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-gray-500 text-xs">
                  No tokens available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[9px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2.5 rounded-[2px] bg-emerald-500"></div>
          <span>80%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2.5 rounded-[2px] bg-cyan-500"></div>
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2.5 rounded-[2px] bg-yellow-500"></div>
          <span>40-60%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2.5 rounded-[2px] bg-orange-500"></div>
          <span>20-40%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2.5 rounded-[2px] bg-rose-500"></div>
          <span>&lt;20%</span>
        </div>
      </div>
    </div>
  );
}
