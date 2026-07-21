import { memo } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useMarketStore } from '@/shared/store/marketStore';
import { useSelectedSymbol, useSymbol } from '@/shared/store/selectors';

import { usePriceFlash } from '../hooks/usePriceFlash';
import { useWatchlistStore } from '../store';

interface Props {
  symbol: string;
}

export const WatchlistRow = memo(function WatchlistRow({ symbol }: Props) {
  const state = useSymbol(symbol);

  const selected = useSelectedSymbol();

  const selectSymbol = useMarketStore((s) => s.selectSymbol);

  const favorites = useWatchlistStore((s) => s.favorites);

  const toggleFavorite = useWatchlistStore((s) => s.toggleFavorites);

  const flash = usePriceFlash(state?.currentPrice ?? null);

  if (!state) return null;

  const isFavorite = favorites.has(state.symbol);

  return (
    <div
      role="button"
      tabIndex={0}
      // onClick={() => selectSymbol(state.symbol)}
      onClick={() => {
        console.log('Clicked', state.symbol);
        selectSymbol(state.symbol);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectSymbol(state.symbol);
        }
      }}
      className={cn(
        'flex h-14 cursor-pointer items-center justify-between border-b px-3 transition-colors',
        flash === 'up' && 'bg-green-500/10',
        flash === 'down' && 'bg-red-500/10',
        selected === state.symbol && 'bg-mauve-200',
      )}
    >
      <div>
        <p className="font-medium">{state.symbol}</p>

        <p className="text-xs text-muted-foreground">
          Price: {(state.currentPrice ?? 0).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={
            (state.percentChange ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
          }
        >
          {(state.percentChange ?? 0).toFixed(2)}%
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(state.symbol);
          }}
        >
          <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
});
