import { Backdrop, Box } from '@mui/material';
import { ReactNode, MouseEventHandler, useEffect } from 'react';

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
    <Backdrop
      open={open}
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        zIndex: 15,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {children}
    </Backdrop>
  );
};
