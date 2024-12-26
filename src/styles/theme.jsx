import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    avatarBackground: {
      main: '#1975d1',
    },
    logoutButton: {
      color: 'inherit',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    avatarBackground: {
      main: '#d898e3',
    },
    logoutButton: {
      color: 'secondary',
    },
  },
});