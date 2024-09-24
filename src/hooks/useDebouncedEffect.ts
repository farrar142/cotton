import { useCallback, useEffect, useRef, useState } from 'react';

const useDebouncedEffect = <T>(
  func: () => void,
  deps: T,
  delay: number = 200
) => {
  const callback = useCallback(func, [deps, func]);

  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [callback, delay]);
};

export default useDebouncedEffect;
