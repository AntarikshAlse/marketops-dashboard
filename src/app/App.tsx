import { RouterProvider } from 'react-router-dom';

import { Providers } from './providers';
import { router } from './router';
import { useEffect } from 'react';
import { ws } from '@/shared/websocket';

export default function App() {
  useEffect(() => {
    ws.connect(import.meta.env.VITE_WS_URL);

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
