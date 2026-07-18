import { useMarketStore } from './marketStore';

export const useConnectionStatus =
    () =>
        useMarketStore(
            (state) =>
                state.connectionStatus,
        );

export const useHeartbeat =
    () =>
        useMarketStore(
            (state) => state.heartbeat,
        );

export const useSymbols =
    () =>
        useMarketStore(
            (state) => state.symbols,
        );

export const useSymbol =
    (symbol: string) =>
        useMarketStore(
            (state) =>
                state.symbols.get(
                    symbol,
                ),
        );