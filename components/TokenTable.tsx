'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getMemeTokensData, TokenCategory } from '@/lib/helius';
import { loadTokenCache, saveTokenCache, getCacheTimestamp, getTimeSinceUpdate, CachedToken } from '@/lib/tokenCache';
import { loadWatchlist, toggleWatchlist, WatchlistItem } from '@/lib/watchlist';
import bs58 from 'bs58';

export interface TokenData {
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
  chain?: 'solana' | 'ethereum';
}

const ADMIN_WALLET = '7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNUx';

export type ChainFilter = 'solana' | 'ethereum' | 'all';

export interface TokenTableProps {
  showWatchlistOnly: boolean;
  onWatchlistChange: () => void;
  categoryFilter: TokenCategory | 'all';
  chainFilter?: ChainFilter;
  onTokensLoaded?: (tokens: TokenData[]) => void;
  onTokenSelect?: (token: TokenData) => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  return `$${num.toLocaleString()}`;
};

const formatVolume = (num: number): string => {
  return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
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

const formatPercentage = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export default function TokenTable({ showWatchlistOnly, onWatchlistChange, categoryFilter, chainFilter = 'all', onTokensLoaded, onTokenSelect }: TokenTableProps) {
  const { publicKey, signMessage } = useWallet();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('24h');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoadingFromCache, setIsLoadingFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isAdmin = publicKey?.toBase58() === ADMIN_WALLET;

  // Load watchlist on mount
  useEffect(() => {
    setWatchlist(loadWatchlist());
  }, []);

  // Create a Set of watched addresses for quick lookup
  const watchedAddresses = new Set(watchlist.map(item => item.address));

  // Handle watchlist toggle
  const handleWatchlistToggle = useCallback((e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    const { watchlist: newWatchlist } = toggleWatchlist(address);
    setWatchlist(newWatchlist);
    onWatchlistChange();
    // Dispatch event to update watchlist count in header
    window.dispatchEvent(new Event('watchlist-updated'));
  }, [onWatchlistChange]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new column
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Filter by watchlist, category, and chain
  const filteredTokens = tokens.filter(token => {
    // Watchlist filter
    if (showWatchlistOnly && !watchedAddresses.has(token.address)) {
      return false;
    }
    // Category filter
    if (categoryFilter !== 'all' && token.category !== categoryFilter) {
      return false;
    }
    // Chain filter
    if (chainFilter !== 'all' && token.chain !== chainFilter) {
      return false;
    }
    return true;
  });

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case 'rank':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'mcap':
        aValue = a.currentMcap;
        bValue = b.currentMcap;
        break;
      case 'ath':
        aValue = a.athPrice;
        bValue = b.athPrice;
        break;
      case 'gain':
        aValue = a.percentToGainPeak;
        bValue = b.percentToGainPeak;
        break;
      case '1h':
        aValue = a.oneHourChange;
        bValue = b.oneHourChange;
        break;
      case '24h':
        aValue = a.twentyFourHourChange;
        bValue = b.twentyFourHourChange;
        break;
      case 'volume':
        aValue = a.twentyFourHourVolume;
        bValue = b.twentyFourHourVolume;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalResults = sortedTokens.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalResults);
  const paginatedTokens = sortedTokens.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [showWatchlistOnly, categoryFilter, chainFilter, rowsPerPage]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Real-time clock update for "Last updated" display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchTokens() {
      try {
        // Try to load from cache first
        const cachedTokens = loadTokenCache();
        const cacheTimestamp = getCacheTimestamp();

        if (cachedTokens && cachedTokens.length > 0) {
          // Show cached data immediately with fade effect
          setIsLoadingFromCache(true);
          const formattedCached: TokenData[] = cachedTokens.map((token, index) => {
            const percentToGain = token.athPrice && token.price
              ? ((token.athPrice - token.price) / token.price) * 100
              : 0;
            return {
              id: index + 1,
              name: token.name,
              symbol: token.symbol,
              address: token.address,
              logoUrl: token.logoUrl,
              price: token.price,
              currentMcap: token.currentMcap,
              athPrice: token.athPrice || 0,
              percentToGainPeak: percentToGain,
              oneHourChange: token.oneHourChange,
              twentyFourHourChange: token.twentyFourHourChange,
              twentyFourHourVolume: token.twentyFourHourVolume,
              category: token.category || 'others',
              liquidity: token.liquidity,
              chain: token.chain || 'solana',
            };
          });
          setTokens(formattedCached);
          onTokensLoaded?.(formattedCached);
          setLastUpdated(cacheTimestamp);
          setLoading(false);
        }

        // Fetch fresh data from Helius
        const heliusData = await getMemeTokensData();

        if (heliusData && heliusData.length > 0) {
          const formattedData: TokenData[] = heliusData.map((token, index) => {
            const percentToGain = token.athPrice && token.price
              ? ((token.athPrice - token.price) / token.price) * 100
              : 0;
            return {
              id: index + 1,
              name: token.name,
              symbol: token.symbol,
              address: token.address,
              logoUrl: token.logoUrl,
              price: token.price,
              currentMcap: token.currentMcap,
              athPrice: token.athPrice || 0,
              percentToGainPeak: percentToGain,
              oneHourChange: token.oneHourChange,
              twentyFourHourChange: token.twentyFourHourChange,
              twentyFourHourVolume: token.twentyFourHourVolume,
              category: token.category || 'others',
              liquidity: token.liquidity,
              chain: token.chain || 'solana',
            };
          });

          // Save to cache
          saveTokenCache(heliusData.map(token => ({
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            logoUrl: token.logoUrl,
            price: token.price,
            currentMcap: token.currentMcap,
            athPrice: token.athPrice || 0,
            oneHourChange: token.oneHourChange,
            twentyFourHourChange: token.twentyFourHourChange,
            twentyFourHourVolume: token.twentyFourHourVolume,
            category: token.category || 'others',
            liquidity: token.liquidity,
            chain: token.chain || 'solana',
          })));

          setTokens(formattedData);
          onTokensLoaded?.(formattedData);
          setLastUpdated(Date.now());
          setIsLoadingFromCache(false);
          setError(null);
        } else {
          // If Helius fails and we have no cache, show nothing
          if (!cachedTokens || cachedTokens.length === 0) {
            setError('Failed to load token data');
            setTokens([]);
          }
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
        // If we have cached data, keep showing it
        const cachedTokens = loadTokenCache();
        if (!cachedTokens || cachedTokens.length === 0) {
          setError('Failed to load token data');
          setTokens([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  const handleEditClick = (tokenAddress: string, currentAth: number) => {
    setEditingToken(tokenAddress);
    setEditValue(currentAth.toString());
  };

  const handleCancelEdit = () => {
    setEditingToken(null);
    setEditValue('');
  };

  const handleUpdateATH = async (tokenAddress: string) => {
    if (!publicKey || !signMessage) {
      alert('Please connect your wallet');
      return;
    }

    if (!isAdmin) {
      alert('Only admin can update ATH values');
      return;
    }

    const athPrice = parseFloat(editValue);
    if (isNaN(athPrice) || athPrice < 0) {
      alert('Please enter a valid ATH price');
      return;
    }

    try {
      setIsUpdating(true);

      // Create message to sign
      const message = `Update ATH for ${tokenAddress} to ${athPrice} at ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      // Sign the message
      const signature = await signMessage(messageBytes);
      const signatureBase58 = bs58.encode(signature);

      // Call API to update
      const response = await fetch('/api/update-ath', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress,
          athPrice,
          publicKey: publicKey.toBase58(),
          signature: signatureBase58,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update ATH');
      }

      // Update local state
      setTokens(prevTokens =>
        prevTokens.map(token => {
          if (token.address === tokenAddress) {
            const percentToGain = athPrice && token.price
              ? ((athPrice - token.price) / token.price) * 100
              : 0;
            return {
              ...token,
              athPrice,
              percentToGainPeak: percentToGain,
            };
          }
          return token;
        })
      );

      setEditingToken(null);
      setEditValue('');
      alert('ATH updated successfully!');
    } catch (error) {
      console.error('Error updating ATH:', error);
      alert(error instanceof Error ? error.message : 'Failed to update ATH');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl flex justify-center items-center py-20">
        <div className="text-white text-xl">Loading tokens...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 items-start relative justify-center">
      {/* Table Section */}
      <div className="w-full max-w-full xl:w-[1160px] flex-shrink-0 overflow-x-auto">
        {isAdmin && (
          <div className="mb-4 text-emerald-400 text-sm font-semibold">
            Admin Mode Active
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}
        <div className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl backdrop-blur-md bg-black/40">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-teal-900/80 via-cyan-900/80 to-teal-900/80 border-b border-cyan-500/30">
              <th className="px-2 py-1.5 text-center text-xs font-semibold text-cyan-300 w-10">
                <svg className="w-3 h-3 mx-auto text-yellow-400/60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </th>
              <th
                className="px-2 py-1.5 text-left text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('rank')}
              >
                {sortColumn === 'rank' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}#
              </th>
              <th
                className="px-2 py-1.5 text-left text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('name')}
              >
                {sortColumn === 'name' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}Token
              </th>
              <th
                className="px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('price')}
              >
                {sortColumn === 'price' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}Price
              </th>
              <th
                className="hidden md:table-cell px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('mcap')}
              >
                {sortColumn === 'mcap' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}Mcap
              </th>
              <th
                className="hidden lg:table-cell px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('ath')}
              >
                {sortColumn === 'ath' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}ATH
              </th>
              <th
                className="hidden lg:table-cell px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('gain')}
              >
                {sortColumn === 'gain' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}% to ATH
              </th>
              <th
                className="hidden lg:table-cell px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('1h')}
              >
                {sortColumn === '1h' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}1h
              </th>
              <th
                className="px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('24h')}
              >
                {sortColumn === '24h' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}24h
              </th>
              <th
                className="hidden md:table-cell px-2 py-1.5 text-right text-xs font-semibold text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors select-none"
                onClick={() => handleSort('volume')}
              >
                {sortColumn === 'volume' && <span className="text-[8px] mr-0.5">{sortDirection === 'asc' ? '▲' : '▼'}</span>}Volume
              </th>
              {isAdmin && <th className="px-2 py-1.5 text-center text-xs font-semibold text-cyan-300">Actions</th>}
            </tr>
          </thead>
          <tbody className={`transition-opacity duration-700 ${isLoadingFromCache ? 'opacity-50' : 'opacity-100'}`}>
            {paginatedTokens.map((token, index) => (
              <tr
                key={token.id}
                onClick={() => onTokenSelect?.(token)}
                className={`group ${
                  index % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-800/40'
                } hover:bg-cyan-900/30 transition-all duration-200 border-b border-cyan-500/10 cursor-pointer`}
              >
                {/* Watchlist Star */}
                <td className="px-2 py-2 text-center align-middle" onClick={(e) => handleWatchlistToggle(e, token.address)}>
                  <button
                    className={`p-1 rounded transition-all hover:scale-110 ${
                      watchedAddresses.has(token.address)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-600 hover:text-yellow-400'
                    }`}
                    title={watchedAddresses.has(token.address) ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={watchedAddresses.has(token.address) ? 'currentColor' : 'none'}
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth={watchedAddresses.has(token.address) ? 0 : 1.5}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </td>
                <td className="px-3 py-2 text-sm text-cyan-400/70 align-middle">{startIndex + index + 1}</td>
                <td className="px-2 sm:px-3 py-2 text-[11px] sm:text-sm font-semibold text-white align-middle">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {token.logoUrl ? (
                      <img
                        src={token.logoUrl}
                        alt={token.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold">
                        {token.symbol.substring(0, 2)}
                      </div>
                    )}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="truncate max-w-[80px] sm:max-w-none">{token.name}</span>
                      <span className="text-cyan-400/60 hidden sm:inline">({token.symbol})</span>
                      {token.chain === 'ethereum' ? (
                        <img
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
                          alt="ETH"
                          className="w-2.5 h-2.5"
                          title="Ethereum"
                        />
                      ) : (
                        <img
                          src="https://cryptologos.cc/logos/solana-sol-logo.svg"
                          alt="SOL"
                          className="w-2 h-2"
                          title="Solana"
                        />
                      )}
                      <a
                        href={`/token/${token.address}`}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-1 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded text-[9px] font-medium hover:bg-cyan-500/30 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Buy
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm text-right text-emerald-300 font-semibold align-middle">
                  {token.price ? formatPrice(token.price) : 'N/A'}
                </td>
                <td className="hidden md:table-cell px-3 py-2 text-sm text-right text-gray-200 align-middle">
                  {formatNumber(token.currentMcap)}
                </td>
                <td className="hidden lg:table-cell px-3 py-2 text-sm text-right text-amber-300 font-semibold align-middle">
                  {editingToken === token.address ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        step="0.00000001"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-32 px-2 py-1 bg-gray-800 border border-cyan-500/30 rounded text-white text-sm"
                        disabled={isUpdating}
                      />
                    </div>
                  ) : (
                    token.athPrice ? formatPrice(token.athPrice) : 'N/A'
                  )}
                </td>
                <td className="hidden lg:table-cell px-3 py-2 text-sm text-right font-semibold text-teal-400 align-middle">
                  {formatPercentage(token.percentToGainPeak)}
                </td>
                <td
                  className={`hidden lg:table-cell px-3 py-2 text-sm text-right font-semibold align-middle ${
                    token.oneHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatPercentage(token.oneHourChange)}
                </td>
                <td
                  className={`px-3 py-2 text-sm text-right font-semibold align-middle ${
                    token.twentyFourHourChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatPercentage(token.twentyFourHourChange)}
                </td>
                <td className="hidden md:table-cell px-3 py-2 text-sm text-right text-gray-200 align-middle">
                  {formatVolume(token.twentyFourHourVolume)}
                </td>
                {isAdmin && (
                  <td className="px-3 py-2 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    {editingToken === token.address ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateATH(token.address)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white text-xs rounded font-semibold transition-colors"
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white text-xs rounded font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(token.address, token.athPrice)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded font-semibold transition-colors"
                      >
                        Edit ATH
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {/* Empty state for watchlist filter */}
            {showWatchlistOnly && sortedTokens.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 12 : (publicKey ? 11 : 10)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-gray-400 text-sm">Your watchlist is empty</p>
                    <p className="text-gray-500 text-xs">Click the star icon on tokens to add them to your watchlist</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination Controls */}
        {totalResults > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            {/* Rows per page dropdown - Left */}
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm text-gray-400">Rows:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-gray-800 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page numbers - Center */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &lt;
              </button>
              {getPageNumbers().map((page, idx) => (
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="px-2 text-gray-500">...</span>
                )
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &gt;
              </button>
            </div>

            {/* Results info - Right */}
            <div className="text-sm text-gray-400">
              Showing <span className="text-white font-medium">{startIndex + 1}</span> to <span className="text-white font-medium">{endIndex}</span> of <span className="text-white font-medium">{totalResults}</span> results
            </div>
          </div>
        )}

        {lastUpdated && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            {!isLoadingFromCache && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            )}
            <span className="text-gray-400">
              Last updated: <span className="text-cyan-400 font-medium">{getTimeSinceUpdate(lastUpdated)}</span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
