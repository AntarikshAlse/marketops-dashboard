import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ws } from '@/shared/websocket';
import { Providers } from './providers';
import { router } from './router';

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
