import { createBrowserRouter } from 'react-router-dom';

import { DashboardPage } from '@/pages/DashboardPage';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <Spinner />
            <span>Loading...</span>
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    ),
  },
]);
