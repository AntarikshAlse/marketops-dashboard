export interface HistoryPoint {
  timestamp: number;
  price: number;
}

export interface SymbolState {
  symbol: string;

  currentPrice: number | null;

  absoluteChange: number | null;

  percentChange: number | null;

  totalVolume: number;

  tradeCount: number;

  high: number | null;

  low: number | null;

  vwap: number | null;

  lastTradeTimestamp: number | null;

  history: HistoryPoint[];
}
export interface HeartbeatState {
  timestamp: number;

  connectedClients: number;

  providerConnected: boolean;
}

export interface ConnectionInfo {
  timestamp: number;
  connectedClients: number;
  providerConnected: boolean;
}
