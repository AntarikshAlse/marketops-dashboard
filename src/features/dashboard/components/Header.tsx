import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <h1 className="text-lg font-semibold">MarketOps</h1>

      <Badge variant="secondary">LIVE</Badge>
    </header>
  );
}
