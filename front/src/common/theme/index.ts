import { createTheme, ThemeOptions } from '@mui/material';

import colors from './colors';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: colors['Wintergreen Dream'],
    },
    secondary: {
      main: colors['Deep Champagne'],
    },
    error: {
      main: colors['Sizzling Red'],
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
