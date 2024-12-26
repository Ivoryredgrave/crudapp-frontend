import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/login';
import Sidenav from '../components/sidenav';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../styles/theme';
import { AuthProvider } from '../context/authContext';
import { PrivateRoute } from './privateRoute';
import { getSavedTheme } from '../utils/storageUtils';

const AppRouter = () => {
  const savedTheme = getSavedTheme();
  const [theme, setTheme] = useState(
    savedTheme === 'light' ? lightTheme : darkTheme
  );

  const currentTheme = useMemo(() => theme, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.palette.mode === 'light' ? darkTheme : lightTheme
    );
  };

  useEffect(() => {
    localStorage.setItem('theme', theme.palette.mode);
  }, [theme]);

  return (
    <AuthProvider>
        
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />

        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Sidenav toggleTheme={toggleTheme} isDarkMode={theme.palette.mode === 'dark'} />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        
      </ThemeProvider>

    </AuthProvider>
  );
};

export default AppRouter;
