import { beforeEach, describe, expect, it } from 'vitest';
import { useMarketStore } from '@/shared/store/marketStore';
import { useWatchlistStore } from '@/features/watchlist/store';
import { filterSymbols } from '@/features/watchlist/utils/filtering';
import { sortSymbols } from '@/features/watchlist/utils/sorting';
import type { SymbolState } from '@/shared/store/types';

describe('Watchlist filtering and sorting', () => {
  const mockSymbols: SymbolState[] = [
    {
      symbol: 'AAPL', currentPrice: 150, absoluteChange: 5, percentChange: 0.034,
      totalVolume: 1000000, tradeCount: 500, high: 155, low: 145, vwap: 150,
      lastTradeTimestamp: Date.now(), history: [],
    },
    {
      symbol: 'GOOG', currentPrice: 2800, absoluteChange: -20, percentChange: -0.007,
      totalVolume: 500000, tradeCount: 200, high: 2820, low: 2780, vwap: 2800,
      lastTradeTimestamp: Date.now(), history: [],
    },
    {
      symbol: 'MSFT', currentPrice: 300, absoluteChange: 10, percentChange: 0.034,
      totalVolume: 800000, tradeCount: 300, high: 305, low: 295, vwap: 300,
      lastTradeTimestamp: Date.now(), history: [],
    },
    {
      symbol: 'AMZN', currentPrice: 180, absoluteChange: -5, percentChange: -0.027,
      totalVolume: 600000, tradeCount: 250, high: 185, low: 175, vwap: 180,
      lastTradeTimestamp: Date.now(), history: [],
    },
  ];

  beforeEach(() => {
    useMarketStore.setState({
      symbols: new Map(mockSymbols.map((s) => [s.symbol, s])),
      selectedSymbol: null,
      connectionStatus: 'connecting',
      connectionInfo: null,
    });
    useWatchlistStore.setState({
      search: '',
      favorites: new Set<string>(),
      favoritesOnly: false,
      sortBy: 'symbol',
      direction: 'asc',
    });
  });

  describe('filterSymbols', () => {
    it('returns all symbols when no search or favorites filter', () => {
      const result = filterSymbols(mockSymbols, '', false, new Set());
      expect(result.length).toBe(4);
    });

    it('filters by search keyword', () => {
      const result = filterSymbols(mockSymbols, 'AAPL', false, new Set());
      expect(result.length).toBe(1);
      expect(result[0].symbol).toBe('AAPL');
    });

    it('filters case-insensitively', () => {
      const result = filterSymbols(mockSymbols, 'aapl', false, new Set());
      expect(result.length).toBe(1);
      expect(result[0].symbol).toBe('AAPL');
    });

    it('filters by partial match', () => {
      const result = filterSymbols(mockSymbols, 'AA', false, new Set());
      expect(result.length).toBe(1);
      expect(result[0].symbol).toBe('AAPL');
    });

    it('filters by favorites only', () => {
      const favorites = new Set(['AAPL', 'GOOG']);
      const result = filterSymbols(mockSymbols, '', true, favorites);
      expect(result.length).toBe(2);
      expect(result.map((s) => s.symbol)).toContain('AAPL');
      expect(result.map((s) => s.symbol)).toContain('GOOG');
    });

    it('combines search and favorites filter', () => {
      const favorites = new Set(['AAPL', 'GOOG']);
      const result = filterSymbols(mockSymbols, 'GOO', true, favorites);
      expect(result.length).toBe(1);
      expect(result[0].symbol).toBe('GOOG');
    });

    it('returns empty when search matches nothing', () => {
      const result = filterSymbols(mockSymbols, 'ZZZZZ', false, new Set());
      expect(result.length).toBe(0);
    });
  });

  describe('sortSymbols', () => {
    it('sorts by symbol ascending', () => {
      const result = sortSymbols(mockSymbols, 'symbol', 'asc');
      expect(result[0].symbol).toBe('AAPL');
      expect(result[1].symbol).toBe('AMZN');
      expect(result[2].symbol).toBe('GOOG');
      expect(result[3].symbol).toBe('MSFT');
    });

    it('sorts by symbol descending', () => {
      const result = sortSymbols(mockSymbols, 'symbol', 'desc');
      expect(result[0].symbol).toBe('MSFT');
      expect(result[1].symbol).toBe('GOOG');
      expect(result[2].symbol).toBe('AMZN');
      expect(result[3].symbol).toBe('AAPL');
    });

    it('sorts by price ascending', () => {
      const result = sortSymbols(mockSymbols, 'price', 'asc');
      expect(result[0].symbol).toBe('AAPL');
      expect(result[1].symbol).toBe('AMZN');
      expect(result[2].symbol).toBe('MSFT');
      expect(result[3].symbol).toBe('GOOG');
    });

    it('sorts by price descending', () => {
      const result = sortSymbols(mockSymbols, 'price', 'desc');
      expect(result[0].symbol).toBe('GOOG');
      expect(result[1].symbol).toBe('MSFT');
      expect(result[2].symbol).toBe('AMZN');
      expect(result[3].symbol).toBe('AAPL');
    });

    it('sorts by change ascending', () => {
      // percentChange: AMZN=-0.027, GOOG=-0.007, AAPL=0.034, MSFT=0.034
      const result = sortSymbols(mockSymbols, 'change', 'asc');
      expect(result[0].symbol).toBe('AMZN');
      expect(result[1].symbol).toBe('GOOG');
      expect(result[2].symbol).toBe('AAPL');
      expect(result[3].symbol).toBe('MSFT');
    });
  });

  describe('Watchlist store', () => {
    it('toggles favorites', () => {
      useWatchlistStore.getState().toggleFavorites('AAPL');
      expect(useWatchlistStore.getState().favorites.has('AAPL')).toBe(true);
      useWatchlistStore.getState().toggleFavorites('AAPL');
      expect(useWatchlistStore.getState().favorites.has('AAPL')).toBe(false);
    });

    it('toggles favoritesOnly', () => {
      expect(useWatchlistStore.getState().favoritesOnly).toBe(false);
      useWatchlistStore.getState().toggleFavoritesOnly();
      expect(useWatchlistStore.getState().favoritesOnly).toBe(true);
      useWatchlistStore.getState().toggleFavoritesOnly();
      expect(useWatchlistStore.getState().favoritesOnly).toBe(false);
    });

    it('sets search', () => {
      useWatchlistStore.getState().setSearch('AAPL');
      expect(useWatchlistStore.getState().search).toBe('AAPL');
    });

    it('sets sort', () => {
      useWatchlistStore.getState().setSort('price', 'desc');
      expect(useWatchlistStore.getState().sortBy).toBe('price');
      expect(useWatchlistStore.getState().direction).toBe('desc');
    });
  });
});
