import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Button from '@mui/material/Button';
import { DrawerHeader, drawerWidth } from '../../styles/sidenavStyles';
import LogoutIcon from '@mui/icons-material/Logout';
import { Card, IconButton, ListItem } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export const DrawerContent = React.memo(({ open, handleDrawerClose, handleClick, openItems, getVisibleRoutes, theme, logout }) => (
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

  DrawerContent.propTypes = {
    open: PropTypes.bool.isRequired,
    handleDrawerClose: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    openItems: PropTypes.object.isRequired,
    getVisibleRoutes: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };