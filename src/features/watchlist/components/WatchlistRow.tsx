import { memo } from 'react';

import { cn } from '@/lib/utils';
import { useMarketStore } from '@/shared/store/marketStore';
import { useSelectedSymbol } from '@/shared/store/selectors';

import { usePriceFlash } from '../hooks/usePriceFlash';
import { useWatchlistStore } from '../store';
import type { SymbolState } from '@/shared/store/types';
import { IconStar } from '@tabler/icons-react';

interface Props {
  symbol: SymbolState;
}

export const WatchlistRow = memo(function WatchlistRow({ symbol }: Props) {
  const selected = useSelectedSymbol();

  const selectSymbol = useMarketStore((s) => s.selectSymbol);

  const favorites = useWatchlistStore((s) => s.favorites);

  const toggleFavorite = useWatchlistStore((s) => s.toggleFavorites);

  const flash = usePriceFlash(symbol?.currentPrice ?? null);

  const isFavorite = favorites.has(symbol.symbol);

  return (
    // biome-ignore lint/a11y/useSemanticElements: <explanation>
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        console.log('Clicked', symbol.symbol);
        selectSymbol(symbol.symbol);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectSymbol(symbol.symbol);
        }
      }}
      className={cn(
        'flex h-14 cursor-pointer items-center justify-between border-b px-3 transition-colors',
        flash === 'up' && 'bg-green-500/10',
        flash === 'down' && 'bg-red-500/10',
        selected === symbol.symbol && 'bg-mauve-200',
      )}
    >
      <div>
        <p className="font-medium">{symbol.symbol}</p>

        <p className="text-xs text-muted-foreground">Price: {(symbol.currentPrice ?? 0).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={(symbol.totalVolume ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}>
          Vol: {(symbol.totalVolume ?? 0).toFixed(2)}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(symbol.symbol);
          }}
        >
          <IconStar size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
});
