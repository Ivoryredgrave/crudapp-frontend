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