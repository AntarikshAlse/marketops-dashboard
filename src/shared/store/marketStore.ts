import { create } from "zustand";

import type { HeartbeatState, SymbolState } from "./types";

interface MarketStore {
    symbols: Map<string, SymbolState>;

    heartbeat?: HeartbeatState;

    connectionStatus: "connecting" | "connected" | "disconnected";

    setSnapshot(snapshot: Record<string, SymbolState>): void;

    updateSymbols(
        updates: {
            symbol: string;
            price: number;
            change: number;
            volume: number;
            lastTradeTimestamp: number;
        }[],
    ): void;

    setHeartbeat(heartbeat: HeartbeatState): void;

    setConnectionStatus(status: MarketStore["connectionStatus"]): void;
}

export const useMarketStore = create<MarketStore>((set) => ({
    symbols: new Map(),

    connectionStatus: "connecting",

    heartbeat: undefined,

    setSnapshot(snapshot) {
        set({
            symbols: new Map(Object.entries(snapshot)),
        });
    },

    updateSymbols(updates) {
        set((state) => {
            const symbols = new Map(state.symbols);

            for (const update of updates) {
                const current = symbols.get(update.symbol);

                if (!current) continue;

                symbols.set(update.symbol, {
                    ...current,

                    currentPrice: update.price,

                    absoluteChange: update.change,

                    totalVolume: update.volume,

                    lastTradeTimestamp: update.lastTradeTimestamp,
                });
            }

            return {
                symbols,
            };
        });
    },

    setHeartbeat(heartbeat) {
        set({
            heartbeat,
        });
    },

    setConnectionStatus(connectionStatus) {
        set({
            connectionStatus,
        });
    },
}));
