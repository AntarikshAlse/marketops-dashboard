import { useConnectionStatus } from '@/shared/store/selectors';

export function StatusBar() {
  const status = useConnectionStatus();

  return (
    <div className="flex h-full items-center justify-between px-4 text-xs">
      <span>WebSocket: {status}</span>

      <span>MarketOps © 2026</span>
    </div>
  );
}
