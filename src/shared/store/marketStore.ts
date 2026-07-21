import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ConnectionInfo, HistoryPoint, SymbolState } from './types';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

interface MarketStore {
  symbols: Map<string, SymbolState>;

  selectedSymbol: string | null;

  connectionStatus: ConnectionStatus;

  connectionInfo: ConnectionInfo | null;

  initialize(symbols: SymbolState[]): void;

  updateSymbol(symbol: string, updates: Partial<SymbolState>): void;

  appendHistory(symbol: string, point: HistoryPoint): void;

  selectSymbol(symbol: string): void;

  setConnectionStatus(status: ConnectionStatus): void;

  getSymbol(symbol: string): SymbolState | undefined;

  setConnectionInfo(info: ConnectionInfo): void;

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

      const history =
        current.history.length >= MAX_HISTORY
          ? [...current.history.slice(1), point]
          : [...current.history, point];

      next.set(symbol, {
        ...current,
        history,
      });

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

  clear() {
    set({
      symbols: new Map(),
      selectedSymbol: null,
    });
  },
})));
