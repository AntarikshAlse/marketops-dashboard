import { lazy, Suspense } from 'react';
import { Header } from './Header';

const ChartPanel = lazy(() =>
  import('./panels/ChartPanel').then((m) => ({
    default: m.ChartPanel,
  })),
);

const NewsPanel = lazy(() =>
  import('./panels/NewsPanel').then((m) => ({
    default: m.NewsPanel,
  })),
);

const MetricsPanel = lazy(() =>
  import('./panels/MetricsPanel').then((m) => ({
    default: m.MetricsPanel,
  })),
);

const PerformancePanel = lazy(() =>
  import('./panels/PerformancePanel').then((m) => ({
    default: m.PerformancePanel,
  })),
);

import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';

export function Dashboard() {
  return (
    <div className="grid h-screen grid-cols-[320px_1fr] grid-rows-[56px_1fr_36px] overflow-hidden">
      <header className="col-span-2 border-b">
        <Header />
      </header>
      <aside className="overflow-hidden border-r">
        <Sidebar />
      </aside>
      <main className="grid min-h-0 overflow-hidden grid-rows-[minmax(0,1fr)_280px_32px]">
        <Suspense fallback={<div>Loading...</div>}>
          <ChartPanel />
        </Suspense>
        <section className="grid grid-cols-2 border-t">
          <Suspense fallback={<div>Loading...</div>}>
            <NewsPanel />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <MetricsPanel />
          </Suspense>
        </section>
        <PerformancePanel />
      </main>
      <footer className="col-span-2 border-t">
        <StatusBar />
      </footer>
    </div>
  );
}
