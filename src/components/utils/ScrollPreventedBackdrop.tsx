import { Backdrop, Box, Dialog, DialogContent } from '@mui/material';
import { ReactNode, MouseEventHandler, useEffect, Fragment } from 'react';

export const ScrollPreventedBackdrop: React.FC<{
  children: ReactNode;
  open: boolean;
  onClick?: MouseEventHandler;
}> = ({ children, open, onClick }) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <Fragment>
      <Backdrop open={open} onClick={onClick} />
      {open ? (
        <Box
          width='100%'
          maxHeight='100%'
          minHeight='100%'
          height='100vh'
          position='fixed'
          top={0}
          left={0}
          bottom={0}
          right={0}
          zIndex={100}
          overflow='scroll'
          className='hide-scrollbar'
          onClick={onClick}
        >
          {children}
        </Box>
      ) : (
        <></>
      )}
    </Fragment>
  );
};
