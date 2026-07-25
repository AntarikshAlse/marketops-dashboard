import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionManager } from './ConnectionManager';
import { useMarketStore } from '../store/marketStore';

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  readyState = 1;
  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
  close() { this.readyState = 3; }
  simulateOpen() { this.onopen?.(); }
  simulateMessage(data: unknown) { this.onmessage?.({ data: JSON.stringify(data) }); }
  simulateClose() { this.onclose?.(); }
  simulateError() { this.onerror?.(new Event('error')); }
}

// @ts-expect-error - Mocking global WebSocket
globalThis.WebSocket = MockWebSocket;

describe('ConnectionManager', () => {
  let manager: ConnectionManager;

  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.useFakeTimers();
    useMarketStore.setState({
      symbols: new Map(),
      selectedSymbol: null,
      connectionStatus: 'connecting',
      connectionInfo: null,
    });
    manager = new ConnectionManager();
  });

  afterEach(() => {
    manager.disconnect();
    vi.useRealTimers();
  });

  describe('connect', () => {
    it('creates a WebSocket connection', () => {
      manager.connect('wss://localhost:8080');
      expect(MockWebSocket.instances.length).toBe(1);
      expect(MockWebSocket.instances[0].url).toBe('wss://localhost:8080');
    });

    it('sets status to connected on open', () => {
      manager.connect('wss://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      expect(useMarketStore.getState().connectionStatus).toBe('connected');
    });

    it('sets status to reconnecting on close (auto-reconnect)', () => {
      manager.connect('wss://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();
      // After close, manager auto-reconnects -> status becomes 'reconnecting'
      expect(useMarketStore.getState().connectionStatus).toBe('reconnecting');
    });

    it('sets status to disconnected on error', () => {
      manager.connect('wss://localhost:8080');
      MockWebSocket.instances[0].simulateError();
      expect(useMarketStore.getState().connectionStatus).toBe('disconnected');
    });
  });

  describe('disconnect', () => {
    it('closes the WebSocket', () => {
      manager.connect('wss://localhost:8080');
      manager.disconnect();
      expect(MockWebSocket.instances[0].readyState).toBe(3);
    });

    it('sets manuallyDisconnected to prevent reconnect', () => {
      manager.connect('wss://localhost:8080');
      manager.disconnect();
      MockWebSocket.instances[0].simulateClose();
      expect(useMarketStore.getState().connectionStatus).toBe('disconnected');
    });
  });

  describe('handleMessage - snapshot', () => {
    it('initializes store with snapshot data', () => {
      manager['handleMessage']({
        type: 'snapshot',
        payload: {
          symbols: {
            AAPL: { symbol: 'AAPL', currentPrice: 150, history: [] },
            GOOG: { symbol: 'GOOG', currentPrice: 2800, history: [] },
          },
        },
      } as any);
      expect(useMarketStore.getState().symbols.size).toBe(2);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(150);
    });
  });

  describe('handleMessage - update', () => {
    beforeEach(() => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
        { symbol: 'GOOG', currentPrice: 200, history: [] } as any,
      ]);
    });

    it('queues history points for batch processing', () => {
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 }] },
      } as any);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(0);
    });

    it('queues watchlist updates for batch processing', () => {
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 }] },
      } as any);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(100);
    });

    it('flushes both history and watchlist updates', () => {
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 }] },
      } as any);
      manager['flushPendingUpdates']();
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(1);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(105);
    });

    it('batches multiple updates for the same symbol', () => {
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 }] },
      } as any);
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 110, change: 10, volume: 200, lastTradeTimestamp: 2000 }] },
      } as any);
      manager['flushPendingUpdates']();
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(2);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(110);
    });

    it('processes multiple symbols in one batch', () => {
      manager['handleMessage']({
        type: 'update',
        payload: {
          updates: [
            { symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 },
            { symbol: 'GOOG', price: 210, change: 10, volume: 50, lastTradeTimestamp: 1000 },
          ],
        },
      } as any);
      manager['flushPendingUpdates']();
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(1);
      expect(useMarketStore.getState().getSymbol('GOOG')?.history.length).toBe(1);
    });
  });

  describe('handleMessage - heartbeat', () => {
    it('updates connection info', () => {
      manager['handleMessage']({
        type: 'heartbeat',
        payload: { timestamp: Date.now(), connectedClients: 42, providerConnected: true },
      } as any);
      expect(useMarketStore.getState().connectionInfo).toBeDefined();
      expect(useMarketStore.getState().connectionInfo?.connectedClients).toBe(42);
    });
  });

  describe('scheduleFlush', () => {
    it('flushes after FLUSH_INTERVAL', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      manager['handleMessage']({
        type: 'update',
        payload: { updates: [{ symbol: 'AAPL', price: 105, change: 5, volume: 100, lastTradeTimestamp: 1000 }] },
      } as any);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(0);
      vi.advanceTimersByTime(20);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(1);
    });

    it('does not flush multiple times for rapid messages', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      for (let i = 0; i < 5; i++) {
        manager['handleMessage']({
          type: 'update',
          payload: { updates: [{ symbol: 'AAPL', price: 100 + i, change: i, volume: 100, lastTradeTimestamp: 1000 + i }] },
        } as any);
      }
      expect(manager['flushTimer']).toBeDefined();
      vi.advanceTimersByTime(20);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(5);
    });
  });

  describe('reconnection', () => {
    it('reconnects after disconnection with exponential backoff', () => {
      manager.connect('wss://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();
      expect(useMarketStore.getState().connectionStatus).toBe('reconnecting');
      vi.advanceTimersByTime(1000);
      expect(MockWebSocket.instances.length).toBe(2);
    });

    it('resets reconnect attempts on successful connection', () => {
      manager.connect('wss://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();
      vi.advanceTimersByTime(1000);
      MockWebSocket.instances[1].simulateOpen();
      expect(manager['reconnectAttempts']).toBe(0);
    });
  });
});
