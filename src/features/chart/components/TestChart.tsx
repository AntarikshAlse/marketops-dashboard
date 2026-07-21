import { createChart, LineSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export default function TestChart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('effect');

    if (!ref.current) return;

    console.log('container', ref.current);

    const chart = createChart(ref.current, {
      width: 600,
      height: 300,
    });

    console.log('chart created', chart);

    const line = chart.addSeries(LineSeries);

    line.setData([
      { time: 1, value: 10 },
      { time: 2, value: 20 },
      { time: 3, value: 15 },
      { time: 4, value: 30 },
    ]);

    return () => chart.remove();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: 600,
        height: 300,
        border: '1px solid red',
      }}
    />
  );
}
