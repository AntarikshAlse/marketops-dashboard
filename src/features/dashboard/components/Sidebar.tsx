import { Watchlist } from '@/features/watchlist/components/Watchlist';

export function Sidebar() {
  return (
    <aside className="h-full overflow-hidden">
      <Watchlist />
    </aside>
  );
}
