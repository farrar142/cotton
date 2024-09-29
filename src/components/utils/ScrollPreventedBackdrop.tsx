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
          zIndex={10}
          overflow='scroll'
          className='hide-scrollbar'
        >
          {children}
        </Box>
      ) : (
        <></>
      )}
    </Fragment>
  );
};
