import useValue from '#/hooks/useValue';
import { Box, CircularProgress } from '@mui/material';
import React, { ReactNode, useEffect, useRef } from 'react';

const random = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start) + start);
};

export const IntersectingOnly = <T extends {}>(
  WrappedComponent: React.FC<T>
): React.FC<T> => {
  return (props: T) => {
    const ref = useRef<HTMLDivElement>();
    const intersectedRef = useRef(false);
    const observerStart = useValue(false);
    const show = useValue(false);
    const height = useValue(0);
    useEffect(() => {
      if (!observerStart.get) return;
      if (!ref.current) return;
      show.set(true);
      const timeout = setTimeout(() => {
        intersectedRef.current = true;
      }, random(100, 300));
      return () => {
        clearTimeout(timeout);
        show.set(false);
        if (!intersectedRef.current) return;
        if (!ref.current) return;
        if (!ref.current.clientHeight) return;
        height.set(ref.current.clientHeight);
      };
    }, [observerStart.get]);

    useEffect(() => {
      if (observerStart.get) return;
      if (!ref.current) return;
      const box = ref.current;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observerStart.set(true);
              console.log('watching');
            } else {
              observerStart.set(false);
              console.log('not watching');
            }
          });
        },
        { rootMargin: '2000px' }
      );
      observer.observe(box);
      return () => {
        observer.unobserve(box);
        observer.disconnect();
      };
    }, []);
    return (
      <Box width='100%' height={height.get || '100%'}>
        <Box ref={ref}>
          {show.get ? (
            <WrappedComponent {...props} />
          ) : (
            <Box
              width='100%'
              height='100%'
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    );
  };
};
