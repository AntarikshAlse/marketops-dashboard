import type { LineData, Time } from 'lightweight-charts';
import { Suspense, useEffect, useMemo } from 'react';

import { useHistory, useSelectedSymbol } from '@/shared/store/selectors';

import { useChart } from '../hooks/useChart';

function normalizeHistory(history: { timestamp: number; price: number }[]): LineData[] {
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

export default function TradingChart() {
  const symbol = useSelectedSymbol();
  const history = useHistory(symbol ?? '__NONE__');
  const { containerRef, chartRef, setData } = useChart();

  const chartData = normalizeHistory(history);
  console.log('ChartData:', chartData.length);
  console.count('TradingChart');

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartData.length) return;

    setData(chartData);

    requestAnimationFrame(() => {
      chartRef.current?.timeScale().fitContent();
    });
  }, [chartData, setData, chartRef]);

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
