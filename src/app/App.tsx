import { lazy, Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ws } from '@/shared/websocket';
import { Providers } from './providers';
import { router } from './router';

const PerformanceOverlay = import.meta.env.DEV
  ? lazy(() => import('./PerformanceOverlay').then((m) => ({ default: m.PerformanceOverlay })))
  : null;

export default function App() {
  useEffect(() => {
    ws.connect(import.meta.env.VITE_WS_URL);

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <Providers>
      {PerformanceOverlay && (
        <Suspense fallback={null}>
          <PerformanceOverlay />
        </Suspense>
      )}
      <RouterProvider router={router} />
    </Providers>
  );
}
