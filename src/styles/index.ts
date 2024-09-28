import { createStyles, createTheme, Theme, Typography } from '@mui/material';
import { atom, useRecoilState } from 'recoil';

const isDark = atom({ key: 'darkmode', default: true });

export const useDarkMode = () => useRecoilState(isDark);
const fontFamily = [
  'Noto Sans KR',
  'Roboto',
  'Helvetica',
  'Arial',
  'sans-serif',
].join(',');
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#78d400',
    },
    info: {
      main: '#78d400',
    },
  },
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
  typography: {
    allVariants: {
      fontFamily,
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 10,
        },
      },
    },
  },
});
const threeDigitTranslate = (hex: string) => {
  const splitted = hex.split('#')[1];
  if (splitted.length === 3)
    return (
      '#' +
      Array(splitted)
        .map((char) => char + char)
        .join('')
    );
  return hex;
};
export const glassmorphism = (theme: Theme) => {
  const hex = threeDigitTranslate(theme.palette.background.default);
  return {
    boxShadow: 3,
    border: `1px solid ${hex}88`,
    borderBottom: `1px solid ${hex}33`,
    borderRight: `1px solid ${hex}33`,
    bgcolor: `${hex}11`,
    backdropFilter: 'blur(5px)',
  };
};

export default customTheme;
