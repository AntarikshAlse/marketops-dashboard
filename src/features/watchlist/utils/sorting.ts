import type { SymbolState } from '@/shared/store/types';
import type { SortDirection, SortField } from '../types';

export function sortSymbols(
  data: SymbolState[],
  field: SortField,
  direction: SortDirection,
) {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...data].sort((a, b) => {
    switch (field) {
      case 'symbol':
        return multiplier * a.symbol.localeCompare(b.symbol);

      case 'price':
        return multiplier * ((a.currentPrice ?? 0) - (b.currentPrice ?? 0));

      case 'change':
        return multiplier * ((a.percentChange ?? 0) - (b.percentChange ?? 0));

      case 'volume':
        return multiplier * ((a.totalVolume ?? 0) - (b.totalVolume ?? 0));

      default:
        return 0;
    }
  });
}
