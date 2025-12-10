'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAllTokenBalances, TOKENS } from '@/lib/jupiter';
import { getMemeTokensData } from '@/lib/helius';
import ShareModal from './ShareModal';

interface TokenHolding {
  name: string;
  symbol: string;
  address: string;
  balance: number;
  usdValue: number;
  logoUrl?: string;
  price?: number;
  change24h?: number;
  athPrice?: number;
  athValue?: number;
  multiplier?: number;
}

interface SwapHistory {
  id: number;
  created_at: string;
  wallet_address: string;
  payment_currency: string;
  swap_amount: number;
  token_address: string;
  token_symbol: string;
  token_amount: number;
  token_price: number;
  fee_amount: number;
  tx_signature: string;
  swap_type: string;
  status: string;
}

interface DatabaseToken {
  address: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  price?: number;
  twentyFourHourChange?: number;
  athPrice?: number;
}

interface PortfolioViewProps {
  onBack: () => void;
  onSelectToken?: (address: string) => void;
}

const formatUSD = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  if (value < 0.01 && value > 0) {
    return `<$0.01`;
  }
  return `$${value.toFixed(2)}`;
};

const formatBalance = (balance: number): string => {
  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(2)}M`;
  }
  if (balance >= 1000) {
    return `${(balance / 1000).toFixed(2)}K`;
  }
  if (balance < 0.000001 && balance > 0) {
    return balance.toExponential(2);
  }
  return balance.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const formatPrice = (price: number): string => {
  if (price < 0.000001) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
};

type TabType = 'positions' | 'history';

export default function PortfolioView({ onBack, onSelectToken }: PortfolioViewProps) {
  const { publicKey, connected } = useWallet();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [databaseTokens, setDatabaseTokens] = useState<DatabaseToken[]>([]);
  const [expandedWallet, setExpandedWallet] = useState(true);
  const [portfolioChange24h, setPortfolioChange24h] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('positions');
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchSolPrice();
    fetchDatabaseTokens();
  }, []);

  useEffect(() => {
    if (connected && publicKey && activeTab === 'history') {
      fetchSwapHistory();
    }
  }, [connected, publicKey, activeTab]);

  useEffect(() => {
    if (connected && publicKey && solPrice > 0) {
      fetchPortfolio();
    } else if (!connected) {
      setHoldings([]);
      setTotalBalance(0);
      setLoading(false);
    }
  }, [connected, publicKey, solPrice, databaseTokens]);

  const fetchSolPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      if (data.solana && data.solana.usd) {
        setSolPrice(data.solana.usd);
      }
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      setSolPrice(150);
    }
  };

  const fetchDatabaseTokens = async () => {
    try {
      const tokensData = await getMemeTokensData();
      const tokens: DatabaseToken[] = tokensData.map((token) => ({
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        logoUrl: token.logoUrl,
        price: token.price,
        twentyFourHourChange: token.twentyFourHourChange,
        athPrice: token.athPrice,
      }));
      setDatabaseTokens(tokens);
    } catch (error) {
      console.error('Error fetching database tokens:', error);
    }
  };

  const fetchPortfolio = async () => {
    if (!publicKey || !solPrice) return;

    setLoading(true);
    try {
      const portfolioHoldings: TokenHolding[] = [];
      const balanceMap = await getAllTokenBalances(publicKey.toBase58());

      // Get SOL balance
      const solBalance = balanceMap.get(TOKENS.SOL) || 0;
      const solValue = solBalance * solPrice;

      portfolioHoldings.push({
        name: 'Solana',
        symbol: 'SOL',
        address: TOKENS.SOL,
        balance: solBalance,
        usdValue: solValue,
        price: solPrice,
        logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      });

      // Get USDC balance
      const usdcBalance = balanceMap.get(TOKENS.USDC) || 0;

      portfolioHoldings.push({
        name: 'USD Coin',
        symbol: 'USDC',
        address: TOKENS.USDC,
        balance: usdcBalance,
        usdValue: usdcBalance,
        price: 1,
        logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      });

      // Check balances for all tokens in the database
      for (const dbToken of databaseTokens) {
        try {
          const balance = balanceMap.get(dbToken.address) || 0;

          if (balance > 0) {
            const usdValue = dbToken.price ? balance * dbToken.price : 0;
            const athValue = dbToken.athPrice ? balance * dbToken.athPrice : 0;
            const multiplier = dbToken.price && dbToken.athPrice && dbToken.price > 0
              ? dbToken.athPrice / dbToken.price
              : 1;
            portfolioHoldings.push({
              name: dbToken.name,
              symbol: dbToken.symbol,
              address: dbToken.address,
              balance,
              usdValue,
              price: dbToken.price,
              change24h: dbToken.twentyFourHourChange,
              logoUrl: dbToken.logoUrl,
              athPrice: dbToken.athPrice,
              athValue,
              multiplier,
            });
          }
        } catch (error) {
          console.error(`Error fetching balance for ${dbToken.symbol}:`, error);
        }
      }

      // Sort by USD value (highest first)
      portfolioHoldings.sort((a, b) => b.usdValue - a.usdValue);

      // Calculate weighted 24h change for portfolio
      const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.usdValue, 0);
      let weightedChange = 0;
      let valueWithChange = 0;

      for (const holding of portfolioHoldings) {
        if (holding.change24h !== undefined && holding.usdValue > 0) {
          weightedChange += holding.change24h * holding.usdValue;
          valueWithChange += holding.usdValue;
        }
      }

      // Only set portfolio change if we have tokens with 24h data
      if (valueWithChange > 0) {
        setPortfolioChange24h(weightedChange / valueWithChange);
      } else {
        setPortfolioChange24h(null);
      }

      setHoldings(portfolioHoldings);
      setTotalBalance(totalValue);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapHistory = async () => {
    if (!publicKey) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/swap-history?wallet=${publicKey.toBase58()}`);
      if (response.ok) {
        const data = await response.json();
        setSwapHistory(data.swaps || []);
      }
    } catch (error) {
      console.error('Error fetching swap history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const solInTotal = solPrice > 0 ? (totalBalance / solPrice).toFixed(2) : '0.00';

  if (!connected) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Wallet Address Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-full px-4 py-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-black">
            {publicKey?.toBase58().slice(0, 2)}
          </div>
          <span className="text-white text-sm font-medium">
            {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(publicKey?.toBase58() || '')}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Net Worth Card */}
      <div className="bg-transparent p-6 mb-6 -ml-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">Net Worth</p>
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-bold text-white">
                {loading ? '...' : formatUSD(totalBalance)}
              </h1>
              <span className="text-gray-500 text-lg">{solInTotal} SOL</span>
              {portfolioChange24h !== null && (
                <span className={`text-sm font-medium ${portfolioChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {portfolioChange24h >= 0 ? '+' : ''}{portfolioChange24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% (24h)
                </span>
              )}
            </div>
            {/* ATH Potential */}
            {!loading && holdings.some(h => h.athValue && h.athValue > 0) && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-gray-500 text-sm">If ATH:</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {formatUSD(holdings.reduce((sum, h) => sum + (h.athValue || h.usdValue), 0))}
                </span>
                <span className="text-emerald-400 text-sm">
                  ({(holdings.reduce((sum, h) => sum + (h.athValue || h.usdValue), 0) / (totalBalance || 1)).toFixed(1)}x)
                </span>
              </div>
            )}
          </div>
          {/* Share Button */}
          {!loading && holdings.length > 0 && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex items-center gap-2 font-medium pb-3 -mb-3 transition-colors ${
            activeTab === 'positions'
              ? 'text-white border-b-2 border-teal-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Positions
          {holdings.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400">
              {holdings.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 font-medium pb-3 -mb-3 transition-colors ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-teal-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
      </div>

      {/* Positions Tab Content */}
      {activeTab === 'positions' && (
        <>
          {/* Holdings Summary */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-lg px-4 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-gray-400 text-sm">Holdings</span>
            </div>
          </div>

          {/* Holdings Section */}
          <div className="bg-[#0d0d14] border border-gray-800 rounded-2xl overflow-hidden">
            {/* Holdings Header */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedWallet(!expandedWallet)}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-white font-semibold">Holdings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{formatUSD(totalBalance)}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedWallet ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>

            {expandedWallet && (
              <>
                {/* Wallet Sub-header */}
                <div className="flex items-center px-5 py-3 bg-[#12121a] border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-gray-400 text-sm">Wallet</span>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-4 px-5 py-3 text-xs text-gray-500 border-t border-gray-800">
                  <div>Asset</div>
                  <div>Balance</div>
                  <div className="text-right">Price/24h</div>
                  <div className="text-right">Value</div>
                </div>

                {/* Token Rows */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Loading...</p>
                  </div>
                ) : holdings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-500">No tokens found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800/50">
                    {holdings.map((holding, index) => {
                      const isClickable = holding.symbol !== 'SOL' && holding.symbol !== 'USDC';
                      return (
                      <div
                        key={index}
                        className={`grid grid-cols-4 px-4 py-2 h-12 hover:bg-white/5 transition-colors items-center ${isClickable ? 'cursor-pointer' : ''}`}
                        onClick={() => isClickable && onSelectToken?.(holding.address)}
                      >
                        {/* Asset */}
                        <div className="flex items-center gap-2">
                          {holding.logoUrl ? (
                            <img
                              src={holding.logoUrl}
                              alt={holding.name}
                              className="w-5 h-5 rounded-full"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-[8px] font-bold">
                              {holding.symbol.substring(0, 2)}
                            </div>
                          )}
                          <span className="text-white text-xs font-medium">{holding.symbol}</span>
                        </div>

                        {/* Balance */}
                        <div className="text-white text-xs">
                          {formatBalance(holding.balance)}
                        </div>

                        {/* Price/24h */}
                        <div className="text-right h-8 flex flex-col justify-center">
                          <div className="text-white text-xs">
                            {holding.price ? formatPrice(holding.price) : '-'}
                          </div>
                          <div className={`text-[10px] h-3 ${holding.change24h !== undefined ? (holding.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'invisible'}`}>
                            {holding.change24h !== undefined ? `${holding.change24h >= 0 ? '+' : ''}${holding.change24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : '-'}
                          </div>
                        </div>

                        {/* Value */}
                        <div className="text-right text-white text-xs font-medium">
                          {formatUSD(holding.usdValue)}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* History Tab Content */}
      {activeTab === 'history' && (
        <div className="bg-[#0d0d14] border border-gray-800 rounded-2xl overflow-hidden">
          {/* History Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white font-semibold">Swap History</span>
            </div>
            <span className="text-gray-500 text-xs">{swapHistory.length} transactions</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-7 px-5 py-3 text-xs text-gray-500 border-b border-gray-800">
            <div>Type</div>
            <div>Token</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Sent</div>
            <div className="text-right">Status</div>
            <div className="text-right">Date</div>
            <div className="text-right">Txn</div>
          </div>

          {/* History Rows */}
          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading history...</p>
            </div>
          ) : swapHistory.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-500">No swap history found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {swapHistory.map((swap) => (
                <div
                  key={swap.id}
                  className="grid grid-cols-7 px-5 py-3 hover:bg-white/5 transition-colors items-center"
                >
                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      swap.swap_type === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                    }`}>
                      {swap.swap_type === 'buy' ? (
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0-16l-4 4m4-4l4 4" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 16l4-4m-4 4l-4-4" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      swap.swap_type === 'buy' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {swap.swap_type === 'buy' ? 'Buy' : 'Sell'}
                    </span>
                  </div>

                  {/* Token */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const tokenData = databaseTokens.find(t => t.address === swap.token_address);
                      return tokenData?.logoUrl ? (
                        <img
                          src={tokenData.logoUrl}
                          alt={swap.token_symbol}
                          className="w-5 h-5 rounded-full"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-[8px] font-bold">
                          {swap.token_symbol.substring(0, 2)}
                        </div>
                      );
                    })()}
                    <span className="text-white text-xs font-medium">{swap.token_symbol}</span>
                  </div>

                  {/* Amount */}
                  <div className={`text-right text-xs ${swap.swap_type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {swap.swap_type === 'buy'
                      ? `+${formatBalance(swap.token_amount)}`
                      : `-${formatBalance(swap.token_amount)}`
                    }
                  </div>

                  {/* Value */}
                  <div className="text-right text-gray-400 text-xs">
                    {swap.swap_amount.toFixed(4)} {swap.payment_currency}
                  </div>

                  {/* Status */}
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      swap.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : swap.status === 'failed'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {swap.status || 'submitted'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-right text-gray-500 text-xs">
                    {formatDate(swap.created_at)}
                  </div>

                  {/* Txn Link */}
                  <div className="text-right">
                    <a
                      href={`https://solscan.io/tx/${swap.tx_signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Txn Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          data={{
            type: 'portfolio',
            totalCurrentValue: totalBalance,
            totalAthValue: holdings.reduce((sum, h) => sum + (h.athValue || h.usdValue), 0),
            totalMultiplier: holdings.reduce((sum, h) => sum + (h.athValue || h.usdValue), 0) / (totalBalance || 1),
            holdings: holdings
              .filter(h => h.athValue && h.athValue > 0)
              .map(h => ({
                symbol: h.symbol,
                name: h.name,
                logo: h.logoUrl,
                currentValue: h.usdValue,
                athValue: h.athValue || h.usdValue,
                multiplier: h.multiplier || 1,
              })),
            walletAddress: publicKey?.toBase58(),
          }}
        />
      )}
    </div>
  );
}
