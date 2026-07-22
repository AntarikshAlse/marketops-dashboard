import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { useSelectedSymbol } from '@/shared/store/selectors';
import ChartSkeleton from '@/features/chart/components/ChartSkeleton';

const TradingChart = lazy(() => import('@/features/chart/components/TradingChart'));

export function ChartPanel() {
  const selectedSymbol = useSelectedSymbol();
  return (
    <div className="min-h-0">
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[selectedSymbol]}>
        <Suspense fallback={<ChartSkeleton />}>
          {selectedSymbol ? (
            <TradingChart />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl">Select symbol</span>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
