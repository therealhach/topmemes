const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Rate limiting helper - process items in batches with delays
async function processBatched<T, R>(
  items: T[],
  batchSize: number,
  delayMs: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    // Add delay between batches (except for the last batch)
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  uri?: string;
  decimals?: number;
}

export interface TokenMarketData {
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity?: number;
}

export interface TokenPrice {
  id: string;
  mintSymbol: string;
  price: number;
  priceChange24h?: number;
}

// Popular meme coin addresses on Solana
export const MEME_TOKENS = [
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK token
    pairAddress: '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9', // BONK pair
    name: 'Bonk',
    symbol: 'BONK',
    coingeckoId: 'bonk',
  },
  {
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
    name: 'dogwifhat',
    symbol: 'WIF',
    coingeckoId: 'dogwifhat',
  },
  {
    address: 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4', // MYRO
    name: 'Myro',
    symbol: 'MYRO',
    coingeckoId: 'myro',
  },
];

export async function getTokenMetadata(mintAddress: string): Promise<TokenMetadata | null> {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'get-token-metadata',
        method: 'getAsset',
        params: {
          id: mintAddress,
        },
      }),
    });

    const data = await response.json();

    if (data.result) {
      return {
        mint: mintAddress,
        name: data.result.content?.metadata?.name || 'Unknown',
        symbol: data.result.content?.metadata?.symbol || 'UNKNOWN',
        uri: data.result.content?.json_uri,
        decimals: data.result.token_info?.decimals,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

export type Chain = 'solana' | 'ethereum';

// Fetch market data from DexScreener by pair address
export async function getTokenMarketDataByPair(pairAddress: string, chain: Chain = 'solana'): Promise<TokenMarketData | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`
    );

    const data = await response.json();

    if (data?.pair) {
      const pair = data.pair;

      return {
        price: parseFloat(pair.priceUsd || '0'),
        priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        volume24h: parseFloat(pair.volume?.h24 || '0'),
        marketCap: parseFloat(pair.fdv || '0'), // Fully diluted valuation
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching market data by pair:', error);
    return null;
  }
}

// Fetch market data from DexScreener by token address
export async function getTokenMarketData(tokenAddress: string): Promise<TokenMarketData | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );

    const data = await response.json();

    if (data?.pairs && data.pairs.length > 0) {
      // Get the most liquid pair
      const pair = data.pairs.reduce((max: any, pair: any) =>
        (pair.liquidity?.usd || 0) > (max.liquidity?.usd || 0) ? pair : max
      );

      return {
        price: parseFloat(pair.priceUsd || '0'),
        priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        volume24h: parseFloat(pair.volume?.h24 || '0'),
        marketCap: parseFloat(pair.fdv || '0'), // Fully diluted valuation
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}

export async function getTokenPrice(tokenAddress: string): Promise<number | null> {
  try {
    const marketData = await getTokenMarketData(tokenAddress);
    return marketData?.price || null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}


export type TokenCategory = 'dogs' | 'cats' | 'frogs' | 'ai' | 'others';

export interface MemeTokenData {
  address: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  currentMcap: number;
  athPrice: number;
  oneHourChange: number;
  twentyFourHourChange: number;
  twentyFourHourVolume: number;
  price: number;
  liquidity: number;
  category: TokenCategory;
  chain: Chain;
}

// Fetch multiple token data with real market data from Supabase
export async function getMemeTokensData(): Promise<MemeTokenData[]> {
  try {
    // Import Supabase client dynamically to avoid circular dependencies
    const { getSupabase } = await import('./supabase');
    const supabase = getSupabase();

    if (!supabase) {
      console.error('Supabase not configured');
      return [];
    }

    // Get tokens from Supabase
    const { data: dbTokens, error: dbError } = await supabase
      .from('tokens')
      .select('*');

    if (dbError) {
      console.error('Error fetching tokens from Supabase:', dbError);
      return [];
    }

    // Fetch live market data for each token
    // We skip getTokenMetadata() since we already have name/symbol in the database
    // This reduces API calls significantly
    const tokensData = await Promise.all(
      (dbTokens || []).map(async (dbToken: any) => {
        // Get chain from database, default to 'solana' for backward compatibility
        const chain: Chain = dbToken.chain || 'solana';

        // Use pair address if available, otherwise use token address
        const marketData = dbToken.pair_address
          ? await getTokenMarketDataByPair(dbToken.pair_address, chain)
          : await getTokenMarketData(dbToken.token_address);

        const currentMcap = marketData?.marketCap || 0;

        return {
          address: dbToken.token_address,
          name: dbToken.token_name,
          symbol: dbToken.token_symbol,
          logoUrl: dbToken.logo_url || undefined,
          currentMcap: currentMcap,
          athPrice: Number(dbToken.ath_price) || 0,
          oneHourChange: marketData?.priceChange1h || 0,
          twentyFourHourChange: marketData?.priceChange24h || 0,
          twentyFourHourVolume: marketData?.volume24h || 0,
          price: marketData?.price || 0,
          liquidity: marketData?.liquidity || 0,
          category: (dbToken.category as TokenCategory) || 'others',
          chain: chain,
        };
      })
    );

    return tokensData;
  } catch (error) {
    console.error('Error fetching meme tokens data:', error);
    return [];
  }
}
