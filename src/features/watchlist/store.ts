import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SortDirection, SortField, WatchlistState } from './types';

interface WatchlistActions {
  setSearch(value: string): void;

  setSort(field: SortField, direction: SortDirection): void;

  toggleFavorites(symbol: string): void;

  toggleFavoritesOnly(): void;
}

export const useWatchlistStore = create<WatchlistState & WatchlistActions>()(devtools(
  (set) => ({
    search: '',

    favorites: new Set<string>(),

    favoritesOnly: false,

    sortBy: 'symbol',

    direction: 'asc',

    setSearch(search) {
      set({ search });
    },

    toggleFavorites(symbol) {
      set((state) => {
        const favorites = new Set(state.favorites);

        if (favorites.has(symbol)) {
          favorites.delete(symbol);
        } else {
          favorites.add(symbol);
        }

        return { favorites };
      });
    },

    toggleFavoritesOnly() {
      set((state) => ({
        favoritesOnly: !state.favoritesOnly,
      }));
    },

    setSort(sortBy, direction) {
      set({
        sortBy,
        direction,
      });
    },
  }),
));

