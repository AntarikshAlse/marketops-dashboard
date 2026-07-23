import { BASE_URL } from '@/lib/utils';
import { useSelectedSymbol } from '@/shared/store/selectors';
import { useQuery } from '@tanstack/react-query';
import { MetricsSkeleton } from '../MetricSkeleton';
import { MetricsSection } from '../MetricsSection';

export function MetricsPanel() {
  const symbol = useSelectedSymbol();

  const { data, isLoading } = useQuery({
    queryKey: ['metrics', symbol],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/metrics/${symbol}`);
      return res.json();
    },
    enabled: !!symbol,
    staleTime: 1000 * 60,
  });

  console.log(data);

  if (!symbol)
    return (
      <section className="border-r p-2">
        Metrics
        <p className="flex justify-center items-center">Please select a symbol</p>
      </section>
    );
  return (
    <section className="border-r p-2 overflow-auto relative">
      <h3 className="text-sm font-semibold sticky top-0 p-2 backdrop-blur-2xl">Metrics</h3>

      {isLoading ? <MetricsSkeleton /> : <MetricsSection metrics={data} />}
    </section>
  );
}
