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

interface DegenScoreProps {
  token: TokenData;
  showDetails?: boolean;
}

interface ScoreBreakdown {
  liquidityScore: number;
  volumeScore: number;
  volatilityScore: number;
  athDistanceScore: number;
  mcapScore: number;
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export function calculateDegenScore(token: TokenData): ScoreBreakdown {
  // Liquidity Score (0-20 points) - Higher liquidity = safer
  let liquidityScore = 0;
  const liquidity = token.liquidity || 0;
  if (liquidity >= 1000000) liquidityScore = 20;
  else if (liquidity >= 500000) liquidityScore = 16;
  else if (liquidity >= 100000) liquidityScore = 12;
  else if (liquidity >= 50000) liquidityScore = 8;
  else if (liquidity >= 10000) liquidityScore = 4;
  else liquidityScore = 2;

  // Volume Score (0-20 points) - Higher volume = more interest/safer
  let volumeScore = 0;
  const volume = token.twentyFourHourVolume || 0;
  if (volume >= 10000000) volumeScore = 20;
  else if (volume >= 5000000) volumeScore = 16;
  else if (volume >= 1000000) volumeScore = 12;
  else if (volume >= 500000) volumeScore = 8;
  else if (volume >= 100000) volumeScore = 4;
  else volumeScore = 2;

  // Volatility Score (0-20 points) - Lower volatility = safer (inverted)
  let volatilityScore = 0;
  const volatility = Math.abs(token.twentyFourHourChange);
  if (volatility <= 5) volatilityScore = 20;
  else if (volatility <= 10) volatilityScore = 16;
  else if (volatility <= 20) volatilityScore = 12;
  else if (volatility <= 30) volatilityScore = 8;
  else if (volatility <= 50) volatilityScore = 4;
  else volatilityScore = 2;

  // ATH Distance Score (0-20 points) - Closer to ATH = potentially less upside but more stable
  let athDistanceScore = 0;
  const athDistance = token.percentToGainPeak;
  if (athDistance <= 50) athDistanceScore = 18;
  else if (athDistance <= 100) athDistanceScore = 16;
  else if (athDistance <= 200) athDistanceScore = 14;
  else if (athDistance <= 500) athDistanceScore = 10;
  else if (athDistance <= 1000) athDistanceScore = 6;
  else athDistanceScore = 4;

  // Market Cap Score (0-20 points) - Higher mcap = more established
  let mcapScore = 0;
  const mcap = token.currentMcap || 0;
  if (mcap >= 100000000) mcapScore = 20;
  else if (mcap >= 50000000) mcapScore = 16;
  else if (mcap >= 10000000) mcapScore = 12;
  else if (mcap >= 5000000) mcapScore = 8;
  else if (mcap >= 1000000) mcapScore = 4;
  else mcapScore = 2;

  const totalScore = liquidityScore + volumeScore + volatilityScore + athDistanceScore + mcapScore;

  // Risk Level based on total score (max 100)
  let riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  if (totalScore >= 70) riskLevel = 'low';
  else if (totalScore >= 50) riskLevel = 'medium';
  else if (totalScore >= 30) riskLevel = 'high';
  else riskLevel = 'extreme';

  return {
    liquidityScore,
    volumeScore,
    volatilityScore,
    athDistanceScore,
    mcapScore,
    totalScore,
    riskLevel,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-yellow-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-rose-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500/20 border-emerald-500/40';
  if (score >= 50) return 'bg-yellow-500/20 border-yellow-500/40';
  if (score >= 30) return 'bg-orange-500/20 border-orange-500/40';
  return 'bg-rose-500/20 border-rose-500/40';
}

export function getRiskEmoji(riskLevel: string): string {
  switch (riskLevel) {
    case 'low': return '🟢';
    case 'medium': return '🟡';
    case 'high': return '🟠';
    case 'extreme': return '🔴';
    default: return '⚪';
  }
}

export default function DegenScore({ token, showDetails = false }: DegenScoreProps) {
  const score = useMemo(() => calculateDegenScore(token), [token]);

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-xs">{getRiskEmoji(score.riskLevel)}</span>
      <span className={`text-xs font-bold ${getScoreColor(score.totalScore)}`}>
        {score.totalScore}
      </span>
      {showDetails && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl z-50 min-w-48">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Liquidity:</span>
              <span className="text-white">{score.liquidityScore}/20</span>
            </div>
            <div className="flex justify-between">
              <span>Volume:</span>
              <span className="text-white">{score.volumeScore}/20</span>
            </div>
            <div className="flex justify-between">
              <span>Volatility:</span>
              <span className="text-white">{score.volatilityScore}/20</span>
            </div>
            <div className="flex justify-between">
              <span>ATH Distance:</span>
              <span className="text-white">{score.athDistanceScore}/20</span>
            </div>
            <div className="flex justify-between">
              <span>Market Cap:</span>
              <span className="text-white">{score.mcapScore}/20</span>
            </div>
            <div className="border-t border-gray-700 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total:</span>
              <span className={getScoreColor(score.totalScore)}>{score.totalScore}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact badge version for table
export function DegenScoreBadge({ token }: { token: TokenData }) {
  const score = useMemo(() => calculateDegenScore(token), [token]);

  return (
    <div
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-semibold ${getScoreBgColor(score.totalScore)}`}
      title={`Degen Score: ${score.totalScore}/100 (${score.riskLevel} risk)`}
    >
      <span className="text-[10px]">{getRiskEmoji(score.riskLevel)}</span>
      <span className={getScoreColor(score.totalScore)}>{score.totalScore}</span>
    </div>
  );
}
