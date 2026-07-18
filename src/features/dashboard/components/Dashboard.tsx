import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';

import { ChartPanel } from './panels/ChartPanel';
import { MetricsPanel } from './panels/MetricsPanel';
import { NewsPanel } from './panels/NewsPanel';
import { PerformancePanel } from './panels/PerformancePanel';

export function Dashboard() {
  return (
    <div className="grid h-screen grid-cols-[320px_1fr] grid-rows-[56px_1fr_36px] overflow-hidden">
      <header className="col-span-2 border-b">
        <Header />
      </header>

      <aside className="overflow-hidden border-r">
        <Sidebar />
      </aside>

      <main className="grid overflow-hidden grid-rows-[1fr_280px_32px]">
        <ChartPanel />

        <section className="grid grid-cols-2 border-t">
          <MetricsPanel />

          <NewsPanel />
        </section>

        <PerformancePanel />
      </main>

      <footer className="col-span-2 border-t">
        <StatusBar />
      </footer>
    </div>
  );
}
