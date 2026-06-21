import { createTheme } from '@mui/material/styles';

export const taskzTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
    },
  },
});
