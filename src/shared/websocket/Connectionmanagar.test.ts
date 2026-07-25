import { beforeEach, describe, it, test, expect } from "vitest";
import { ConnectionManager } from "./ConnectionManager";
import { useMarketStore } from "../store/marketStore";

describe("ConnectionManager", () => {
    beforeEach(() => {
        const connectionManager = new ConnectionManager();
        connectionManager.disconnect();
    });
    test("connect", () => {
        const connectionManager = new ConnectionManager();
        connectionManager.connect("wss://localhost:8080");
    });

    it("handles snapshot", () => {
        const manager = new ConnectionManager();

        manager["handleMessage"]({
            type: "snapshot",
            payload: {
                symbols: {
                    AAPL: {
                        symbol: "AAPL",
                        currentPrice: 100,
                        history: []
                    }
                }
            }
        } as any);

        expect(
            useMarketStore.getState().symbols.size
        ).toBe(1);
    });

    it("adds history after update", () => {
        const manager = new ConnectionManager();

        useMarketStore.getState().initialize([
            {
                symbol: "AAPL",
                currentPrice: 100,
                history: []
            } as any
        ]);

        manager["handleMessage"]({
            type: "update",
            payload: {
                updates: [
                    {
                        symbol: "AAPL",
                        price: 110,
                        change: 10,
                        volume: 100,
                        lastTradeTimestamp: 1000
                    }
                ]
            }
        } as any);

        manager["flushPendingUpdates"]();

        expect(
            useMarketStore.getState().getSymbol("AAPL")?.history.length
        ).toBe(1);
    });
});