'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAllTokenBalances, TOKENS } from '@/lib/jupiter';
import { getMemeTokensData } from '@/lib/helius';
import { PublicKey } from '@solana/web3.js';

interface TokenHolding {
  name: string;
  symbol: string;
  address: string;
  balance: number;
  usdValue: number;
  logoUrl?: string;
}

interface DatabaseToken {
  address: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  price?: number;
}

const formatUSD = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export default function PortfolioSidebar() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [databaseTokens, setDatabaseTokens] = useState<DatabaseToken[]>([]);

  useEffect(() => {
    fetchSolPrice();
    fetchDatabaseTokens();
  }, []);

  useEffect(() => {
    if (connected && publicKey && solPrice > 0) {
      fetchPortfolio();
    } else if (!connected) {
      setHoldings([]);
      setTotalBalance(0);
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

      // Get ALL token balances in one batch call (much more efficient!)
      console.log('Fetching all token balances in one call...');
      const balanceMap = await getAllTokenBalances(publicKey.toBase58());
      console.log('Received balances for', balanceMap.size, 'tokens');

      // Get SOL balance (always show)
      const solBalance = balanceMap.get(TOKENS.SOL) || 0;
      const solValue = solBalance * solPrice;

      portfolioHoldings.push({
        name: 'Solana',
        symbol: 'SOL',
        address: TOKENS.SOL,
        balance: solBalance,
        usdValue: solValue,
        logoUrl: 'https://wsrv.nl/?w=48&h=48&url=https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
      });

      // Get USDC balance (always show)
      const usdcBalance = balanceMap.get(TOKENS.USDC) || 0;

      portfolioHoldings.push({
        name: 'USD Coin',
        symbol: 'USDC',
        address: TOKENS.USDC,
        balance: usdcBalance,
        usdValue: usdcBalance,
        logoUrl: 'https://wsrv.nl/?w=48&h=48&url=https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      });

      // Check balances for all tokens in the database
      console.log('Checking balances for', databaseTokens.length, 'database tokens');
      for (const dbToken of databaseTokens) {
        try {
          const balance = balanceMap.get(dbToken.address) || 0;
          console.log(`${dbToken.symbol}: balance = ${balance}`);

          if (balance > 0) {
            const usdValue = dbToken.price ? balance * dbToken.price : 0;
            portfolioHoldings.push({
              name: dbToken.name,
              symbol: dbToken.symbol,
              address: dbToken.address,
              balance,
              usdValue,
              logoUrl: dbToken.logoUrl,
            });
          }
        } catch (error) {
          console.error(`Error fetching balance for ${dbToken.symbol}:`, error);
        }
      }

      // Sort by USD value (highest first)
      portfolioHoldings.sort((a, b) => b.usdValue - a.usdValue);

      setHoldings(portfolioHoldings);
      setTotalBalance(portfolioHoldings.reduce((sum, h) => sum + h.usdValue, 0));
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the panel if wallet is not connected
  if (!connected) {
    return null;
  }

  return (
    <div className="sticky top-4 h-fit">
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-lg shadow-2xl p-4">
        <h3 className="text-lg font-bold text-white mb-3">Portfolio</h3>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Total Balance */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-cyan-500/20">
              <p className="text-xs text-gray-400 mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">{formatUSD(totalBalance)}</p>
            </div>

            {/* Holdings List */}
            <div className="space-y-2">
              {holdings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-2">No tokens found</p>
                  <p className="text-xs text-gray-500">Start trading to build your portfolio</p>
                </div>
              ) : (
                holdings.map((holding, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-black/20 hover:bg-black/40 rounded-lg border border-cyan-500/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {holding.logoUrl ? (
                          <img
                            src={holding.logoUrl}
                            alt={holding.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {holding.symbol.substring(0, 2)}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-white">{holding.symbol}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">
                        {formatUSD(holding.usdValue)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 pl-8">
                      {holding.balance.toFixed(4)} {holding.symbol}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
