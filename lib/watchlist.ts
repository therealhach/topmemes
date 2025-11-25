'use client';

const WATCHLIST_STORAGE_KEY = 'topmemes_watchlist';

export interface WatchlistItem {
  address: string;
  addedAt: number;
}

/**
 * Load watchlist from localStorage
 */
export function loadWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading watchlist:', error);
  }
  return [];
}

/**
 * Save watchlist to localStorage
 */
export function saveWatchlist(watchlist: WatchlistItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error saving watchlist:', error);
  }
}

/**
 * Add token to watchlist
 */
export function addToWatchlist(address: string): WatchlistItem[] {
  const watchlist = loadWatchlist();

  // Check if already in watchlist
  if (watchlist.some(item => item.address === address)) {
    return watchlist;
  }

  const newWatchlist = [...watchlist, { address, addedAt: Date.now() }];
  saveWatchlist(newWatchlist);
  return newWatchlist;
}

/**
 * Remove token from watchlist
 */
export function removeFromWatchlist(address: string): WatchlistItem[] {
  const watchlist = loadWatchlist();
  const newWatchlist = watchlist.filter(item => item.address !== address);
  saveWatchlist(newWatchlist);
  return newWatchlist;
}

/**
 * Check if token is in watchlist
 */
export function isInWatchlist(address: string): boolean {
  const watchlist = loadWatchlist();
  return watchlist.some(item => item.address === address);
}

/**
 * Toggle token in watchlist
 */
export function toggleWatchlist(address: string): { watchlist: WatchlistItem[]; isWatched: boolean } {
  const isWatched = isInWatchlist(address);

  if (isWatched) {
    return { watchlist: removeFromWatchlist(address), isWatched: false };
  } else {
    return { watchlist: addToWatchlist(address), isWatched: true };
  }
}

/**
 * Get watchlist addresses as a Set for quick lookup
 */
export function getWatchlistSet(): Set<string> {
  const watchlist = loadWatchlist();
  return new Set(watchlist.map(item => item.address));
}
