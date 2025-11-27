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

// Fetch market data from DexScreener by pair address (via proxy to avoid CORS)
export async function getTokenMarketDataByPair(pairAddress: string, chain: Chain = 'solana'): Promise<TokenMarketData | null> {
  try {
    const response = await fetch(
      `/api/dexscreener?pair=${pairAddress}&chain=${chain}`
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

// Fetch market data from DexScreener by token address (via proxy to avoid CORS)
export async function getTokenMarketData(tokenAddress: string): Promise<TokenMarketData | null> {
  try {
    const response = await fetch(
      `/api/dexscreener?token=${tokenAddress}`
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

// Fetch market data from CoinGecko by contract address (via proxy)
export async function getCoinGeckoMarketData(
  tokenAddress: string,
  platform: 'solana' | 'ethereum' = 'solana'
): Promise<TokenMarketData | null> {
  try {
    const response = await fetch(
      `/api/coingecko?address=${tokenAddress}&platform=${platform}`
    );

    if (!response.ok) {
      // Token not found or other error - will fallback to DexScreener
      return null;
    }

    const data = await response.json();

    if (data?.market_data) {
      return {
        price: data.market_data.current_price?.usd || 0,
        priceChange1h: data.market_data.price_change_percentage_1h_in_currency?.usd || 0,
        priceChange24h: data.market_data.price_change_percentage_24h || 0,
        volume24h: data.market_data.total_volume?.usd || 0,
        marketCap: data.market_data.market_cap?.usd || 0,
        liquidity: 0, // CoinGecko doesn't provide liquidity
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching CoinGecko market data:', error);
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
  twitterUrl?: string;
  telegramUrl?: string;
  websiteUrl?: string;
}

// Batch fetch market data from DexScreener (up to 30 pairs per request)
async function batchFetchPairs(pairAddresses: string[], chain: Chain): Promise<Map<string, TokenMarketData>> {
  const result = new Map<string, TokenMarketData>();
  if (pairAddresses.length === 0) return result;

  // Split into batches of 30 (DexScreener limit)
  const BATCH_SIZE = 30;
  const batches: string[][] = [];
  for (let i = 0; i < pairAddresses.length; i += BATCH_SIZE) {
    batches.push(pairAddresses.slice(i, i + BATCH_SIZE));
  }

  // Fetch all batches in parallel
  const batchResults = await Promise.all(
    batches.map(async (batch) => {
      try {
        const response = await fetch(
          `/api/dexscreener?pairs=${batch.join(',')}&chain=${chain}`
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data?.pairs || (data?.pair ? [data.pair] : []);
      } catch (error) {
        console.error('Error batch fetching pairs:', error);
        return [];
      }
    })
  );

  // Process all results
  for (const pairs of batchResults) {
    for (const pair of pairs) {
      if (pair?.pairAddress) {
        result.set(pair.pairAddress.toLowerCase(), {
          price: parseFloat(pair.priceUsd || '0'),
          priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
          priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
          volume24h: parseFloat(pair.volume?.h24 || '0'),
          marketCap: parseFloat(pair.fdv || '0'),
          liquidity: parseFloat(pair.liquidity?.usd || '0'),
        });
      }
    }
  }

  return result;
}

// Fetch multiple token data with real market data from Supabase
// Uses DexScreener batch API - 1-2 requests total instead of 30+
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

    if (!dbTokens || dbTokens.length === 0) return [];

    // Group tokens by chain (only those with pair_address for batch fetch)
    const solanaTokens = dbTokens.filter((t: any) => (t.chain || 'solana') === 'solana' && t.pair_address);
    const ethereumTokens = dbTokens.filter((t: any) => t.chain === 'ethereum' && t.pair_address);
    const tokensWithoutPair = dbTokens.filter((t: any) => !t.pair_address);

    // Batch fetch all pairs in just 2 requests (one per chain)
    const [solanaData, ethereumData] = await Promise.all([
      batchFetchPairs(solanaTokens.map((t: any) => t.pair_address), 'solana'),
      batchFetchPairs(ethereumTokens.map((t: any) => t.pair_address), 'ethereum'),
    ]);

    // Merge data
    const allMarketData = new Map([...solanaData, ...ethereumData]);

    // Fetch remaining tokens without pair_address individually (should be few)
    if (tokensWithoutPair.length > 0) {
      const results = await Promise.all(
        tokensWithoutPair.map(async (t: any) => {
          const data = await getTokenMarketData(t.token_address);
          return { address: t.token_address, data };
        })
      );
      for (const r of results) {
        if (r.data) allMarketData.set(r.address.toLowerCase(), r.data);
      }
    }

    // Build final token data
    const tokensData = dbTokens.map((dbToken: any) => {
      const chain: Chain = dbToken.chain || 'solana';
      const key = (dbToken.pair_address || dbToken.token_address).toLowerCase();
      const marketData = allMarketData.get(key) || null;

      return {
        address: dbToken.token_address,
        name: dbToken.token_name,
        symbol: dbToken.token_symbol,
        logoUrl: dbToken.logo_url || undefined,
        currentMcap: marketData?.marketCap || 0,
        athPrice: Number(dbToken.ath_price) || 0,
        oneHourChange: marketData?.priceChange1h || 0,
        twentyFourHourChange: marketData?.priceChange24h || 0,
        twentyFourHourVolume: marketData?.volume24h || 0,
        price: marketData?.price || 0,
        liquidity: marketData?.liquidity || 0,
        category: (dbToken.category as TokenCategory) || 'others',
        chain: chain,
        twitterUrl: dbToken.twitter_url || undefined,
        telegramUrl: dbToken.telegram_url || undefined,
        websiteUrl: dbToken.website_url || undefined,
      };
    });

    return tokensData;
  } catch (error) {
    console.error('Error fetching meme tokens data:', error);
    return [];
  }
}
