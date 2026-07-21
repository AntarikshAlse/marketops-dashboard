import type { LineData, Time } from 'lightweight-charts';
import { useEffect, useMemo } from 'react';

import { useHistory, useSelectedSymbol } from '@/shared/store/selectors';

import { useChart } from '../hooks/useChart';

function normalizeHistory(
  history: { timestamp: number; price: number }[],
): LineData[] {
  const map = new Map<number, number>();

  for (const point of history) {
    // last trade within the second wins
    map.set(Math.floor(point.timestamp / 1000), point.price);
  }

  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([time, value]) => ({
      time: time as Time,
      value,
    }));
}

export function TradingChart() {
  const symbol = useSelectedSymbol();

  const history = useHistory(symbol ?? '__NONE__');
  const { containerRef, chartRef, setData } = useChart();

  const chartData = normalizeHistory(history);

  useEffect(() => {
    console.log('History:', history.length);
    console.log('ChartData:', chartData.length);
    console.log('Chart:', chartRef.current);

    if (!chartRef.current) return;
    if (!chartData.length) return;
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].time <= chartData[i - 1].time) {
        console.log('Duplicate', i, chartData[i - 1].time, chartData[i].time);
        break;
      }
    }

    setData(chartData);

    requestAnimationFrame(() => {
      chartRef.current?.timeScale().fitContent();
    });
  }, [chartData, setData, chartRef, history]);

  if (!symbol) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Select a symbol
      </div>
    );
  }

  return (
    <div
      ref={(node) => {
        containerRef(node);

        if (!node) return;

        return () => {
          (node as HTMLDivElement & { __cleanup?: () => void }).__cleanup?.();
        };
      }}
      className="h-full w-full"
      style={{ minHeight: 300 }}
    />
  );
}
