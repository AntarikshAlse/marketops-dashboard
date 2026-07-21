import type { SymbolState } from '@/shared/store/types';

export function filterSymbols(
  data: SymbolState[],
  search: string,
  favoritesOnly: boolean,
  favorites: Set<string>,
) {
  let result = data;

  if (favoritesOnly) {
    result = result.filter((item) => favorites.has(item.symbol));
  }

  if (!search.trim()) {
    return result;
  }

  const keyword = search.toLowerCase();

  return result.filter((item) => item.symbol.toLowerCase().includes(keyword));
}
