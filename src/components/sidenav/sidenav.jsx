import React, { useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Main, AppBar, DrawerHeader } from '../../styles/sidenavStyles';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/authContext';
import { Chip, Stack, Grid } from '@mui/material';
import { MaterialUISwitch } from '../../styles/sidenavStyles';

import { DrawerContent } from './drawerContent';
import { SidenavRoutes, menuRoutes } from './sidenavRoutes';

const componentsMap = {
  "/users": () => import("../../pages/users/users"),
  "/dashboard": () => import("../../pages/dashboard/dashboard"),
};

const FallbackComponent = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <Typography variant="h6" color="text.secondary">
      Component not found
    </Typography>
  </Box>
);

const Sidenav = React.memo(({ toggleTheme, isDarkMode }) => {

  const theme = useTheme();
  const { logout, user } = useAuth();
  const [open, setOpen] = React.useState(true);

  const [openItems, setOpenItems] = React.useState(() => {
    const items = {};
    menuRoutes.forEach((route) => {
      if (route.children && route.children.length > 0) {
        items[route.label] = true;
      }
    });
    return items;
  });

  const handleDrawerOpen = useCallback(() => setOpen(true), []);
  const handleDrawerClose = useCallback(() => setOpen(false), []);

  const handleClick = useCallback((label) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [label]: !prevOpenItems[label],
    }));
  }, []);

  const getVisibleRoutes = useMemo(() => {
    if (user.user_type === 'Admin') {
      return menuRoutes;
    }
    return menuRoutes.map((route) => ({
      ...route,
      children: route.children.filter(
        (child) => child.path === '/home' || user.permissions.includes(child.path)
      ),
    })).filter((route) => route.children.length > 0);
  }, [user]);

  const lazyImportComponent = useCallback((path) => {
    const importFunc = componentsMap[path];
    return importFunc ? React.lazy(importFunc) : FallbackComponent;
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Grid container alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" noWrap>
                User connected: {user?.full_name}
              </Typography>
              <Chip
                label={user?.user_type}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'transparent',
                  color: theme.palette.mode === 'light' ? '#000000' : theme.palette.primary.main,
                }}
              />
            </Stack>

            <FormGroup>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                }
                label=""
              />
            </FormGroup>
          </Grid>

        </Toolbar>
      </AppBar>

      <DrawerContent
        open={open}
        handleDrawerClose={handleDrawerClose}
        handleClick={handleClick}
        openItems={openItems}
        getVisibleRoutes={getVisibleRoutes}
        theme={theme}
        logout={logout}
      />

      <Main open={open}>
        <DrawerHeader />
        <SidenavRoutes lazyImportComponent={lazyImportComponent} />
      </Main>
    </Box>
  );
});

Sidenav.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default Sidenav;