import { beforeEach, describe, expect, it } from 'vitest';
import { useMarketStore } from '@/shared/store/marketStore';

describe('marketStore', () => {
  beforeEach(() => {
    useMarketStore.setState({
      symbols: new Map(),
      selectedSymbol: null,
      connectionStatus: 'connecting',
      connectionInfo: null,
    });
  });

  describe('initialize', () => {
    it('creates a Map from symbol array', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 150, history: [] } as any,
        { symbol: 'GOOG', currentPrice: 2800, history: [] } as any,
      ]);
      const { symbols } = useMarketStore.getState();
      expect(symbols.size).toBe(2);
      expect(symbols.get('AAPL')?.currentPrice).toBe(150);
      expect(symbols.get('GOOG')?.currentPrice).toBe(2800);
    });

    it('overwrites existing symbols on re-initialize', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      useMarketStore.getState().initialize([
        { symbol: 'MSFT', currentPrice: 300, history: [] } as any,
      ]);
      expect(useMarketStore.getState().symbols.size).toBe(1);
      expect(useMarketStore.getState().symbols.has('AAPL')).toBe(false);
      expect(useMarketStore.getState().symbols.get('MSFT')?.currentPrice).toBe(300);
    });
  });

  describe('appendHistory', () => {
    it('appends a point to an existing symbol', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      useMarketStore.getState().appendHistory('AAPL', { timestamp: 1000, price: 101 });
      const history = useMarketStore.getState().getSymbol('AAPL')?.history;
      expect(history?.length).toBe(1);
      expect(history?.[0]).toEqual({ timestamp: 1000, price: 101 });
    });

    it('ignores appendHistory for unknown symbol', () => {
      useMarketStore.getState().appendHistory('UNKNOWN', { timestamp: 1000, price: 100 });
      expect(useMarketStore.getState().symbols.size).toBe(0);
    });

    it('caps history at MAX_HISTORY (500)', () => {
      const history = Array.from({ length: 500 }, (_, i) => ({ timestamp: i, price: 100 + i }));
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history } as any,
      ]);
      useMarketStore.getState().appendHistory('AAPL', { timestamp: 500, price: 600 });
      const result = useMarketStore.getState().getSymbol('AAPL')?.history;
      expect(result?.length).toBe(500);
      expect(result?.[0].timestamp).toBe(1);
      expect(result?.[499]).toEqual({ timestamp: 500, price: 600 });
    });
  });

  describe('batchAppendHistory', () => {
    it('appends multiple points for multiple symbols in one update', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
        { symbol: 'GOOG', currentPrice: 200, history: [] } as any,
      ]);
      useMarketStore.getState().batchAppendHistory([
        { symbol: 'AAPL', points: [{ timestamp: 1000, price: 101 }, { timestamp: 2000, price: 102 }] },
        { symbol: 'GOOG', points: [{ timestamp: 1000, price: 201 }] },
      ]);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(2);
      expect(useMarketStore.getState().getSymbol('GOOG')?.history.length).toBe(1);
    });

    it('skips unknown symbols in batch', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      useMarketStore.getState().batchAppendHistory([
        { symbol: 'UNKNOWN', points: [{ timestamp: 1000, price: 50 }] },
        { symbol: 'AAPL', points: [{ timestamp: 1000, price: 101 }] },
      ]);
      expect(useMarketStore.getState().symbols.size).toBe(1);
      expect(useMarketStore.getState().getSymbol('AAPL')?.history.length).toBe(1);
    });

    it('caps history correctly with batch append', () => {
      const history = Array.from({ length: 499 }, (_, i) => ({ timestamp: i, price: 100 + i }));
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history } as any,
      ]);
      useMarketStore.getState().batchAppendHistory([
        { symbol: 'AAPL', points: [{ timestamp: 500, price: 600 }, { timestamp: 501, price: 601 }, { timestamp: 502, price: 602 }] },
      ]);
      const result = useMarketStore.getState().getSymbol('AAPL')?.history;
      expect(result?.length).toBe(500);
      // With O(n) batch: [0..498] + [500,501,502] = 502 points, trimmed to last 500
      expect(result?.[0].timestamp).toBe(2);
      expect(result?.[499]).toEqual({ timestamp: 502, price: 602 });
    });
  });

  describe('batchUpdateSymbols', () => {
    it('updates multiple symbols in one call', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, totalVolume: 0 } as any,
        { symbol: 'GOOG', currentPrice: 200, totalVolume: 0 } as any,
      ]);
      useMarketStore.getState().batchUpdateSymbols([
        { symbol: 'AAPL', currentPrice: 105, totalVolume: 1000, percentChange: 0.05, lastTradeTimestamp: 1000 } as any,
        { symbol: 'GOOG', currentPrice: 210, totalVolume: 500, percentChange: 0.05, lastTradeTimestamp: 1000 } as any,
      ]);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(105);
      expect(useMarketStore.getState().getSymbol('GOOG')?.currentPrice).toBe(210);
      expect(useMarketStore.getState().getSymbol('AAPL')?.totalVolume).toBe(1000);
    });

    it('skips unknown symbols', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100 } as any,
      ]);
      useMarketStore.getState().batchUpdateSymbols([
        { symbol: 'UNKNOWN', currentPrice: 999 } as any,
      ]);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(100);
    });
  });

  describe('selectSymbol', () => {
    it('sets selectedSymbol', () => {
      useMarketStore.getState().selectSymbol('AAPL');
      expect(useMarketStore.getState().selectedSymbol).toBe('AAPL');
    });
  });

  describe('getSymbol', () => {
    it('returns undefined for unknown symbol', () => {
      expect(useMarketStore.getState().getSymbol('UNKNOWN')).toBeUndefined();
    });

    it('returns the symbol state for known symbol', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      expect(useMarketStore.getState().getSymbol('AAPL')).toBeDefined();
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(100);
    });
  });

  describe('clear', () => {
    it('resets all state', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [] } as any,
      ]);
      useMarketStore.getState().selectSymbol('AAPL');
      useMarketStore.getState().clear();
      expect(useMarketStore.getState().symbols.size).toBe(0);
      expect(useMarketStore.getState().selectedSymbol).toBeNull();
    });
  });

  describe('connectionStatus', () => {
    it('updates connection status', () => {
      useMarketStore.getState().setConnectionStatus('connected');
      expect(useMarketStore.getState().connectionStatus).toBe('connected');
      useMarketStore.getState().setConnectionStatus('disconnected');
      expect(useMarketStore.getState().connectionStatus).toBe('disconnected');
    });

    it('updates connection info', () => {
      const info = { timestamp: Date.now(), connectedClients: 42, providerConnected: true };
      useMarketStore.getState().setConnectionInfo(info);
      expect(useMarketStore.getState().connectionInfo).toEqual(info);
    });
  });
});
