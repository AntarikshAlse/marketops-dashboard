import { useMemo } from "react";

import { useSymbolsMap } from "@/shared/store/selectors";

import { useWatchlistStore } from "../store";
import { filterSymbols } from "../utils/filtering";
import { sortSymbols } from "../utils/sorting";

export function useFilteredSymbols() {
  const symbolsMap =
    useSymbolsMap();

  const search =
    useWatchlistStore(
      (s) => s.search,
    );

  const favorites =
    useWatchlistStore(
      (s) => s.favorites,
    );

  const favoritesOnly =
    useWatchlistStore(
      (s) => s.favoritesOnly,
    );

  const sortBy =
    useWatchlistStore(
      (s) => s.sortBy,
    );

  const direction =
    useWatchlistStore(
      (s) => s.direction,
    );

  return useMemo(() => {
    const symbols = Array.from(
      symbolsMap.values(),
    );

    const filtered =
      filterSymbols(
        symbols,
        search,
        favoritesOnly,
        favorites,
      );

    return sortSymbols(
      filtered,
      sortBy,
      direction,
    );
  }, [
    symbolsMap,
    search,
    favorites,
    favoritesOnly,
    sortBy,
    direction,
  ]);
}