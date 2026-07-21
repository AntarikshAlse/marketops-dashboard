import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TradingChart } from './TradingChart';

const setData = vi.fn();
const update = vi.fn();

vi.mock('../hooks/useChart', () => ({
  useChart: () => ({
    containerRef: { current: document.createElement('div') },
    setData,
    update,
  }),
}));

vi.mock('@/shared/store/selectors', () => ({
  useSelectedSymbol: () => 'AAPL',
  useHistory: () => [
    {
      timestamp: 1784625106226,
      price: 100,
    },
    {
      timestamp: 1784625107226,
      price: 101,
    },
  ],
}));

describe('TradingChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders', () => {
    render(<TradingChart />);
  });

  it('calls setData on mount', () => {
    render(<TradingChart />);

    expect(setData).toHaveBeenCalledTimes(1);
  });

  it('passes normalized history', () => {
    render(<TradingChart />);

    expect(setData).toHaveBeenCalledWith([
      {
        time: 1784625106,
        value: 100,
      },
      {
        time: 1784625107,
        value: 101,
      },
    ]);
  });

  it('does not call update initially', () => {
    render(<TradingChart />);

    expect(update).not.toHaveBeenCalled();
  });
});
