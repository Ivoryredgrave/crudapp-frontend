import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/home/home';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const menuRoutes = [
  {
    label: 'Menu',
    children: [
      { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/users', label: 'Users', icon: <AccountCircleIcon /> }
    ]
  },
];

export const SidenavRoutes = React.memo(({ lazyImportComponent }) => (
  <Suspense
    fallback={
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    }
  >
    <Routes>
      <Route path="/home" element={<Home />} />
      {menuRoutes.map((route) =>
        route.children.map((childRoute) => {
          const LazyComponent = lazyImportComponent(childRoute.path);
          return (
            <Route
              key={childRoute.path}
              path={childRoute.path}
              element={<LazyComponent />}
            />
          );
        })
      )}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  </Suspense>
));

SidenavRoutes.propTypes = {
  lazyImportComponent: PropTypes.func.isRequired
};