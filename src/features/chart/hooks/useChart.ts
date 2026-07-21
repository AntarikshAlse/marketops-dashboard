import {
  BaselineSeries,
  ColorType,
  createChart,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type LineData,
} from 'lightweight-charts';
import { useRef } from 'react';

export function useChart() {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line' | 'Baseline' | 'Area'> | null>(null);

  const containerRef = (node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    // Prevent creating twice in StrictMode
    if (chartRef.current) {
      return;
    }

    console.log('Creating chart...');

    const chart = createChart(node, {
      width: node.clientWidth,
      height: node.clientHeight,

      layout: {
        background: {
          type: ColorType.Solid,
          color: 'transparent',
        },
        textColor: '#94a3b8',
      },

      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },

      rightPriceScale: {
        borderVisible: false,
      },

      timeScale: {
        borderVisible: false,
      },
    });

    const series = chart.addSeries(BaselineSeries, {
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const resize = () => {
      chart.applyOptions({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(node);

    // cleanup when node is removed
    (node as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  };

  const setData = (data: LineData[]) => {

    seriesRef.current?.setData(data);
    chartRef.current?.timeScale().fitContent();
  }

  const update = (point: LineData) => {
    seriesRef.current?.update(point);
    chartRef.current?.timeScale().scrollToRealTime();
  }

  return {
    containerRef,
    chartRef,
    setData,
    update,
  };
}