import { Input } from '@/components/ui/input';

import { useWatchlistStore } from '../store';

export function SearchBar() {
  const search = useWatchlistStore((s) => s.search);

  const setSearch = useWatchlistStore((s) => s.setSearch);

  return (
    <Input
      placeholder="Search symbol..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
