import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export const useIsSmallDevice = (key: Breakpoint = 'md') => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(key));
};
