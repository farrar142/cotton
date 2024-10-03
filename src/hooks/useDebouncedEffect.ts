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

export const useDebouncedFunction = () => {
  const memory = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const caller = (func: () => void, delayMiliseconds: number) => {
    clearTimeout(memory.current);
    memory.current = setTimeout(() => {
      func();
      clearTimeout(memory.current);
    }, delayMiliseconds);
  };

  return caller;
};

export default useDebouncedEffect;
