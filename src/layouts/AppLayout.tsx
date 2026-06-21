import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Tasks', to: '/tasks' },
  { label: 'Completed', to: '/completed' },
  { label: 'Analytics', to: '/analytics' },
];

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRightColor: 'rgba(15, 23, 42, 0.08)',
          },
        }}
      >
        <Toolbar sx={{ px: 3, py: 2 }}>
          <Typography variant="h5" fontWeight={800}>
            Taskz
          </Typography>
        </Toolbar>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                  },
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, px: 3, pb: 3, pt: { xs: 2, md: 3 } }}>
        <Toolbar sx={{ minHeight: { xs: 72, md: 88 } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
