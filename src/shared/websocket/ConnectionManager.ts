import { useMarketStore } from "../store/marketStore";
import type { SymbolState } from "../store/types";
import type {
  ServerMessage,
} from "./types";

export class ConnectionManager {
  private ws?: WebSocket;
  private url = "";
  private flushTimer?: number;
  private pendingUpdates = new Map<string, SymbolState>();
  private readonly FLUSH_INTERVAL = 16;

  private reconnectTimer?: number;

  private reconnectAttempts = 0;

  private readonly MAX_RECONNECT_DELAY = 30000;

  private manuallyDisconnected = false;

  connect(url: string) {
    this.url = url;
    this.ws = new WebSocket(url);
     this.manuallyDisconnected = false;
    const store =
      useMarketStore.getState();

    store.setConnectionStatus(
      "connecting",
    );


    this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      store.setConnectionStatus(
        "connected",
      );
    };

    this.ws.onclose = () => {
      store.setConnectionStatus(
        "disconnected",
      );
      if (!this.manuallyDisconnected) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      store.setConnectionStatus(
        "disconnected",
      );
    };

    this.ws.onmessage = (
      event,
    ) => {
      const message: ServerMessage =
        JSON.parse(event.data);

      this.handleMessage(message);
    };
  }

  disconnect() {
    this.manuallyDisconnected = true;

    this.ws?.close();

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    this.pendingUpdates.clear();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.MAX_RECONNECT_DELAY
    );

    useMarketStore
      .getState()
      .setConnectionStatus("reconnecting");

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = undefined;
      this.reconnectAttempts++;

      this.connect(this.url);
    }, delay);
  }

  private handleMessage(
    message: ServerMessage,
  ) {
    switch (message.type) {
      case "snapshot": {
        const symbols = Object.values(message.payload.symbols);

        useMarketStore.getState().initialize(symbols);

        return;
      }

      case "update": {
        const appendHistory = useMarketStore.getState().appendHistory;

        for (const update of message.payload.updates) {
          // Live chart
          appendHistory(update.symbol, {
            timestamp: update.lastTradeTimestamp,
            price: update.price,
          });

          // Batched watchlist updates
          this.pendingUpdates.set(update.symbol, {
            ...update,
            currentPrice: update.price,
            absoluteChange: update.change,
            percentChange: update.change / update.price,
            totalVolume: update.volume,
            tradeCount: 0,
            high: null,
            low: null,
            vwap: null,
            history: [],
          });
        }
      }

        break;

      case "heartbeat":
        useMarketStore
          .getState()
          .setConnectionInfo(
            message.payload,
          );
        return;
    }

    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.flushTimer) return;

    this.flushTimer =
      window.setTimeout(() => {
        this.flushPendingUpdates();
        this.flushTimer =
          undefined;
      }, this.FLUSH_INTERVAL);
  }

  private flushPendingUpdates() {
    this.flushTimer = undefined;
    const store =
      useMarketStore.getState();

    if (this.pendingUpdates.size === 0) return;

    const updates = [...this.pendingUpdates.values()];

    this.pendingUpdates.clear();

    store.batchUpdateSymbols(updates);
  }
}
