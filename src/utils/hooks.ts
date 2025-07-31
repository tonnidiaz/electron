import { useEffect, useRef } from 'react';

export function useSkipInitialEffect(effect: () => void, deps: any[]) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    effect();
  }, deps);
}
