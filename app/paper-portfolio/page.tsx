'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { getMemeTokensData, MemeTokenData } from '@/lib/helius';

interface PaperHolding {
  tokenAddress: string;
  allocation: number; // USD amount allocated
}

interface PaperPortfolioData {
  holdings: PaperHolding[];
}

const STORAGE_KEY = 'paper-portfolio';

function loadPaperPortfolio(): PaperPortfolioData {
  if (typeof window === 'undefined') return { holdings: [] };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { holdings: [] };
    }
  }
  return { holdings: [] };
}

function savePaperPortfolio(data: PaperPortfolioData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function PaperPortfolioPage() {
  const [tokens, setTokens] = useState<MemeTokenData[]>([]);
  const [holdings, setHoldings] = useState<PaperHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<MemeTokenData | null>(null);
  const [allocationAmount, setAllocationAmount] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenData = await getMemeTokensData();
        setTokens(tokenData);
        const portfolio = loadPaperPortfolio();
        setHoldings(portfolio.holdings);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredTokens = tokens.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const handleAddHolding = () => {
    if (!selectedToken || !allocationAmount) return;
    const amount = parseFloat(allocationAmount);
    if (isNaN(amount) || amount <= 0) return;

    const existingIndex = holdings.findIndex(h => h.tokenAddress === selectedToken.address);
    let newHoldings: PaperHolding[];

    if (existingIndex >= 0) {
      // Update existing holding
      newHoldings = [...holdings];
      newHoldings[existingIndex].allocation += amount;
    } else {
      // Add new holding
      newHoldings = [...holdings, { tokenAddress: selectedToken.address, allocation: amount }];
    }

    setHoldings(newHoldings);
    savePaperPortfolio({ holdings: newHoldings });
    setShowAddModal(false);
    setSelectedToken(null);
    setAllocationAmount('');
    setSearchQuery('');
  };

  const handleRemoveHolding = (tokenAddress: string) => {
    const newHoldings = holdings.filter(h => h.tokenAddress !== tokenAddress);
    setHoldings(newHoldings);
    savePaperPortfolio({ holdings: newHoldings });
  };

  const getTokenData = (address: string) => tokens.find(t => t.address === address);

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.00001) return `$${price.toExponential(2)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  // Calculate totals
  const totalAllocation = holdings.reduce((sum, h) => sum + h.allocation, 0);
  const totalATHReturn = holdings.reduce((sum, h) => {
    const token = getTokenData(h.tokenAddress);
    if (!token || !token.price || !token.athPrice) return sum;
    const multiplier = token.athPrice / token.price;
    return sum + (h.allocation * multiplier);
  }, 0);

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Paper Portfolio</h1>
            <p className="text-sm text-gray-400 mt-1">Track potential returns if tokens reach ATH</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Token
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total Allocation</div>
            <div className="text-xl font-bold text-white">{formatCurrency(totalAllocation)}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total ATH Return</div>
            <div className="text-xl font-bold text-emerald-400">{formatCurrency(totalATHReturn)}</div>
            {totalAllocation > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                {((totalATHReturn / totalAllocation - 1) * 100).toFixed(1)}% gain
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : holdings.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-400 mb-4">No tokens in your paper portfolio yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-all"
            >
              Add Your First Token
            </button>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-xs text-gray-400">
                  <th className="text-left py-3 px-4">Token</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">ATH Price</th>
                  <th className="text-right py-3 px-4">Allocation</th>
                  <th className="text-right py-3 px-4">ATH Return</th>
                  <th className="text-right py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const token = getTokenData(holding.tokenAddress);
                  if (!token) return null;

                  const multiplier = token.athPrice && token.price ? token.athPrice / token.price : 1;
                  const athReturn = holding.allocation * multiplier;
                  const percentFromATH = token.athPrice && token.price
                    ? ((token.athPrice - token.price) / token.athPrice) * 100
                    : 0;

                  return (
                    <tr key={holding.tokenAddress} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {token.logoUrl ? (
                            <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium">{token.name}</div>
                            <div className="text-xs text-gray-400">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-white">{formatPrice(token.price)}</div>
                        <div className="text-xs text-red-400">-{percentFromATH.toFixed(1)}% from ATH</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-amber-400">{formatPrice(token.athPrice)}</div>
                        <div className="text-xs text-gray-400">{multiplier.toFixed(1)}x potential</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-white">{formatCurrency(holding.allocation)}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-emerald-400 font-semibold">{formatCurrency(athReturn)}</div>
                        <div className="text-xs text-emerald-400/70">+{((multiplier - 1) * 100).toFixed(0)}%</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRemoveHolding(holding.tokenAddress)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Token Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Add Token to Paper Portfolio</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedToken(null);
                    setAllocationAmount('');
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Token Search */}
                {!selectedToken ? (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Search Token</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or symbol..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      autoFocus
                    />
                    {searchQuery && filteredTokens.length > 0 && (
                      <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg">
                        {filteredTokens.map((token) => (
                          <button
                            key={token.address}
                            onClick={() => {
                              setSelectedToken(token);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
                          >
                            {token.logoUrl ? (
                              <img src={token.logoUrl} alt={token.symbol} className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-400">
                                {token.symbol.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="text-sm text-white">{token.name}</div>
                              <div className="text-xs text-gray-400">{token.symbol}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Selected Token</label>
                    <div className="flex items-center justify-between bg-gray-800 border border-gray-600 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        {selectedToken.logoUrl ? (
                          <img src={selectedToken.logoUrl} alt={selectedToken.symbol} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm text-gray-400">
                            {selectedToken.symbol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">{selectedToken.name}</div>
                          <div className="text-xs text-gray-400">{selectedToken.symbol}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedToken(null)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Change
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Current: {formatPrice(selectedToken.price)} | ATH: {formatPrice(selectedToken.athPrice)} | {selectedToken.athPrice && selectedToken.price ? (selectedToken.athPrice / selectedToken.price).toFixed(1) : 1}x potential
                    </div>
                  </div>
                )}

                {/* Allocation Amount */}
                {selectedToken && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Allocation (USD)</label>
                    <input
                      type="number"
                      value={allocationAmount}
                      onChange={(e) => setAllocationAmount(e.target.value)}
                      placeholder="Enter amount in USD"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      min="0"
                      step="any"
                    />
                    {allocationAmount && selectedToken.athPrice && selectedToken.price && (
                      <div className="mt-2 text-sm text-emerald-400">
                        ATH Return: {formatCurrency(parseFloat(allocationAmount) * (selectedToken.athPrice / selectedToken.price))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedToken(null);
                    setAllocationAmount('');
                    setSearchQuery('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHolding}
                  disabled={!selectedToken || !allocationAmount || parseFloat(allocationAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Portfolio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
