// GeckoTerminal API for OHLCV data
// Documentation: https://www.geckoterminal.com/dex-api

export interface OHLCVData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

const GECKOTERMINAL_BASE_URL = 'https://api.geckoterminal.com/api/v2';

// Map chain names to GeckoTerminal network IDs
const chainToNetwork: Record<string, string> = {
  solana: 'solana',
  ethereum: 'eth',
  eth: 'eth',
};

// Cache for pool addresses
const poolAddressCache: Map<string, { address: string; timestamp: number }> = new Map();
const POOL_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Find the most liquid pool for a token
async function findPoolAddress(
  tokenAddress: string,
  chain: string
): Promise<string | null> {
  const cacheKey = `${chain}:${tokenAddress}`;
  const cached = poolAddressCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < POOL_CACHE_DURATION) {
    return cached.address;
  }

  const network = chainToNetwork[chain.toLowerCase()] || chain.toLowerCase();

  try {
    const response = await fetch(
      `${GECKOTERMINAL_BASE_URL}/networks/${network}/tokens/${tokenAddress}/pools?page=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch pool address:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      // Get the first pool (most liquid)
      const poolId = data.data[0].id;
      // Extract pool address from ID (format: network_poolAddress)
      const poolAddress = poolId.split('_')[1];

      poolAddressCache.set(cacheKey, {
        address: poolAddress,
        timestamp: Date.now(),
      });

      return poolAddress;
    }

    return null;
  } catch (error) {
    console.error('Error finding pool address:', error);
    return null;
  }
}

// Fetch OHLCV data from GeckoTerminal
export async function fetchOHLCVData(
  tokenAddress: string,
  chain: string,
  timeframe: TimeFrame = '1h',
  limit: number = 100
): Promise<CandlestickData[]> {
  const network = chainToNetwork[chain.toLowerCase()] || chain.toLowerCase();

  // First, find the pool address for this token
  const poolAddress = await findPoolAddress(tokenAddress, chain);

  if (!poolAddress) {
    console.error('Could not find pool for token:', tokenAddress);
    return [];
  }

  try {
    // GeckoTerminal OHLCV endpoint
    const response = await fetch(
      `${GECKOTERMINAL_BASE_URL}/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?aggregate=1&limit=${limit}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch OHLCV data:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.data?.attributes?.ohlcv_list) {
      return [];
    }

    // Transform GeckoTerminal data to chart format
    // GeckoTerminal returns: [timestamp, open, high, low, close, volume]
    const ohlcvList: number[][] = data.data.attributes.ohlcv_list;

    const candlesticks: CandlestickData[] = ohlcvList
      .map((item: number[]) => ({
        time: Math.floor(item[0]), // Unix timestamp in seconds
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      }))
      .sort((a: CandlestickData, b: CandlestickData) => a.time - b.time); // Sort by time ascending

    return candlesticks;
  } catch (error) {
    console.error('Error fetching OHLCV data:', error);
    return [];
  }
}

// Fetch simple price history (line chart data)
export async function fetchPriceHistory(
  tokenAddress: string,
  chain: string,
  timeframe: TimeFrame = '1h',
  limit: number = 100
): Promise<{ time: number; value: number }[]> {
  const ohlcvData = await fetchOHLCVData(tokenAddress, chain, timeframe, limit);

  return ohlcvData.map((candle) => ({
    time: candle.time,
    value: candle.close,
  }));
}
