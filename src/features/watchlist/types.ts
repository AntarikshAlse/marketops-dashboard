export type SortField = 'symbol' | 'price' | 'change' | 'volume';

export type SortDirection = 'asc' | 'desc';

export interface WatchlistState {
  search: string;
  favoritesOnly: boolean;
  sortBy: SortField;
  direction: SortDirection;
  favorites: Set<string>;
}
