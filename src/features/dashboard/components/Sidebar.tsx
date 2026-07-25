import { Watchlist } from '@/features/watchlist/components/Watchlist';
import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export function Sidebar() {
  return (
    <aside className="h-full overflow-hidden">

      <ErrorBoundary
          FallbackComponent={ErrorFallback}
      >
      <Watchlist />
      </ErrorBoundary>
    </aside>
  );
}
