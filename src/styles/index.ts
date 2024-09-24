import { createStyles, createTheme, Theme } from '@mui/material';
import { atom, useRecoilState } from 'recoil';

const isDark = atom({ key: 'darkmode', default: true });

export const useDarkMode = () => useRecoilState(isDark);

const customTheme = createTheme({
  breakpoints: {
    values: {
      // extra-small
      xs: 320,
      // small
      sm: 640,
      // medium
      md: 960,
      // large
      lg: 1280,
      // extra-large
      xl: 1600,
    },
  },
});
export const glassmorphism = (theme: Theme) => {
  return {
    boxShadow: 3,
    border: `1px solid ${theme.palette.background.default}88`,
    borderBottom: `1px solid ${theme.palette.background.default}33`,
    borderRight: `1px solid ${theme.palette.background.default}33`,
    bgcolor: `${theme.palette.background.default}11`,
    backdropFilter: 'blur(5px)',
  };
};

export default customTheme;
