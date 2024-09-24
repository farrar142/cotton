import { ElementSize } from '#/components/editors/ImpaintEditor/types';
import { RefObject, useRef, useEffect } from 'react';

export const useElementSize = <T extends HTMLElement>(ref: RefObject<T>) => {
  const sizeRef = useRef<ElementSize>({
    width: 360,
    height: 360,
    aspectRatio: 1,
  });
  useEffect(() => {
    const resizeEvent = () => {
      if (!ref.current) return;
      const [width, height] = [
        ref.current.clientWidth,
        ref.current.clientHeight,
      ];
      sizeRef.current = { width, height, aspectRatio: width / height };
    };
    window.addEventListener('resize', resizeEvent);
    resizeEvent();
    return () => window.removeEventListener('resize', resizeEvent);
  }, [ref]);
  return sizeRef;
};
