import TestChart from '@/features/chart/components/TestChart';
import { Header } from './Header';
import { ChartPanel } from './panels/ChartPanel';
import { MetricsPanel } from './panels/MetricsPanel';
import { NewsPanel } from './panels/NewsPanel';
import { PerformancePanel } from './panels/PerformancePanel';
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
