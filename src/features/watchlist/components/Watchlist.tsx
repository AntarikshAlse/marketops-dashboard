import { SearchBar } from './SearchBar';
import { WatchlistRow } from './WatchlistRow';
import { useSymbolsMap } from '@/shared/store/selectors';

export function Watchlist() {
  const symbolsMap = useSymbolsMap();
  const symbols = Array.from(symbolsMap.values());

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-2">
        <SearchBar />
      </div>

      <div className="overflow-auto">
        {symbols.map((symbol) => (
          <WatchlistRow key={symbol.symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}
