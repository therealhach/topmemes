// CoinGecko Pro API for OHLCV data
// Documentation: https://docs.coingecko.com/reference/introduction

const COINGECKO_API_URL = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://pro-api.coingecko.com/api/v3/';
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '';

export interface OHLCData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeFrame = '1' | '7' | '14' | '30' | '90' | '180' | '365' | 'max';

// Map chain to CoinGecko asset platform ID
const chainToPlatform: Record<string, string> = {
  solana: 'solana',
  ethereum: 'ethereum',
  eth: 'ethereum',
};

// Cache for coin IDs
const coinIdCache: Map<string, { id: string; timestamp: number }> = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper to make authenticated requests
async function fetchCoinGecko(endpoint: string): Promise<any> {
  const url = `${COINGECKO_API_URL}${endpoint}`;
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (COINGECKO_API_KEY) {
    headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error('CoinGecko API error:', response.status, await response.text());
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  return response.json();
}

// Find CoinGecko coin ID from contract address
export async function findCoinId(
  tokenAddress: string,
  chain: string
): Promise<string | null> {
  const cacheKey = `${chain}:${tokenAddress}`;
  const cached = coinIdCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.id;
  }

  const platform = chainToPlatform[chain.toLowerCase()] || chain.toLowerCase();

  try {
    // Use the coins/contract endpoint to get coin info from contract address
    const data = await fetchCoinGecko(`coins/${platform}/contract/${tokenAddress}`);

    if (data && data.id) {
      coinIdCache.set(cacheKey, {
        id: data.id,
        timestamp: Date.now(),
      });
      return data.id;
    }

    return null;
  } catch (error) {
    console.error('Error finding coin ID:', error);
    return null;
  }
}

// Fetch OHLC data from CoinGecko
// Note: CoinGecko OHLC endpoint returns data at different granularities based on days:
// 1-2 days: 30-minute intervals
// 3-30 days: 4-hour intervals
// 31+ days: daily intervals
export async function fetchOHLCData(
  tokenAddress: string,
  chain: string,
  days: TimeFrame = '7'
): Promise<CandlestickData[]> {
  // First, find the coin ID
  const coinId = await findCoinId(tokenAddress, chain);

  if (!coinId) {
    console.error('Could not find CoinGecko ID for token:', tokenAddress);
    return [];
  }

  try {
    // CoinGecko OHLC endpoint
    const data = await fetchCoinGecko(`coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transform CoinGecko data to chart format
    // CoinGecko returns: [timestamp, open, high, low, close]
    const candlesticks: CandlestickData[] = data
      .map((item: number[]) => ({
        time: Math.floor(item[0] / 1000), // Convert ms to seconds
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      }))
      .sort((a: CandlestickData, b: CandlestickData) => a.time - b.time);

    return candlesticks;
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    return [];
  }
}

// Fetch market chart data (for line charts)
export async function fetchMarketChart(
  tokenAddress: string,
  chain: string,
  days: TimeFrame = '7'
): Promise<{ time: number; value: number }[]> {
  const coinId = await findCoinId(tokenAddress, chain);

  if (!coinId) {
    console.error('Could not find CoinGecko ID for token:', tokenAddress);
    return [];
  }

  try {
    const data = await fetchCoinGecko(`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);

    if (!data || !data.prices) {
      return [];
    }

    // Transform to chart format
    // CoinGecko returns: { prices: [[timestamp, price], ...] }
    return data.prices.map((item: number[]) => ({
      time: Math.floor(item[0] / 1000), // Convert ms to seconds
      value: item[1],
    }));
  } catch (error) {
    console.error('Error fetching market chart:', error);
    return [];
  }
}

// Get coin details including price, market cap, etc.
export async function getCoinDetails(
  tokenAddress: string,
  chain: string
): Promise<{
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  ath: number;
  athDate: string;
} | null> {
  const coinId = await findCoinId(tokenAddress, chain);

  if (!coinId) {
    return null;
  }

  try {
    const data = await fetchCoinGecko(`coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`);

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol?.toUpperCase(),
      price: data.market_data?.current_price?.usd || 0,
      priceChange24h: data.market_data?.price_change_percentage_24h || 0,
      marketCap: data.market_data?.market_cap?.usd || 0,
      volume24h: data.market_data?.total_volume?.usd || 0,
      ath: data.market_data?.ath?.usd || 0,
      athDate: data.market_data?.ath_date?.usd || '',
    };
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
}
