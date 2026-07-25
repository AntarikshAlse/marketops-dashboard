import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ConnectionInfo, HistoryPoint, SymbolState } from './types';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

interface PendingHistory {
  symbol: string;
  points: HistoryPoint[];
}

interface MarketStore {
  symbols: Map<string, SymbolState>;

  selectedSymbol: string | null;

  connectionStatus: ConnectionStatus;

  connectionInfo: ConnectionInfo | null;

  initialize(symbols: SymbolState[]): void;

  updateSymbol(symbol: string, updates: Partial<SymbolState>): void;

  appendHistory(symbol: string, point: HistoryPoint): void;

  batchAppendHistory(updates: PendingHistory[]): void;

  selectSymbol(symbol: string): void;

  setConnectionStatus(status: ConnectionStatus): void;

  getSymbol(symbol: string): SymbolState | undefined;

  setConnectionInfo(info: ConnectionInfo): void;

  batchUpdateSymbols(updates: SymbolState[]): void;

  clear(): void;
}

const MAX_HISTORY = 500;

export const useMarketStore = create<MarketStore>()(devtools((set, get) => ({
  symbols: new Map(),

  selectedSymbol: null,

  connectionStatus: 'connecting',
  connectionInfo: null,

  initialize(symbols) {
    const map = new Map<string, SymbolState>();

    for (const symbol of symbols) {
      map.set(symbol.symbol, symbol);
    }

    set({
      symbols: map,
    });
  },

  updateSymbol(symbol, updates) {
    set((state) => {
      const next = new Map(state.symbols);

      const current = next.get(symbol);

      if (!current) {
        return state;
      }

      next.set(symbol, {
        ...current,
        ...updates,
      });

      return {
        symbols: next,
      };
    });
  },

  appendHistory(symbol, point) {
    set((state) => {
      const next = new Map(state.symbols);
      const current = next.get(symbol);

      if (!current) return state;

      // Efficient: only slice when at capacity
      let history: HistoryPoint[];
      if (current.history.length >= MAX_HISTORY) {
        // Shift left by creating a new array without the first element
        history = current.history.slice(1);
        history.push(point);
      } else {
        history = [...current.history, point];
      }

      next.set(symbol, {
        ...current,
        history,
      });

      return {
        symbols: next,
      };
    });
  },

  batchAppendHistory(updates) {
    set((state) => {
      const next = new Map(state.symbols);

      for (const { symbol, points } of updates) {
        const current = next.get(symbol);
        if (!current) continue;

        // Build the new history array in one pass - O(n) instead of O(n²)
        const history = [...current.history, ...points];
        // Trim to MAX_HISTORY if needed (remove oldest points from the start)
        if (history.length > MAX_HISTORY) {
          next.set(symbol, {
            ...current,
            history: history.slice(history.length - MAX_HISTORY),
          });
        } else {
          next.set(symbol, {
            ...current,
            history,
          });
        }
      }

      return {
        symbols: next,
      };
    });
  },

  setConnectionInfo(info) {
    set({
      connectionInfo: info,
    });
  },

  selectSymbol(symbol) {
    set({
      selectedSymbol: symbol,
    });
  },

  setConnectionStatus(connectionStatus) {
    set({
      connectionStatus,
    });
  },

  getSymbol(symbol) {
    return get().symbols.get(symbol);
  },

  batchUpdateSymbols: (updates) =>
    set((state) => {
      const symbols = new Map(state.symbols);

      for (const update of updates) {
        const current = symbols.get(update.symbol);

        if (!current) continue;

        symbols.set(update.symbol, {
          ...current,
          currentPrice: update.currentPrice ?? update.price,
          absoluteChange: update.absoluteChange,
          percentChange: update.percentChange,
          totalVolume: update.totalVolume,
          lastTradeTimestamp: update.lastTradeTimestamp,
        });
      }

      return { symbols };
    }),
  clear() {
    set({
      symbols: new Map(),
      selectedSymbol: null,
    });
  },
})));
