'use client';

import { useEffect, useState, Suspense } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getMemeTokensData, TokenCategory, Chain } from '@/lib/helius';
import { loadWatchlist } from '@/lib/watchlist';

interface Stats {
  totalMemes: number;
  totalMarketCap: number;
  total24hVolume: number;
  solPrice: number;
  ethPrice: number;
}

type CategoryFilter = TokenCategory | 'all';
type ChainFilter = Chain | 'all';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const { connected } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; symbol: string; address: string; logo?: string }>>([]);
  const [allTokens, setAllTokens] = useState<Array<{ name: string; symbol: string; address: string; logo?: string }>>([]);
  const [stats, setStats] = useState<Stats>({
    totalMemes: 0,
    totalMarketCap: 0,
    total24hVolume: 0,
    solPrice: 0,
    ethPrice: 0,
  });
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Get filters from URL
  const categoryFilter = (searchParams.get('category') as CategoryFilter) || 'all';
  const chainFilter = (searchParams.get('chain') as ChainFilter) || 'all';
  const showWatchlistOnly = pathname === '/watchlist';
  const showLeaderboard = searchParams.get('leaderboard') !== 'false';

  // Handle hydration mismatch for wallet adapter
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load watchlist count on mount and listen for changes
  useEffect(() => {
    setWatchlistCount(loadWatchlist().length);

    // Listen for watchlist changes from other components
    const handleWatchlistChange = () => {
      setWatchlistCount(loadWatchlist().length);
    };

    window.addEventListener('watchlist-updated', handleWatchlistChange);
    return () => window.removeEventListener('watchlist-updated', handleWatchlistChange);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const tokens = await getMemeTokensData();
        const totalMarketCap = tokens.reduce((sum, token) => sum + (token.currentMcap || 0), 0);
        const total24hVolume = tokens.reduce((sum, token) => sum + (token.twentyFourHourVolume || 0), 0);

        // Store tokens for search
        setAllTokens(tokens.map(t => ({
          name: t.name,
          symbol: t.symbol,
          address: t.address,
          logo: t.logoUrl
        })));

        let solPrice = 0;
        let ethPrice = 0;
        try {
          const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum&vs_currencies=usd');
          if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            solPrice = priceData?.solana?.usd || 0;
            ethPrice = priceData?.ethereum?.usd || 0;
          }
        } catch {
          // CoinGecko rate limited, prices stay at 0
        }

        setStats({
          totalMemes: tokens.length,
          totalMarketCap,
          total24hVolume,
          solPrice,
          ethPrice,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter tokens based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allTokens.filter(
      t => t.name.toLowerCase().includes(query) || t.symbol.toLowerCase().includes(query)
    ).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery, allTokens]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleTokenSelect = (address: string) => {
    router.push(`/token/${address}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const buildCategoryUrl = (category: CategoryFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    // Remove view param to exit leaderboard pages when clicking category
    params.delete('view');
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  const buildChainUrl = (chain: ChainFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (chain === 'all') {
      params.delete('chain');
    } else {
      params.set('chain', chain);
    }
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  const toggleLeaderboard = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (showLeaderboard) {
      params.set('leaderboard', 'false');
    } else {
      params.delete('leaderboard');
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const isHomePage = pathname === '/' || pathname === '/watchlist';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background Layer */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-teal-900/30 via-cyan-950/20 to-transparent"></div>
        <div className="absolute inset-0 animate-twinkle" style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, white, transparent),
            radial-gradient(2px 2px at 70% 25%, white, transparent)
          `,
          backgroundSize: '200% 200%',
          opacity: 0.5
        }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 L0,100 L200,60 L400,90 L600,30 L800,70 L1000,50 L1200,80 L1200,200 Z" fill="rgba(0,0,0,0.9)" />
            <path d="M0,200 L0,120 L150,80 L350,100 L550,50 L750,85 L950,65 L1200,95 L1200,200 Z" fill="rgba(0,0,0,0.7)" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-12 w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-2xl opacity-80 animate-float">
          <div className="absolute inset-2 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full"></div>
          <div className="absolute top-4 right-6 w-6 h-6 bg-gray-600 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 right-10 w-4 h-4 bg-gray-600 rounded-full opacity-40"></div>
          <div className="absolute top-12 right-4 w-3 h-3 bg-gray-700 rounded-full opacity-30"></div>
          <div className="absolute -inset-8 bg-gray-400/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center px-2 sm:px-4 py-4">
        {/* Top Stats Bar */}
        <div className="w-full max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 py-1 text-[10px] sm:text-xs text-gray-400 animate-fade-in-up relative z-50 gap-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Memes:</span>
              <span className="text-white font-semibold">{stats.totalMemes}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 hidden sm:inline">Total Memecoins Marketcap:</span>
              <span className="text-gray-500 sm:hidden">Marketcap:</span>
              <span className="text-white font-semibold">{formatLargeNumber(stats.totalMarketCap)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">24h Vol:</span>
              <span className="text-white font-semibold">{formatLargeNumber(stats.total24hVolume)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">SOL:</span>
              <span className="text-white font-semibold">${stats.solPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">ETH:</span>
              <span className="text-white font-semibold">${stats.ethPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <WalletMultiButton className="!bg-gradient-to-r !from-teal-500 !to-cyan-500 hover:!from-teal-600 hover:!to-cyan-600 !transition-all !duration-200 !rounded !h-5 !px-1.5 !text-[8px] !font-semibold !shadow-lg !relative !z-50" />
            )}
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-2"></div>

        {/* Navigation Bar */}
        <header className="w-full max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 py-2 animate-fade-in-up relative z-50">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="solana-gradient-text text-xl md:text-2xl font-bold tracking-tight leading-none">
                Top Memes
              </h1>
              <p className="font-garet text-white text-[10px] md:text-xs font-semibold tracking-widest">
                MEMECOIN SUPERCYCLE
              </p>
            </div>
          </Link>

          {/* Navigation Links - Category Filters */}
          {isHomePage && (
            <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <Link
                href={buildCategoryUrl('all')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                All
              </Link>
              <Link
                href={buildCategoryUrl('dogs')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'dogs'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Dogs
              </Link>
              <Link
                href={buildCategoryUrl('cats')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'cats'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Cats
              </Link>
              <Link
                href={buildCategoryUrl('frogs')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'frogs'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Frogs
              </Link>
              <Link
                href={buildCategoryUrl('ai')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'ai'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                AI
              </Link>
              <Link
                href={buildCategoryUrl('others')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === 'others'
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Others
              </Link>
            </nav>
          )}

          {/* Chain Filters, Leaderboard Toggle, and Watchlist - Right side */}
          <div className="sm:ml-auto flex items-center gap-1.5">
            {isHomePage && (
              <>
                <Link
                  href={buildChainUrl(chainFilter === 'solana' ? 'all' : 'solana')}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                    chainFilter === 'solana'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="SOL" className="w-2.5 h-2.5" />
                  SOL Memes
                </Link>
                <Link
                  href={buildChainUrl(chainFilter === 'ethereum' ? 'all' : 'ethereum')}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                    chainFilter === 'ethereum'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-2.5 h-2.5" />
                  ETH Memes
                </Link>
                <div className="w-px h-3 bg-gray-600"></div>
                <button
                  onClick={toggleLeaderboard}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-all ${
                    showLeaderboard
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Leaderboard
                </button>
                <div className="w-px h-3 bg-gray-600"></div>
              </>
            )}
            <Link
              href="/watchlist"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-all ${
                pathname === '/watchlist'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <svg
                className={`w-2.5 h-2.5 ${pathname === '/watchlist' ? 'text-yellow-400' : 'text-yellow-400/70'}`}
                fill={pathname === '/watchlist' ? 'currentColor' : 'none'}
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth={pathname === '/watchlist' ? 0 : 1.5}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Watchlist
              {watchlistCount > 0 && (
                <span className={`text-[9px] px-1 py-0.5 rounded ${
                  pathname === '/watchlist' ? 'bg-yellow-500/30' : 'bg-gray-700/50'
                }`}>
                  {watchlistCount}
                </span>
              )}
            </Link>
            {mounted && connected && (
              <>
                <div className="w-px h-3 bg-gray-600"></div>
                <Link
                  href="/portfolio"
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-all ${
                    pathname === '/portfolio'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Portfolio
                </Link>
              </>
            )}
            {/* Search Button */}
            <div className="relative">
              <div className="w-px h-3 bg-gray-600 inline-block mr-1.5"></div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-1.5 rounded transition-all ${
                  searchOpen
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                title="Search tokens"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-[100]">
                  <div className="p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tokens..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      autoFocus
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="max-h-64 overflow-y-auto border-t border-gray-700 custom-scrollbar custom-scrollbar-cyan">
                      {searchResults.map((token) => (
                        <button
                          key={token.address}
                          onClick={() => handleTokenSelect(token.address)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 transition-colors text-left"
                        >
                          {token.logo ? (
                            <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-white font-medium">{token.name}</div>
                            <div className="text-xs text-gray-400">{token.symbol}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="px-3 py-4 text-sm text-gray-400 text-center border-t border-gray-700">
                      No tokens found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Horizontal Line */}
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-4"></div>

        {children}

        <footer className="mt-16 py-8 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <span className="solana-gradient-text text-lg font-bold">Top Memes</span>
                <p className="text-gray-500 text-xs mt-2">Track and trade Solana memecoins</p>
                <div className="flex items-center gap-3 mt-3">
                  <a href="https://x.com/topmemes_io" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">Features</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <Link href="/heatmap" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Heatmap
                  </Link>
                  <Link href="/paper-portfolio" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Paper Portfolio
                  </Link>
                  <Link href="/watchlist" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Watchlist
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">More of us</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <Link href="/about" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <Link href="/privacy" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-4 border-t border-gray-800/50 text-center">
              <span className="text-gray-500 text-xs">© 2025 TopMemes.io. All rights reserved.</span>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-6 px-4">
            <p className="text-[10px] text-gray-600 leading-relaxed text-center">
              <span className="font-semibold text-gray-500">IMPORTANT DISCLAIMER:</span> All content provided herein our website, hyperlinked sites, associated applications, forums, blogs, social media accounts and other platforms (&ldquo;Site&rdquo;) is for your general information only, procured from third party sources. We make no warranties of any kind in relation to our content, including but not limited to accuracy and updatedness. No part of the content that we provide constitutes financial advice, legal advice or any other form of advice meant for your specific reliance for any purpose. Any use or reliance on our content is solely at your own risk and discretion. You should conduct your own research, review, analyse and verify our content before relying on them. Trading is a highly risky activity that can lead to major losses, please therefore consult your financial advisor before making any decision. No content on our Site is meant to be a solicitation or offer.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
