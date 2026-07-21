import { useMarketStore } from "../store/marketStore";
import type {
  MarketUpdate,
  ServerMessage,
} from "./types";

export class ConnectionManager {
  private ws?: WebSocket;

  private pending = new Map<
    string,
    MarketUpdate
  >();

  private flushTimer?: number;

  connect(url: string) {
    this.ws = new WebSocket(url);

    const store =
      useMarketStore.getState();

    store.setConnectionStatus(
      "connecting",
    );


    this.ws.onopen = () => {
      store.setConnectionStatus(
        "connected",
      );
    };

    this.ws.onclose = () => {
      store.setConnectionStatus(
        "disconnected",
      );
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
    this.ws?.close();

    if (this.flushTimer) {
      clearTimeout(
        this.flushTimer,
      );
      this.flushTimer = undefined;
    }
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

      case "update":
        for (const update of message
          .payload.updates) {
          console.log("update", update.lastTradeTimestamp);
          this.pending.set(
            update.symbol,
            update,
          );
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
        this.flush();

        this.flushTimer =
          undefined;
      }, 100);
  }

  private flush() {
    this.flushTimer = undefined;

    if (!this.pending.size) {
      return;
    }

    const store = useMarketStore.getState();

    for (const update of this.pending.values()) {
      store.updateSymbol(update.symbol, {
        currentPrice: update.price,
        absoluteChange: update.change,
        totalVolume: update.volume,
        lastTradeTimestamp: update.lastTradeTimestamp,
      });
      store.appendHistory(update.symbol, {
        timestamp: update.lastTradeTimestamp,
        price: update.price,
      });

      // console.log({
      //   timestamp: update.lastTradeTimestamp,
      //   date: new Date(update.lastTradeTimestamp).toISOString(),
      // });

      // const updated = store.getSymbol(update.symbol);

      // console.log(
      //   update.symbol,
      //   updated?.history.length,
      //   updated?.history.at(-1)
      // );
    }

    this.pending.clear();
  }
}