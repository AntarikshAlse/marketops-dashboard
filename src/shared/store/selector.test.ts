import { describe, expect, it } from "vitest";
import { useMarketStore } from "./marketStore";

describe("selector", () => {
    it("returns history", () => {
        useMarketStore.getState().initialize([
            {
                symbol: "AAPL",
                history: [
                    {
                        timestamp: 1,
                        price: 100
                    }
                ]
            } as any
        ]);

        expect(
            useMarketStore.getState().getSymbol("AAPL")?.history.length
        ).toBe(1);
    });

})