interface Metrics {
  metric: {
    marketCapitalization?: number;
    peBasicExclExtraTTM?: number;
    epsTTM?: number;
    beta?: number;
    '52WeekHigh'?: number;
    '52WeekLow'?: number;
    '52WeekPriceReturnDaily'?: number;
    currentDividendYieldTTM?: number;
    currentRatioQuarterly?: number;
    assetTurnoverTTM?: number;
  };
}

interface MetricsSectionProps {
  metrics: Metrics;
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-semibold">{value ?? '--'}</p>
    </div>
  );
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const m = metrics.metric;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Key Metrics</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <MetricCard
          label="Market Cap"
          value={m.marketCapitalization ? `${m.marketCapitalization.toFixed(2)} B` : '--'}
        />

        <MetricCard label="P/E Ratio" value={m.peBasicExclExtraTTM?.toFixed(2)} />

        <MetricCard label="EPS (TTM)" value={m.epsTTM?.toFixed(2)} />

        <MetricCard label="Beta" value={m.beta?.toFixed(2)} />

        <MetricCard label="52W High" value={`$${m['52WeekHigh']?.toFixed(2)}`} />

        <MetricCard label="52W Low" value={`$${m['52WeekLow']?.toFixed(2)}`} />

        <MetricCard label="52W Return" value={`${m['52WeekPriceReturnDaily']?.toFixed(2)}%`} />

        <MetricCard label="Dividend Yield" value={`${m.currentDividendYieldTTM?.toFixed(2)}%`} />

        <MetricCard label="Current Ratio" value={m.currentRatioQuarterly?.toFixed(2)} />

        <MetricCard label="Asset Turnover" value={m.assetTurnoverTTM?.toFixed(2)} />
      </div>
    </div>
  );
}
