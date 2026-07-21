import type { IChartApi, ISeriesApi, LineData } from 'lightweight-charts';

export interface ChartContext {
  chart: IChartApi;
  series: ISeriesApi<'Line'>;
}

export type ChartPoint = LineData;
