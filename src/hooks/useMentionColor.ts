import { decomposeColor, recomposeColor, useTheme } from '@mui/material';
import { useEffect } from 'react';

export const useMentionColor = () => {
  const theme = useTheme();
  useEffect(() => {
    const med = (value: number, closer: number = 0.9) => {
      if (value > 128) {
        return Math.round(value * (1 - closer));
      } else {
        return Math.round(value * (1 + closer));
      }
    };
    const hover = decomposeColor(theme.palette.background.default);
    document.documentElement.style.setProperty(
      '--mention-default',

      theme.palette.background.default
    );
    //@ts-ignore
    hover.values = hover.values.map((v) => med(v, 0.5));
    document.documentElement.style.setProperty(
      '--mention-hover',
      recomposeColor(hover)
    );
    const selected = decomposeColor(theme.palette.background.default);
    //@ts-ignore
    selected.values = selected.values.map((v) => med(v, 0.9));
    document.documentElement.style.setProperty(
      '--mention-selected',
      recomposeColor(selected)
    );
  }, [theme.palette.mode]);
};
