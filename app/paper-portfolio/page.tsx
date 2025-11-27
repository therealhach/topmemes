'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allocationInputs, setAllocationInputs] = useState<Record<string, string>>({});
  const shareCardRef = useRef<HTMLDivElement>(null);

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

  // Filter tokens not already in portfolio
  const availableTokens = tokens.filter(t =>
    !holdings.some(h => h.tokenAddress === t.address)
  );

  const filteredTokens = availableTokens
    .filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const multiplierA = a.athPrice && a.price ? a.athPrice / a.price : 1;
      const multiplierB = b.athPrice && b.price ? b.athPrice / b.price : 1;
      return multiplierB - multiplierA; // High to low
    });

  const handleAddToken = (token: MemeTokenData) => {
    const amount = parseFloat(allocationInputs[token.address] || '0');
    if (isNaN(amount) || amount <= 0) return;

    const newHoldings = [...holdings, { tokenAddress: token.address, allocation: amount }];
    setHoldings(newHoldings);
    savePaperPortfolio({ holdings: newHoldings });

    // Clear the input for this token
    setAllocationInputs(prev => {
      const updated = { ...prev };
      delete updated[token.address];
      return updated;
    });
  };

  const handleRemoveHolding = (tokenAddress: string) => {
    const newHoldings = holdings.filter(h => h.tokenAddress !== tokenAddress);
    setHoldings(newHoldings);
    savePaperPortfolio({ holdings: newHoldings });
  };

  const [editingHolding, setEditingHolding] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const handleEditHolding = (tokenAddress: string, currentAmount: number) => {
    setEditingHolding(tokenAddress);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = (tokenAddress: string) => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      setEditingHolding(null);
      return;
    }
    const newHoldings = holdings.map(h =>
      h.tokenAddress === tokenAddress ? { ...h, allocation: amount } : h
    );
    setHoldings(newHoldings);
    savePaperPortfolio({ holdings: newHoldings });
    setEditingHolding(null);
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

  // Get sorted holdings data for sharing
  const sortedHoldingsData = holdings
    .map((holding) => {
      const token = getTokenData(holding.tokenAddress);
      if (!token) return null;
      const multiplier = token.athPrice && token.price ? token.athPrice / token.price : 1;
      const athReturn = holding.allocation * multiplier;
      return { holding, token, multiplier, athReturn };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.athReturn - a.athReturn);

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      });
      const link = document.createElement('a');
      link.download = 'paper-portfolio.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleCopyImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      });
      const blob = await fetch(dataUrl).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Paper Portfolio</h1>
            <p className="text-sm text-gray-400 mt-1">Track potential returns if tokens reach ATH</p>
          </div>
          <div className="flex items-center gap-2">
            {holdings.length > 0 && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-all border border-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
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
                <tr className="border-b border-gray-700 text-[10px] text-gray-400">
                  <th className="text-left py-1.5 px-2">Token</th>
                  <th className="text-right py-1.5 px-2 hidden sm:table-cell">Price</th>
                  <th className="text-right py-1.5 px-2 hidden sm:table-cell">ATH Price</th>
                  <th className="text-right py-1.5 px-2">Allocation</th>
                  <th className="text-right py-1.5 px-2">ATH Return</th>
                  <th className="text-right py-1.5 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings
                  .map((holding) => {
                    const token = getTokenData(holding.tokenAddress);
                    if (!token) return null;
                    const multiplier = token.athPrice && token.price ? token.athPrice / token.price : 1;
                    const athReturn = holding.allocation * multiplier;
                    return { holding, token, multiplier, athReturn };
                  })
                  .filter((item): item is NonNullable<typeof item> => item !== null)
                  .sort((a, b) => b.athReturn - a.athReturn)
                  .map(({ holding, token, multiplier, athReturn }) => {
                  const percentFromATH = token.athPrice && token.price
                    ? ((token.athPrice - token.price) / token.athPrice) * 100
                    : 0;

                  return (
                    <tr key={holding.tokenAddress} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-2">
                          {token.logoUrl ? (
                            <img src={token.logoUrl} alt={token.symbol} className="w-5 h-5 rounded-full" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[9px] text-gray-400">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium text-xs">{token.name}</div>
                            <div className="text-[10px] text-gray-400">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right hidden sm:table-cell">
                        <div className="text-white text-xs">{formatPrice(token.price)}</div>
                        <div className="text-[10px] text-red-400">-{percentFromATH.toFixed(1)}% from ATH</div>
                      </td>
                      <td className="py-1.5 px-2 text-right hidden sm:table-cell">
                        <div className="text-amber-400 text-xs">{formatPrice(token.athPrice)}</div>
                        <div className="text-[10px] text-gray-400">{multiplier.toFixed(1)}x potential</div>
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        {editingHolding === holding.tokenAddress ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-16 px-1.5 py-0.5 bg-gray-800 border border-cyan-500 rounded text-xs text-white text-right focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(holding.tokenAddress);
                                if (e.key === 'Escape') setEditingHolding(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveEdit(holding.tokenAddress)}
                              className="p-0.5 text-emerald-400 hover:bg-emerald-400/10 rounded"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="text-white text-xs">{formatCurrency(holding.allocation)}</div>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <div className="text-emerald-400 font-semibold text-xs">{formatCurrency(athReturn)}</div>
                        <div className="text-[10px] text-emerald-400/70">+{((multiplier - 1) * 100).toFixed(0)}%</div>
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/token/${holding.tokenAddress}`}
                            className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded text-[10px] font-medium hover:bg-cyan-500/30 transition-all inline-block"
                          >
                            Buy
                          </a>
                          <button
                            onClick={() => handleEditHolding(holding.tokenAddress, holding.allocation)}
                            className="p-1 text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-all"
                            title="Edit allocation"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveHolding(holding.tokenAddress)}
                            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                            title="Remove"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Token Modal - rendered via portal */}
        {showAddModal && createPortal(
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-2 sm:p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[85vh] sm:max-h-[70vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Add Token to Paper Portfolio</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchQuery('');
                    setAllocationInputs({});
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              {/* Token Table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar custom-scrollbar-cyan">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-900">
                    <tr className="text-[10px] text-gray-400 border-b border-gray-700">
                      <th className="text-left py-1.5 px-2">Token</th>
                      <th className="text-right py-1.5 px-2 hidden sm:table-cell">Price</th>
                      <th className="text-right py-1.5 px-2 hidden sm:table-cell">ATH</th>
                      <th className="text-right py-1.5 px-2">Potential</th>
                      <th className="text-right py-1.5 px-2 w-20 sm:w-28">Amount ($)</th>
                      <th className="text-right py-1.5 px-2 w-12 sm:w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokens.map((token) => {
                      const multiplier = token.athPrice && token.price ? token.athPrice / token.price : 1;
                      const inputValue = allocationInputs[token.address] || '';
                      const athReturn = inputValue ? parseFloat(inputValue) * multiplier : 0;

                      return (
                        <tr key={token.address} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                          <td className="py-1.5 px-1 sm:px-2 max-w-[100px] sm:max-w-none">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {token.logoUrl ? (
                                <img src={token.logoUrl} alt={token.symbol} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] sm:text-[9px] text-gray-400 flex-shrink-0">
                                  {token.symbol.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-white font-medium text-[10px] sm:text-xs truncate">{token.name}</div>
                                <div className="text-[9px] sm:text-[10px] text-gray-400">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-1.5 px-2 text-right text-xs text-white hidden sm:table-cell">
                            {formatPrice(token.price)}
                          </td>
                          <td className="py-1.5 px-2 text-right text-xs text-amber-400 hidden sm:table-cell">
                            {formatPrice(token.athPrice)}
                          </td>
                          <td className="py-1.5 px-2 text-right text-xs text-emerald-400">
                            {multiplier.toFixed(1)}x
                          </td>
                          <td className="py-1.5 px-1 sm:px-2 text-right">
                            <input
                              type="number"
                              value={inputValue}
                              onChange={(e) => setAllocationInputs(prev => ({
                                ...prev,
                                [token.address]: e.target.value
                              }))}
                              placeholder="0"
                              className="w-14 sm:w-20 px-1 sm:px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-[10px] sm:text-xs text-white text-right focus:outline-none focus:border-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min="0"
                              step="any"
                            />
                            {athReturn > 0 && (
                              <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-0.5">
                                → {formatCurrency(athReturn)}
                              </div>
                            )}
                          </td>
                          <td className="py-1.5 px-2 text-right">
                            <button
                              onClick={() => handleAddToken(token)}
                              disabled={!inputValue || parseFloat(inputValue) <= 0}
                              className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded text-[10px] font-medium hover:bg-cyan-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredTokens.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    {availableTokens.length === 0 ? 'All tokens already added' : 'No tokens found'}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchQuery('');
                    setAllocationInputs({});
                  }}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Share Modal */}
        {showShareModal && createPortal(
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Share Portfolio</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Share Card Preview */}
              <div className="p-4 overflow-auto max-h-[60vh]">
                <div
                  ref={shareCardRef}
                  className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-xl p-5 border border-gray-700"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Believe in Something</h3>
                      <p className="text-xs text-gray-400">topmemes.io</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">If tokens hit ATH</div>
                      <div className="text-lg font-bold text-emerald-400">{formatCurrency(totalATHReturn)}</div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400">Tokens</div>
                      <div className="text-sm font-bold text-white">{holdings.length}</div>
                    </div>
                    <div className="text-center border-x border-gray-700">
                      <div className="text-[10px] text-gray-400">Allocation</div>
                      <div className="text-sm font-bold text-white">{formatCurrency(totalAllocation)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400">Potential Gain</div>
                      <div className="text-sm font-bold text-emerald-400">
                        +{totalAllocation > 0 ? ((totalATHReturn / totalAllocation - 1) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  </div>

                  {/* Token List */}
                  <div className="space-y-1.5">
                    {sortedHoldingsData.map(({ holding, token, multiplier, athReturn }) => (
                      <div key={holding.tokenAddress} className="flex items-center justify-between py-1.5 px-2 bg-gray-800/30 rounded">
                        <div className="flex items-center gap-2">
                          {token.logoUrl ? (
                            <img src={token.logoUrl} alt={token.symbol} className="w-5 h-5 rounded-full" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs text-white font-medium">{token.symbol}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-400">{formatCurrency(holding.allocation)}</span>
                          <span className="text-emerald-400">→ {formatCurrency(athReturn)}</span>
                          <span className="text-amber-400 text-[10px]">{multiplier.toFixed(1)}x</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Track your memecoins at topmemes.io</span>
                    <span className="text-[10px] text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 p-4 border-t border-gray-700">
                <button
                  onClick={handleCopyImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </MainLayout>
  );
}
