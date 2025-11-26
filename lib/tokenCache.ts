export type TokenCategory = 'dogs' | 'cats' | 'frogs' | 'ai' | 'others';
export type Chain = 'solana' | 'ethereum';

export interface CachedToken {
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  price?: number;
  currentMcap: number;
  athPrice: number;
  oneHourChange: number;
  twentyFourHourChange: number;
  twentyFourHourVolume: number;
  category: TokenCategory;
  liquidity?: number;
  chain: Chain;
}

interface TokenCache {
  tokens: CachedToken[];
  timestamp: number;
  version: number;
}

const CACHE_KEY = 'topmemes_token_cache';
const CACHE_VERSION = 1;
const CACHE_MAX_AGE = 15 * 60 * 1000; // 15 minutes in milliseconds

export const saveTokenCache = (tokens: CachedToken[]): void => {
  try {
    const cache: TokenCache = {
      tokens,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save token cache:', error);
  }
};

export const loadTokenCache = (): CachedToken[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cache: TokenCache = JSON.parse(cached);

    // Version check
    if (cache.version !== CACHE_VERSION) {
      clearTokenCache();
      return null;
    }

    // Expiration check
    if (isCacheExpired(cache.timestamp)) {
      clearTokenCache();
      return null;
    }

    return cache.tokens;
  } catch (error) {
    console.error('Failed to load token cache:', error);
    clearTokenCache();
    return null;
  }
};

export const getCacheTimestamp = (): number | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cache: TokenCache = JSON.parse(cached);
    return cache.timestamp;
  } catch (error) {
    return null;
  }
};

export const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_MAX_AGE;
};

export const clearTokenCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear token cache:', error);
  }
};

export const getTimeSinceUpdate = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
};
