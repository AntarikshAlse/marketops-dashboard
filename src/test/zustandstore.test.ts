import { describe, expect, it } from "vitest";
import { useMarketStore } from "@/shared/store/marketStore";

describe("market store", () => {
    it("updates state", () => {
        useMarketStore.setState({
            selectedSymbol: "AAPL",
        });

        expect(useMarketStore.getState().selectedSymbol).toBe("AAPL");
    });
});