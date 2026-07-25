import { useMarketStore } from './marketStore';
import type { SymbolState } from './types';
import type { HistoryPoint } from "./types";
import { useMemo } from 'react';

const EMPTY_HISTORY: HistoryPoint[] = [];

export const useSelectedSymbol = () =>
  useMarketStore((s) => s.selectedSymbol);

export const useSymbolsMap = () =>
  useMarketStore((s) => s.symbols);

export const useSymbol = (symbol: string) =>
  useMarketStore((s) => s.symbols.get(symbol));


export function useConnectionStatus() {
  return useMarketStore((state) => state.connectionStatus);
}

/**
 * Top movers.
 */
export function useHistory(symbol: string) {
  return useMarketStore(
    (state) => state.symbols.get(symbol)?.history ?? EMPTY_HISTORY
  );
}