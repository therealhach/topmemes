'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  getJupiterQuote,
  getJupiterSwapTransaction,
  executeSwap,
  getTokenBalance,
  calculateUpsideToATH,
  TOKENS,
  JupiterQuote,
} from '@/lib/jupiter';
import SegmentedProgressBar from './SegmentedProgressBar';
import PriceChart from './PriceChart';

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
  chain?: 'solana' | 'ethereum';
}

interface TokenDetailModalProps {
  token: TokenData | null;
  onClose: () => void;
  allTokens: TokenData[];
}

type PaymentCurrency = 'USDC' | 'SOL';
type TabType = 'buy' | 'sell';

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

const formatPrice = (price: number): string => {
  if (price < 0.000001) {
    return `$${price.toFixed(8)}`;
  } else if (price < 0.00001) {
    return `$${price.toFixed(7)}`;
  } else if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(2)}`;
};

const formatTokenAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return amount.toFixed(2);
};

export default function TokenDetailModal({ token, onClose, allTokens }: TokenDetailModalProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>('buy');
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>('USDC');
  const [amount, setAmount] = useState<string>('100');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [solBalance, setsolBalance] = useState<number>(0);
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [solPrice, setSolPrice] = useState<number>(0);

  // Fetch SOL price on mount
  useEffect(() => {
    fetchSolPrice();
  }, []);

  // Fetch balances when wallet is connected
  useEffect(() => {
    if (connected && publicKey && token) {
      fetchBalances();
    }
  }, [connected, publicKey, token]);

  // Fetch quote when amount or currency changes
  useEffect(() => {
    if (token?.address && amount && parseFloat(amount) > 0) {
      fetchQuote();
    } else {
      setQuote(null);
    }
  }, [amount, paymentCurrency, activeTab, token]);

  const fetchSolPrice = async () => {
    try {
      // Fetch SOL price from Jupiter or CoinGecko
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      if (data.solana && data.solana.usd) {
        setSolPrice(data.solana.usd);
      }
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      // Fallback to approximate price if fetch fails
      setSolPrice(150);
    }
  };

  const fetchBalances = async () => {
    if (!publicKey || !token) return;

    try {
      const [tokenBal, usdcBal, solBal] = await Promise.all([
        getTokenBalance(connection, publicKey.toBase58(), token.address),
        getTokenBalance(connection, publicKey.toBase58(), TOKENS.USDC),
        getTokenBalance(connection, publicKey.toBase58(), TOKENS.SOL),
      ]);

      setTokenBalance(tokenBal);
      setUsdcBalance(usdcBal);
      setsolBalance(solBal);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const fetchQuote = async () => {
    if (!token?.address || !amount || parseFloat(amount) <= 0) return;

    setIsLoadingQuote(true);
    try {
      let inputMint: string;
      let outputMint: string;
      let amountInSmallestUnit: number;

      if (activeTab === 'buy') {
        // Buying token with USDC or SOL
        inputMint = paymentCurrency === 'USDC' ? TOKENS.USDC : TOKENS.SOL;
        outputMint = token.address;

        // Convert amount to smallest unit (6 decimals for USDC, 9 for SOL)
        const decimals = paymentCurrency === 'USDC' ? 6 : 9;
        amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, decimals));
      } else {
        // Selling token for USDC or SOL
        inputMint = token.address;
        outputMint = paymentCurrency === 'USDC' ? TOKENS.USDC : TOKENS.SOL;

        // Assuming token has 6 decimals (adjust if needed)
        amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, 6));
      }

      const jupiterQuote = await getJupiterQuote(
        inputMint,
        outputMint,
        amountInSmallestUnit,
        50 // 0.5% slippage
      );

      setQuote(jupiterQuote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    setIsSwapping(true);
    try {
      // Get swap transaction
      const swapTransaction = await getJupiterSwapTransaction(
        quote,
        publicKey.toBase58(),
        true
      );

      if (!swapTransaction) {
        throw new Error('Failed to get swap transaction');
      }

      // Execute swap
      const txid = await executeSwap(
        connection,
        swapTransaction,
        { signTransaction }
      );

      alert(`Swap successful! Transaction: ${txid}`);

      // Refresh balances
      await fetchBalances();

      // Reset amount
      setAmount('100');
    } catch (error) {
      console.error('Swap error:', error);
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handlePercentage = (percentage: number) => {
    if (activeTab === 'sell' && tokenBalance > 0) {
      const sellAmount = (tokenBalance * percentage) / 100;
      setAmount(sellAmount.toString());
    }
  };

  if (!token) return null;

  // Calculate average 24h change for tokens > 2M mcap
  const average24hChange = allTokens
    .filter(t => t.currentMcap > 2000000)
    .reduce((sum, t) => sum + t.twentyFourHourChange, 0) /
    allTokens.filter(t => t.currentMcap > 2000000).length || 0;

  const outputAmount = quote
    ? activeTab === 'buy'
      ? parseInt(quote.outAmount) / Math.pow(10, 6) // Adjust decimals
      : parseInt(quote.outAmount) / Math.pow(10, paymentCurrency === 'USDC' ? 6 : 9)
    : 0;

  // Convert SOL to USD for upside calculation
  const usdAmount = activeTab === 'buy' && paymentCurrency === 'SOL'
    ? (parseFloat(amount) || 0) * solPrice
    : parseFloat(amount) || 0;

  const upsideCalc = activeTab === 'buy' && token.price
    ? calculateUpsideToATH(usdAmount, token.price, token.athPrice)
    : null;

  const currentBalance = activeTab === 'buy'
    ? paymentCurrency === 'USDC'
      ? usdcBalance
      : solBalance
    : tokenBalance;

  return (
    <div className="sticky top-4 h-auto max-h-[calc(100vh-32px)] w-full bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-lg shadow-2xl overflow-y-auto custom-scrollbar">
      <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {token.logoUrl ? (
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                  {token.symbol.substring(0, 2)}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{token.name}</h2>
                <p className="text-xs text-cyan-400 mb-2">${token.symbol} / SOL</p>
                <SegmentedProgressBar
                  percentage={token.price && token.athPrice ? (token.price / token.athPrice) * 100 : 0}
                  color="green"
                  className="mb-1"
                />
                <p className="text-[10px] text-gray-400">
                  Progress to ATH: {token.price && token.athPrice ? ((token.price / token.athPrice) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Token Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-black/40 rounded-lg border border-cyan-500/20">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Price</p>
              <p className="text-sm font-bold text-emerald-400">
                {token.price ? formatPrice(token.price) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">MCap</p>
              <p className="text-sm font-bold text-gray-200">{formatNumber(token.currentMcap)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">1h Change</p>
              <p className={`text-sm font-bold ${token.oneHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {token.oneHourChange >= 0 ? '+' : ''}{token.oneHourChange.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">24h Vol</p>
              <p className="text-sm font-bold text-gray-200">{formatNumber(token.twentyFourHourVolume)}</p>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mb-3">
            <PriceChart
              tokenAddress={token.address}
              chain={token.chain || 'solana'}
              tokenSymbol={token.symbol}
              className="h-[200px]"
            />
          </div>

          {/* Buy/Sell Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Currency Selection (for Buy tab) */}
          {activeTab === 'buy' && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1.5">Pay with</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentCurrency('USDC')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    paymentCurrency === 'USDC'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  USDC
                </button>
                <button
                  onClick={() => setPaymentCurrency('SOL')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    paymentCurrency === 'SOL'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  SOL
                </button>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">
                {activeTab === 'buy' ? 'Amount' : 'Token Amount'}
              </p>
              {connected && (
                <p className="text-[10px] text-gray-500">
                  Bal: {currentBalance.toFixed(4)}{' '}
                  {activeTab === 'buy' ? paymentCurrency : token.symbol}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors custom-input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {activeTab === 'buy' ? paymentCurrency : token.symbol}
              </span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {activeTab === 'buy' ? (
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {paymentCurrency === 'SOL'
                ? [0.1, 0.5, 1, 3].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleQuickAmount(value)}
                      className="py-1 px-2 bg-gray-800/50 hover:bg-gray-800 text-cyan-400 rounded text-xs font-medium transition-colors"
                    >
                      {value} SOL
                    </button>
                  ))
                : [10, 50, 100, 500].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleQuickAmount(value)}
                      className="py-1 px-2 bg-gray-800/50 hover:bg-gray-800 text-cyan-400 rounded text-xs font-medium transition-colors"
                    >
                      ${value}
                    </button>
                  ))
              }
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[25, 50, 75, 100].map((value) => (
                <button
                  key={value}
                  onClick={() => handlePercentage(value)}
                  className="py-1 px-2 bg-gray-800/50 hover:bg-gray-800 text-rose-400 rounded text-xs font-medium transition-colors"
                >
                  {value}%
                </button>
              ))}
            </div>
          )}

          {/* Trade Preview */}
          {quote && !isLoadingQuote && (
            <div className="mb-3 p-2.5 bg-black/40 rounded-lg border border-cyan-500/20">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400">You {activeTab === 'buy' ? 'pay' : 'sell'}</p>
                <p className="text-white text-xs font-semibold">
                  {parseFloat(amount).toFixed(2)} {activeTab === 'buy' ? paymentCurrency : token.symbol}
                </p>
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400">You receive</p>
                <p className="text-emerald-400 text-xs font-semibold">
                  ~{formatTokenAmount(outputAmount)} {activeTab === 'buy' ? token.symbol : paymentCurrency}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500">Rate</p>
                <p className="text-[10px] text-gray-400">
                  1 {token.symbol} = {token.price ? formatPrice(token.price) : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {isLoadingQuote && (
            <div className="mb-3 p-2.5 bg-black/40 rounded-lg border border-cyan-500/20 text-center">
              <p className="text-xs text-gray-400">Loading quote...</p>
            </div>
          )}

          {/* Upside Calculator (Buy tab only) */}
          {activeTab === 'buy' && upsideCalc && (
            <div className="mb-3 p-3 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">💰</span>
                <h3 className="text-sm font-bold text-amber-400">Upside to ATH</h3>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">ATH Price:</span>
                  <span className="text-white font-semibold text-xs">{formatPrice(token.athPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Price:</span>
                  <span className="text-white font-semibold text-xs">{token.price ? formatPrice(token.price) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Upside:</span>
                  <span className="text-emerald-400 font-bold text-xs">
                    +{token.percentToGainPeak.toFixed(2)}% 🚀
                  </span>
                </div>
                <div className="h-px bg-amber-500/30 my-2" />
                <div className="bg-black/40 p-2 rounded">
                  <p className="text-gray-400 text-[10px] mb-1">If ATH Reached:</p>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-xs">
                      Your {paymentCurrency === 'SOL'
                        ? `${parseFloat(amount).toFixed(2)} SOL (~$${usdAmount.toFixed(2)})`
                        : `$${parseFloat(amount).toFixed(2)}`
                      }
                    </span>
                    <span className="text-sm">→</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ${upsideCalc.athValue.toFixed(2)} 💵
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-[10px]">Potential Profit:</span>
                    <span className="text-emerald-400 font-semibold text-xs">
                      +${upsideCalc.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSwap}
            disabled={!connected || isSwapping || !quote || isLoadingQuote}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
              !connected
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : activeTab === 'buy'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
            } ${isSwapping ? 'opacity-50 cursor-wait' : ''}`}
          >
            {!connected
              ? 'Connect Wallet'
              : isSwapping
              ? 'Processing...'
              : activeTab === 'buy'
              ? `Buy ${token.symbol}`
              : `Sell ${token.symbol}`}
          </button>

          {!connected && (
            <p className="text-[10px] text-gray-500 text-center mt-2">
              Connect your wallet to start trading
            </p>
          )}
        </div>

      <style jsx global>{`
        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #06b6d4 0%, #14b8a6 100%);
          border-radius: 4px;
          border: 2px solid rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0891b2 0%, #0d9488 100%);
        }

        /* Firefox scrollbar styling */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #06b6d4 rgba(0, 0, 0, 0.3);
        }

        /* Custom Number Input Spinner */
        .custom-input::-webkit-outer-spin-button,
        .custom-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
          width: 16px;
          height: 100%;
          cursor: pointer;
          background: linear-gradient(180deg, #06b6d4 0%, #14b8a6 100%);
          border-radius: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .custom-input::-webkit-outer-spin-button:hover,
        .custom-input::-webkit-inner-spin-button:hover {
          opacity: 1;
        }

        /* For Firefox */
        .custom-input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        .custom-input:hover::-webkit-outer-spin-button,
        .custom-input:hover::-webkit-inner-spin-button {
          -webkit-appearance: inner-spin-button;
          appearance: inner-spin-button;
        }
      `}</style>
    </div>
  );
}
