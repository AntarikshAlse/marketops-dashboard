import { describe, it, expect, beforeEach } from "vitest";
import { useMarketStore } from "./marketStore";

describe("market store", () => {
    beforeEach(() => {
        useMarketStore.getState().clear();
    });

    it("initializes symbols", () => {
        useMarketStore.getState().initialize([
            {
                symbol: "AAPL",
                currentPrice: 100,
                absoluteChange: 0,
                percentChange: 0,
                totalVolume: 1000,
                history: [],
            } as any,
        ]);

        expect(
            useMarketStore.getState().symbols.has("AAPL")
        ).toBe(true);
    });

    it("updates symbol", () => {
        useMarketStore.getState().initialize([
            {
                symbol: "AAPL",
                currentPrice: 100,
                absoluteChange: 0,
                percentChange: 0,
                totalVolume: 1000,
                history: [],
            } as any,
        ]);

        useMarketStore.getState().updateSymbol("AAPL", {
            currentPrice: 120,
        });

        expect(
            useMarketStore.getState().getSymbol("AAPL")?.currentPrice
        ).toBe(120);
    });

    it("appends history", () => {
        useMarketStore.getState().initialize([
            {
                symbol: "AAPL",
                currentPrice: 100,
                absoluteChange: 0,
                percentChange: 0,
                totalVolume: 1000,
                history: [],
            } as any,
        ]);

        useMarketStore.getState().appendHistory("AAPL", {
            timestamp: 1,
            price: 100,
        });

        expect(
            useMarketStore.getState().getSymbol("AAPL")?.history.length
        ).toBe(1);
    });
});