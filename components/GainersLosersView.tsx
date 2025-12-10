'use client';

import { useMemo } from 'react';
import Link from 'next/link';
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
  return `${sign}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};

interface GainersLosersTableProps {
  title: string;
  tokens: TokenData[];
  isGainers: boolean;
}

function GainersLosersTable({ title, tokens, isGainers }: GainersLosersTableProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-3">
        {isGainers ? (
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        )}
        <h2 className={`text-sm font-bold ${isGainers ? 'text-emerald-400' : 'text-rose-400'}`}>{title}</h2>
        <span className="text-[10px] text-gray-500">24h</span>
      </div>

      <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-900/60 via-cyan-900/60 to-teal-900/60 border-b border-cyan-500/20">
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-cyan-300">#</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-cyan-300">Token</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-cyan-300">Price</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-cyan-300">24h %</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-cyan-300">Mcap</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <Link
                key={token.address}
                href={`/token/${token.address}`}
                className="contents"
              >
                <tr
                  className={`${index % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-800/40'} hover:bg-cyan-900/20 transition-colors border-b border-cyan-500/10 cursor-pointer`}
                >
                  <td className="px-2 py-2 text-[10px] text-gray-400">{index + 1}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      {token.logoUrl ? (
                        <img
                          src={token.logoUrl}
                          alt={token.name}
                          className="w-5 h-5 rounded-full"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[8px] font-bold">
                          {token.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium text-white">{token.symbol}</span>
                        {token.chain === 'ethereum' ? (
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-2 h-2" />
                        ) : (
                          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="SOL" className="w-1.5 h-1.5" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-[10px] text-right text-gray-200">{formatPrice(token.price || 0)}</td>
                  <td className={`px-2 py-2 text-[10px] text-right font-semibold ${isGainers ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPercentage(token.twentyFourHourChange)}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-right text-gray-200">{formatNumber(token.currentMcap)}</td>
                </tr>
              </Link>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-6 text-center text-gray-500 text-xs">
                  No tokens available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface GainersLosersViewProps {
  tokens: TokenData[];
  onBack: () => void;
}

export default function GainersLosersView({ tokens, onBack }: GainersLosersViewProps) {
  const topGainers = useMemo(() => {
    return [...tokens]
      .filter(t => t.twentyFourHourChange > 0)
      .sort((a, b) => b.twentyFourHourChange - a.twentyFourHourChange)
      .slice(0, 25);
  }, [tokens]);

  const topLosers = useMemo(() => {
    return [...tokens]
      .filter(t => t.twentyFourHourChange < 0)
      .sort((a, b) => a.twentyFourHourChange - b.twentyFourHourChange)
      .slice(0, 25);
  }, [tokens]);

  return (
    <div className="w-full max-w-6xl">
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
        <h1 className="text-sm font-bold text-white">Top Gainers & Losers</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <GainersLosersTable title="Top Gainers" tokens={topGainers} isGainers={true} />
        <GainersLosersTable title="Top Losers" tokens={topLosers} isGainers={false} />
      </div>
    </div>
  );
}
