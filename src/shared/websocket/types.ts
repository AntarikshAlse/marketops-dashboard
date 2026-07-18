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

export interface SnapshotMessage {
    type: 'snapshot';

    payload: {
        symbols: Record<string, SymbolState>;
    };
}

export interface UpdateMessage {
    type: 'update';

    payload: {
        updates: {
            symbol: string;
            price: number;
            change: number;
            volume: number;
            lastTradeTimestamp: number;
        }[];
    };
}

export interface HeartbeatMessage {
    type: 'heartbeat';

    payload: {
        timestamp: number;
        connectedClients: number;
        providerConnected: boolean;
    };
}

export type ServerMessage =
    | SnapshotMessage
    | UpdateMessage
    | HeartbeatMessage;