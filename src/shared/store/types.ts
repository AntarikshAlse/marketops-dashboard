export interface PricePoint {
    timestamp: number;
    price: number;
    volume: number;
}

export interface SymbolState {
    symbol: string;

    currentPrice: number | null;

    previousClose: number | null;

    absoluteChange: number;

    percentChange: number;

    totalVolume: number;

    tradeCount: number;

    high: number | null;

    low: number | null;

    vwap: number;

    lastTradeTimestamp: number | null;

    stale: boolean;

    history: PricePoint[];
}

export interface HeartbeatState {
    timestamp: number;

    connectedClients: number;

    providerConnected: boolean;
}
