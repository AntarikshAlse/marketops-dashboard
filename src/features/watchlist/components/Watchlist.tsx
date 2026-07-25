import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useFilteredSymbols } from '../hooks/useFilteredSymbols';
import { SearchBar } from './SearchBar';
import { WatchlistRow } from './WatchlistRow';

const ROW_HEIGHT = 56; // h-14 = 56px

export function Watchlist() {
  const symbols = useFilteredSymbols();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: symbols.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-2">
        <SearchBar />
      </div>

      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const symbol = symbols[virtualRow.index];
            return (
              <div
                key={symbol.symbol}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <WatchlistRow symbol={symbol} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
