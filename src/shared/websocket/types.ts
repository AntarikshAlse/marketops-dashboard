export interface MarketUpdate {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  lastTradeTimestamp: number;
}

export interface SnapshotMessage {
  type: 'snapshot';
  payload: {
    symbols: Record<string, MarketUpdate>;
  };
}

export interface UpdateMessage {
  type: 'update';
  payload: {
    updates: MarketUpdate[];
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

export type ServerMessage = SnapshotMessage | UpdateMessage | HeartbeatMessage;
