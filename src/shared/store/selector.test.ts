import { beforeEach, describe, expect, it } from 'vitest';
import { useMarketStore } from './marketStore';

describe('selectors', () => {
  beforeEach(() => {
    useMarketStore.setState({
      symbols: new Map(),
      selectedSymbol: null,
      connectionStatus: 'connecting',
      connectionInfo: null,
    });
  });

  describe('getSymbol', () => {
    it('returns the symbol state', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 150, history: [{ timestamp: 1, price: 100 }] } as any,
      ]);
      const symbol = useMarketStore.getState().getSymbol('AAPL');
      expect(symbol).toBeDefined();
      expect(symbol?.currentPrice).toBe(150);
      expect(symbol?.history.length).toBe(1);
    });

    it('returns undefined for missing symbol', () => {
      expect(useMarketStore.getState().getSymbol('MISSING')).toBeUndefined();
    });
  });

  describe('initialize and getSymbol integration', () => {
    it('can retrieve all initialized symbols', () => {
      const symbols = [
        { symbol: 'AAPL', currentPrice: 150, history: [] },
        { symbol: 'GOOG', currentPrice: 2800, history: [] },
        { symbol: 'MSFT', currentPrice: 300, history: [] },
      ];
      useMarketStore.getState().initialize(symbols as any);
      expect(useMarketStore.getState().getSymbol('AAPL')?.currentPrice).toBe(150);
      expect(useMarketStore.getState().getSymbol('GOOG')?.currentPrice).toBe(2800);
      expect(useMarketStore.getState().getSymbol('MSFT')?.currentPrice).toBe(300);
    });
  });

  describe('history persistence', () => {
    it('history is preserved through batchUpdateSymbols', () => {
      useMarketStore.getState().initialize([
        { symbol: 'AAPL', currentPrice: 100, history: [{ timestamp: 1, price: 100 }] } as any,
      ]);
      useMarketStore.getState().batchUpdateSymbols([
        { symbol: 'AAPL', currentPrice: 110, totalVolume: 500 } as any,
      ]);
      const symbol = useMarketStore.getState().getSymbol('AAPL');
      expect(symbol?.currentPrice).toBe(110);
      expect(symbol?.history.length).toBe(1);
      expect(symbol?.history[0]).toEqual({ timestamp: 1, price: 100 });
    });
  });
});
