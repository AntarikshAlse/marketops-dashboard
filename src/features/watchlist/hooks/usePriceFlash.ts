import { useEffect, useRef, useState } from 'react';

export function usePriceFlash(value: number | null) {
  const previous = useRef<number | null>(null);

  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (value == null) {
      return;
    }

    if (previous.current != null) {
      if (value > previous.current) {
        setFlash('up');
      } else if (value < previous.current) {
        setFlash('down');
      }
    }

    previous.current = value;

    const timer = window.setTimeout(() => {
      setFlash(null);
    }, 250);

    return () => clearTimeout(timer);
  }, [value]);

  return flash;
}
