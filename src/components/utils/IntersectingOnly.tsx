import { useObserver } from '#/hooks/useObserver';
import useValue from '#/hooks/useValue';
import { Box, BoxProps, CircularProgress } from '@mui/material';
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const IntersectingOnly: React.FC<{
  children: ReactNode;
  sx?: BoxProps['sx'];
}> = ({ children, sx }) => {
  const ref = useRef<HTMLDivElement>();
  const observer = useObserver();
  const show = useValue(false);
  const height = useValue(0);
  useEffect(() => {
    if (!ref.current) return;
    const box = ref.current;
    observer.onIntersection(() => setTimeout(() => show.set(true), 100));
    observer.onNotIntersection(() => {
      height.set(box.clientHeight);
      show.set(false);
    });
    observer.observe(box);
    return () => {
      observer.unobserve(box);
    };
  }, []);
  return (
    <Box ref={ref} width='100%' height={height.get || '100%'} sx={sx}>
      {show.get ? (
        children
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
  );
};
