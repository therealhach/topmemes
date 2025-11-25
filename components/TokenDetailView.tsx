'use client';

import { useEffect, useState, useCallback } from 'react';
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
import PriceChart from './PriceChart';

type TokenCategory = 'dogs' | 'cats' | 'ai' | 'others';

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
  chain?: 'solana' | 'ethereum';
  liquidity?: number;
}

interface TokenDetailViewProps {
  token: TokenData;
  onBack: () => void;
  allTokens: TokenData[];
  onTokenSelect?: (token: TokenData) => void;
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
  if (price < 0.00000001) return `$${price.toFixed(10)}`;
  if (price < 0.0000001) return `$${price.toFixed(9)}`;
  if (price < 0.000001) return `$${price.toFixed(8)}`;
  if (price < 0.00001) return `$${price.toFixed(7)}`;
  if (price < 0.0001) return `$${price.toFixed(6)}`;
  if (price < 0.001) return `$${price.toFixed(5)}`;
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
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

export default function TokenDetailView({ token, onBack, allTokens, onTokenSelect }: TokenDetailViewProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>('buy');
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>('SOL');
  const [amount, setAmount] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [tokenDecimals, setTokenDecimals] = useState<number>(6);
  const [swapStatus, setSwapStatus] = useState<{ type: 'success' | 'error'; message: string; txid?: string } | null>(null);
  const [slippageBps, setSlippageBps] = useState<number>(300); // 3% default
  const [recentSwaps, setRecentSwaps] = useState<any[]>([]);

  useEffect(() => {
    fetchSolPrice();
  }, []);

  // Fetch user's recent swaps for this token
  useEffect(() => {
    const fetchRecentSwaps = async () => {
      if (!publicKey) {
        setRecentSwaps([]);
        return;
      }
      try {
        const response = await fetch(`/api/swap-history?wallet=${publicKey.toBase58()}&token=${token.address}&limit=3`);
        if (response.ok) {
          const data = await response.json();
          setRecentSwaps(data.swaps || []);
        }
      } catch (error) {
        console.error('Error fetching recent swaps:', error);
      }
    };
    fetchRecentSwaps();
  }, [token.address, swapStatus, publicKey]); // Refetch when swap status changes or wallet connects

  // Fetch token decimals
  useEffect(() => {
    const fetchTokenDecimals = async () => {
      if (!token?.address) return;
      try {
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getAccountInfo',
            params: [token.address, { encoding: 'jsonParsed' }],
          }),
        });
        const data = await response.json();
        if (data.result?.value?.data?.parsed?.info?.decimals !== undefined) {
          setTokenDecimals(data.result.value.data.parsed.info.decimals);
        }
      } catch (error) {
        console.error('Error fetching token decimals:', error);
        setTokenDecimals(6); // Default to 6
      }
    };
    fetchTokenDecimals();
  }, [token?.address]);

  useEffect(() => {
    if (connected && publicKey && token) {
      fetchBalances();
    }
  }, [connected, publicKey, token]);

  useEffect(() => {
    const doFetchQuote = async () => {
      if (!token?.address || !amount || parseFloat(amount) <= 0) {
        setQuote(null);
        return;
      }

      setIsLoadingQuote(true);
      try {
        let inputMint: string;
        let outputMint: string;
        let amountInSmallestUnit: number;

        if (activeTab === 'buy') {
          inputMint = paymentCurrency === 'USDC' ? TOKENS.USDC : TOKENS.SOL;
          outputMint = token.address;
          const decimals = paymentCurrency === 'USDC' ? 6 : 9;
          amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, decimals));
        } else {
          inputMint = token.address;
          outputMint = paymentCurrency === 'USDC' ? TOKENS.USDC : TOKENS.SOL;
          amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, tokenDecimals));
        }

        console.log('Fetching quote:', { inputMint, outputMint, amountInSmallestUnit, tokenDecimals, slippageBps });
        const jupiterQuote = await getJupiterQuote(inputMint, outputMint, amountInSmallestUnit, slippageBps);
        console.log('Jupiter quote result:', jupiterQuote);
        setQuote(jupiterQuote);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const debounceTimer = setTimeout(doFetchQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [amount, paymentCurrency, activeTab, token?.address, tokenDecimals, slippageBps]);

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
      setSolBalance(solBal);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleSwap = async () => {
    if (!quote || !publicKey || !signTransaction) {
      setSwapStatus({ type: 'error', message: 'Please connect your wallet' });
      return;
    }

    setIsSwapping(true);
    setSwapStatus(null);
    try {
      const swapTransaction = await getJupiterSwapTransaction(quote, publicKey.toBase58(), true);
      if (!swapTransaction) throw new Error('Failed to get swap transaction');

      const txid = await executeSwap(connection, swapTransaction, { signTransaction });

      // Store swap data immediately after submission (status: submitted)
      const swapAmountNum = parseFloat(amount) || 0;
      const tokenAmountNum = activeTab === 'buy'
        ? parseInt(quote.outAmount) / Math.pow(10, tokenDecimals)
        : parseFloat(amount);

      try {
        await fetch('/api/store-swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: publicKey.toBase58(),
            paymentCurrency: paymentCurrency,
            swapAmount: swapAmountNum,
            tokenAddress: token.address,
            tokenSymbol: token.symbol,
            tokenAmount: tokenAmountNum,
            tokenPrice: token.price || 0,
            txSignature: txid,
            swapType: activeTab,
            status: 'submitted',
          }),
        });
      } catch (storeError) {
        console.error('Error storing swap data:', storeError);
      }

      setSwapStatus({ type: 'success', message: 'Swap submitted!', txid });
      await fetchBalances();
      setAmount('');
      setQuote(null);
    } catch (error) {
      console.error('Swap error:', error);
      setSwapStatus({ type: 'error', message: error instanceof Error ? error.message : 'Swap failed' });
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

  const outputAmount = quote
    ? activeTab === 'buy'
      ? parseInt(quote.outAmount) / Math.pow(10, tokenDecimals)
      : parseInt(quote.outAmount) / Math.pow(10, paymentCurrency === 'USDC' ? 6 : 9)
    : 0;

  const usdAmount = activeTab === 'buy' && paymentCurrency === 'SOL'
    ? (parseFloat(amount) || 0) * solPrice
    : parseFloat(amount) || 0;

  const upsideCalc = activeTab === 'buy' && token.price
    ? calculateUpsideToATH(usdAmount, token.price, token.athPrice)
    : null;

  const currentBalance = activeTab === 'buy'
    ? paymentCurrency === 'USDC' ? usdcBalance : solBalance
    : tokenBalance;

  return (
    <div className="w-full max-w-7xl mx-auto pl-14">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tokens
      </button>

      {/* Main Layout - Two Columns */}
      <div className="flex gap-4">
        {/* Left Column - Chart + Stats */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Chart */}
          <div className="bg-transparent rounded-xl p-4">
            <PriceChart
              tokenAddress={token.address}
              chain={token.chain || 'solana'}
              tokenSymbol={token.symbol}
              tokenLogoUrl={token.logoUrl}
              className="h-[400px]"
            />
          </div>

          {/* Token Stats - Under Chart */}
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 mb-1">Price</p>
                <p className="text-sm font-bold text-emerald-400">{token.price ? formatPrice(token.price) : 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 mb-1">24h Change</p>
                <p className={`text-sm font-bold ${token.twentyFourHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {token.twentyFourHourChange >= 0 ? '+' : ''}{token.twentyFourHourChange.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 mb-1">24h Volume</p>
                <p className="text-sm font-bold text-white">{formatNumber(token.twentyFourHourVolume)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 mb-1">ATH Price</p>
                <p className="text-sm font-bold text-amber-400">{formatPrice(token.athPrice)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 mb-1">Liquidity</p>
                <p className="text-sm font-bold text-white">{token.liquidity ? formatNumber(token.liquidity) : 'N/A'}</p>
              </div>
            </div>

          </div>

          {/* Progress Bar - Price to ATH */}
          <div className="mt-3">
            <div className="flex items-center justify-center mb-2">
              <span className="text-xs text-gray-400">{Math.min(100, (token.price || 0) / token.athPrice * 100).toFixed(1)}% to ATH</span>
            </div>
            <div className="flex items-center gap-[1px]">
              {Array.from({ length: 100 }).map((_, index) => {
                const progressPercent = Math.min(100, (token.price || 0) / token.athPrice * 100);
                const filledBlocks = Math.max(3, Math.round(progressPercent)); // Minimum 3 blocks filled
                const isFilled = index < filledBlocks;

                // Color based on progress
                let blockColor = 'bg-gray-700/50';
                if (isFilled) {
                  if (progressPercent >= 80) blockColor = 'bg-emerald-500';
                  else if (progressPercent >= 60) blockColor = 'bg-cyan-500';
                  else if (progressPercent >= 40) blockColor = 'bg-yellow-500';
                  else if (progressPercent >= 20) blockColor = 'bg-orange-500';
                  else blockColor = 'bg-rose-500';
                }

                return (
                  <div
                    key={index}
                    className={`flex-1 h-6 rounded-[1px] transition-all duration-300 ${blockColor}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-cyan-400">{token.price ? formatPrice(token.price) : 'N/A'}</span>
              <span className="text-sm font-bold text-amber-400">{formatPrice(token.athPrice)}</span>
            </div>
          </div>

          {/* My Recent Transactions */}
          {recentSwaps.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">Last Transactions</p>
                <a href="/portfolio" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">View More</a>
              </div>
              <div className="space-y-1.5">
                {recentSwaps.map((swap: any) => (
                  <a
                    key={swap.id}
                    href={`https://solscan.io/tx/${swap.tx_signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/[0.03] backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        swap.swap_type === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                      }`}>
                        {swap.swap_type === 'buy' ? (
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0-16l-4 4m4-4l4 4" />
                          </svg>
                        ) : (
                          <svg className="w-2.5 h-2.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${swap.swap_type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {swap.swap_type === 'buy' ? '+' : '-'}{formatTokenAmount(swap.token_amount)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {swap.swap_amount.toFixed(4)} {swap.payment_currency}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Token Info & Trading */}
        <div className="w-80 flex flex-col gap-3">
          {/* Token Logo and Title */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              {token.logoUrl ? (
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-9 h-9 rounded-full border border-cyan-500/30"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold border border-cyan-500/30">
                  {token.symbol.substring(0, 2)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-bold text-white">{token.name}</h1>
                  {token.chain === 'ethereum' ? (
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-3 h-3" />
                  ) : (
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="SOL" className="w-2.5 h-2.5" />
                  )}
                </div>
                <p className="text-xs text-cyan-400/70">{token.symbol}</p>
              </div>
            </div>

            {/* Contract Address */}
            <div className="flex items-center justify-between bg-black/30 rounded-lg px-2 py-1.5">
              <code className="text-[10px] text-gray-400">
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </code>
              <div className="flex items-center gap-2">
                <a
                  href={`https://dexscreener.com/${token.chain === 'ethereum' ? 'ethereum' : 'solana'}/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors"
                  title="View on DexScreener"
                >
                  <img src="https://dexscreener.com/favicon.ico" alt="DexScreener" className="w-3.5 h-3.5" />
                </a>
                {token.address.endsWith('pump') && (
                  <a
                    href={`https://pump.fun/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                    title="View on Pump.fun"
                  >
                    <img src="https://pump.fun/favicon.ico" alt="Pump.fun" className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => navigator.clipboard.writeText(token.address)}
                  className="text-gray-500 hover:text-cyan-400 transition-colors"
                  title="Copy address"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Market Cap & Upside to ATH */}
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="bg-black/30 rounded-lg px-2 py-1.5">
                <p className="text-[9px] text-gray-500 mb-0.5">Market Cap</p>
                <p className="text-xs font-bold text-white">{formatNumber(token.currentMcap)}</p>
              </div>
              <div className="bg-black/30 rounded-lg px-2 py-1.5">
                <p className="text-[9px] text-gray-500 mb-0.5">Upside to ATH</p>
                <p className="text-xs font-bold text-teal-400">+{token.percentToGainPeak.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Buy/Sell Modal */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-xl p-4">
            {/* ETH Token Notice */}
            {token.chain === 'ethereum' ? (
              <div className="flex flex-col items-center justify-center py-8">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-gray-400 text-sm text-center mb-2">ETH trading coming soon</p>
                <p className="text-gray-500 text-xs text-center">Ethereum token swaps will be available shortly</p>
              </div>
            ) : (
            <>
            {/* Buy/Sell Tabs */}
            <div className="flex items-center gap-1 mb-4 bg-transparent">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'buy'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'sell'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sell
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-baseline cursor-text"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input');
                    if (input) input.focus();
                  }}
                >
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setAmount(val);
                    }}
                    placeholder="0"
                    className="bg-transparent text-3xl font-light text-white focus:outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-3xl font-light text-gray-500">
                    {activeTab === 'buy'
                      ? (paymentCurrency === 'USDC' ? 'USD' : 'SOL')
                      : token.symbol
                    }
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (activeTab === 'buy') {
                      const maxBal = paymentCurrency === 'USDC' ? usdcBalance : solBalance;
                      // Leave some SOL for gas fees and limit decimals
                      const adjustedMax = paymentCurrency === 'SOL'
                        ? Math.max(0, maxBal - 0.01).toFixed(4)
                        : maxBal.toFixed(2);
                      setAmount(adjustedMax);
                    } else {
                      // Selling - limit token decimals to 4
                      setAmount(tokenBalance.toFixed(4));
                    }
                  }}
                  className={`px-3 py-1 text-white text-xs font-medium rounded-full transition-colors ${
                    activeTab === 'buy'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Max
                </button>
              </div>
              <p className="text-cyan-400 text-xs mt-1">
                {isLoadingQuote ? (
                  <span className="text-gray-500">Loading quote...</span>
                ) : quote ? (
                  activeTab === 'buy'
                    ? `≈ ${outputAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${token.symbol}`
                    : `≈ ${outputAmount.toFixed(4)} ${paymentCurrency}`
                ) : (
                  <span className="text-gray-500">Enter amount to see quote</span>
                )}
              </p>
            </div>

            {/* Pay With Section */}
            <div className="mb-3">
              <div className="flex items-center gap-3 py-3 border-t border-gray-800">
                {paymentCurrency === 'SOL' ? (
                  <img
                    src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                    alt="SOL"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <img
                    src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
                    alt="USDC"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-400 text-xs">{activeTab === 'buy' ? 'Pay with' : 'Receive'}</p>
                  <button
                    onClick={() => {
                      setPaymentCurrency(paymentCurrency === 'SOL' ? 'USDC' : 'SOL');
                      setAmount('');
                      setQuote(null);
                    }}
                    className="text-white text-sm font-medium flex items-center gap-1 hover:text-cyan-400 transition-colors"
                  >
                    {paymentCurrency}
                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">
                    {(paymentCurrency === 'SOL' ? solBalance : usdcBalance).toFixed(4)}
                  </p>
                  <p className="text-gray-500 text-xs">Balance</p>
                </div>
              </div>
            </div>

            {/* Token Section */}
            <div className="mb-4">
              <div className="flex items-center gap-3 py-3 border-t border-gray-800">
                {token.logoUrl ? (
                  <img src={token.logoUrl} alt={token.name} className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {token.symbol.substring(0, 2)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-400 text-xs">{activeTab === 'buy' ? 'Buy' : 'Sell'}</p>
                  <p className="text-white text-sm font-medium">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{tokenBalance.toFixed(4)}</p>
                  <p className="text-gray-500 text-xs">Balance</p>
                </div>
              </div>
            </div>

            {/* ATH ROI Calculator */}
            {activeTab === 'buy' && upsideCalc && parseFloat(amount) > 0 && (
              <div className="flex items-center justify-between py-2 px-3 mb-3 bg-gradient-to-r from-amber-900/20 to-transparent rounded-lg border border-amber-500/20">
                <p className="text-xs text-gray-400">If ATH</p>
                <p className="text-emerald-400 font-bold text-sm">${upsideCalc.athValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-amber-400 text-xs font-normal">(+{token.percentToGainPeak.toLocaleString(undefined, { maximumFractionDigits: 0 })}%)</span></p>
              </div>
            )}

            {/* Quick Amount Buttons */}
            {activeTab === 'buy' ? (
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {paymentCurrency === 'SOL'
                  ? [0.1, 0.5, 1, 3].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        className="py-1.5 px-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        {value} SOL
                      </button>
                    ))
                  : [10, 50, 100, 500].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        className="py-1.5 px-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors"
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
                    className="py-1.5 px-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    {value}%
                  </button>
                ))}
              </div>
            )}

            {/* Slippage Setting */}
            <div className="flex items-center justify-between mb-3 py-2 px-3 bg-black/30 rounded-lg">
              <span className="text-xs text-gray-400">Slippage</span>
              <div className="flex items-center gap-1">
                {[100, 300, 500, 1000].map((bps) => (
                  <button
                    key={bps}
                    onClick={() => setSlippageBps(bps)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      slippageBps === bps
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {bps / 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSwap}
              disabled={!connected || isSwapping || !quote || isLoadingQuote}
              className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                !connected
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : activeTab === 'buy'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
              } ${isSwapping || isLoadingQuote ? 'opacity-50 cursor-wait' : ''}`}
            >
              {!connected
                ? 'Connect Wallet'
                : isSwapping
                ? 'Processing...'
                : isLoadingQuote
                ? 'Getting quote...'
                : activeTab === 'buy'
                ? `Buy ${token.symbol}`
                : `Sell ${token.symbol}`}
            </button>

            {/* Swap Status Message */}
            {swapStatus && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                swapStatus.type === 'success'
                  ? 'text-white'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <p>{swapStatus.message}</p>
                {swapStatus.txid && (
                  <a
                    href={`https://solscan.io/tx/${swapStatus.txid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:opacity-80 mt-1 inline-block"
                  >
                    View on Solscan
                  </a>
                )}
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </div>

      {/* Trending Tokens Section */}
      {(() => {
        const trendingTokens = allTokens
          .filter(t => t.address !== token.address && t.twentyFourHourChange > 0)
          .sort((a, b) => b.twentyFourHourChange - a.twentyFourHourChange)
          .slice(0, 10);

        if (trendingTokens.length === 0) return null;

        return (
          <div className="mt-4 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-bold text-white">Hot Right Now</h3>
              <span className="text-[10px] text-gray-500">— Don't miss these movers</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {trendingTokens.map((t) => (
                <button
                  key={t.address}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onTokenSelect?.(t);
                  }}
                  className="flex items-center gap-2 p-2 bg-black/30 hover:bg-cyan-900/20 rounded-lg transition-all group border border-transparent hover:border-cyan-500/30"
                >
                  {t.logoUrl ? (
                    <img
                      src={t.logoUrl}
                      alt={t.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {t.symbol.substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {t.symbol}
                    </p>
                    <p className="text-emerald-400 text-[10px] font-bold">
                      +{t.twentyFourHourChange.toFixed(1)}%
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
