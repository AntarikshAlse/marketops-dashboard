import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useChart } from './useChart';

vi.mock('lightweight-charts', () => {
  const setData = vi.fn();
  const update = vi.fn();
  const remove = vi.fn();

  return {
    ColorType: { Solid: 'solid' },
    LineSeries: {},
    BaselineSeries: {},
    createChart: vi.fn(() => ({
      addSeries: vi.fn(() => ({
        setData,
        update,
      })),
      remove,
      timeScale: vi.fn(() => ({
        fitContent: vi.fn(),
        scrollToRealTime: vi.fn(),
      })),
      applyOptions: vi.fn(),
    })),
  };
});

describe('useChart', () => {
  it('creates chart', () => {
    const { result } = renderHook(() => useChart());
    expect(result.current).toBeDefined();
    expect(result.current.setData).toBeDefined();
    expect(result.current.update).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
  });
});
