import type { SymbolState } from "../store/types";

const pending = new Map<string, SymbolState>();

let scheduled = false;

export function enqueueUpdate(
    symbol: SymbolState,
    flush: (updates: SymbolState[]) => void
) {
    pending.set(symbol.symbol, symbol);

    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
        scheduled = false;

        const updates = [...pending.values()];
        pending.clear();

        flush(updates);
    });
}