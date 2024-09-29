import { useMediaQuery, useTheme } from '@mui/material';

const useMediaSize = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  return { isSmall, isMd };
};
export default useMediaSize;
