import { BASE_URL } from '@/lib/utils';
import { NewsSkeleton } from '@/shared/components/NewsSkeleton';
import { useSelectedSymbol } from '@/shared/store/selectors';
import { useQuery } from '@tanstack/react-query';
import { NewsSection } from '../NewsSection';

export function NewsPanel() {
  const symbol = useSelectedSymbol();

  const { data, isLoading } = useQuery({
    queryKey: ['news', symbol],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/news/${symbol}`);
      return res.json();
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5,
  });
  if (!symbol)
    return (
      <section className="border-r p-2 overflow-auto">
        News
        <p>Please select a symbol</p>
      </section>
    );

  return (
    <section className="border-r p-2 overflow-auto">
      <h3 className="text-sm font-semibold sticky top-0 p-2 backdrop-blur-2xl">News</h3>

      {isLoading ? <NewsSkeleton /> : <NewsSection news={data} />}
    </section>
  );
}
