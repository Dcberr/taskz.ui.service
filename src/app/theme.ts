import { createTheme } from '@mui/material/styles';

export const taskzTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      dark: '#115e59',
      light: '#14b8a6',
    },
    secondary: {
      main: '#f97316',
      dark: '#c2410c',
      light: '#fb923c',
    },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(15, 23, 42, 0.1)',
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    h4: {
      fontWeight: 760,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 760,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 720,
      letterSpacing: 0,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 14px 34px rgba(15, 23, 42, 0.045)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 14px 34px rgba(15, 23, 42, 0.045)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 650,
          boxShadow: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#475569',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0,
          textTransform: 'uppercase',
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          letterSpacing: 0,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          boxShadow: '0 22px 54px rgba(15, 23, 42, 0.18)',
        },
      },
    },
  },
});
