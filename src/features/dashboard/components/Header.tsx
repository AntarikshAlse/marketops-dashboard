import { Badge } from '@/components/ui/badge';
import { IconBroadcast } from '@tabler/icons-react';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <h1 className="text-lg font-semibold">MarketOps</h1>

      <Badge variant="secondary">
        {' '}
        <IconBroadcast className="mr-1 animate-pulse text-red-500" /> LIVE
      </Badge>
    </header>
  );
}
