import React, { Suspense, useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { menuRoutes } from '../routes/menuRoutes';
import { Main, drawerWidth, AppBar, DrawerHeader } from '../styles/sidenavStyles';
import PropTypes from 'prop-types';
import Home from '../pages/home/home';
import { useAuth } from '../context/authContext';
import { Card, Chip, CircularProgress, ListItem, Stack, Grid } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { MaterialUISwitch } from '../styles/sidenavStyles';

const DrawerContent = React.memo(({ open, handleDrawerClose, handleClick, openItems, getVisibleRoutes, theme, logout }) => (
  <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
    }}
    variant="persistent"
    anchor="left"
    open={open}
  >
    <Box sx={{ flexGrow: 1 }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {getVisibleRoutes.map((route, index) => (
          <React.Fragment key={index}>
            <ListItemButton onClick={() => handleClick(route.label)}>
              <ListItemText primary={route.label} />
              {openItems[route.label] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openItems[route.label]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {route.children.map((childRoute, childIndex) => (
                  <ListItem
                    key={childIndex}
                    disablePadding
                    component={Link}
                    to={childRoute.path}
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>{childRoute.icon}</ListItemIcon>
                      <ListItemText
                        primary={childRoute.label}
                        sx={{ color: theme.palette.text.primary }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>

    <Box
      sx={{
        padding: theme.spacing(5),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <Card variant='outlined'
        sx={{
          width: 200,
          padding: theme.spacing(1),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

        <Button
          color={theme.palette.logoutButton.color}
          onClick={logout}

          fullWidth
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Card>
    </Box>
  </Drawer>
));

const SidenavRoutes = React.memo(({ menuRoutes, lazyImportComponent }) => (
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
      {menuRoutes.map((route, index) =>
        route.children.map((childRoute, childIndex) => {
          const LazyComponent = lazyImportComponent(childRoute.path);
          return (
            <Route
              key={`${index}-${childIndex}`}
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

const Sidenav = React.memo(({ toggleTheme, isDarkMode }) => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const [open, setOpen] = React.useState(true);
  //const modeLabel = theme.palette.mode === 'light' ? 'Dark mode' : 'Light mode';

  const initialOpenItems = useMemo(() => {
    const items = {};
    menuRoutes.forEach((route) => {
      if (route.children && route.children.length > 0) {
        items[route.label] = true;
      }
    });
    return items;
  }, []);

  const [openItems, setOpenItems] = React.useState(initialOpenItems);

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

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

  const componentsMap = useMemo(() => ({
    "/users": () => import("../pages/users/users"),
    "/dashboard": () => import("../pages/dashboard/dashboard"),
  }), []);

  const FallbackComponent = () => <div>Component not found</div>;

  const lazyImportComponent = useCallback((path) => {
    const importFunc = componentsMap[path];
    return importFunc ? React.lazy(importFunc) : FallbackComponent;
  }, [componentsMap]);

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

          <Grid
            container
            alignItems="center"
            justifyContent="space-between">

            <Stack direction="row" spacing={1}>

              <Typography variant="h7" noWrap component="div">
                User connected: {user?.full_name}
              </Typography>
              <Chip
                label={user?.user_type}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'transparent',
                  color: theme.palette.mode === 'light' ? '#000000' : theme.palette.primary.main
                }}
              />

            </Stack>

            <FormGroup>
              <FormControlLabel
                control={<MaterialUISwitch checked={isDarkMode} onChange={toggleTheme} />}
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
        <SidenavRoutes menuRoutes={menuRoutes} lazyImportComponent={lazyImportComponent} />
      </Main>
    </Box>
  );
});

export default Sidenav;

Sidenav.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};
