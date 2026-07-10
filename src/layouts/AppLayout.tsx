import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { TaskLogo } from '../components/brand/TaskLogo';
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const drawerWidth = 244;
const brandName = 'Task';
const brandSubtitle = 'Workflow Intelligence';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: SpaceDashboardIcon },
  { label: 'Tasks', to: '/tasks', icon: TaskAltIcon },
  { label: 'Workflows', to: '/workflows', icon: AccountTreeIcon },
  { label: 'Messages', to: '/messages/mock', icon: MailOutlineIcon },
  { label: 'Completed', to: '/completed', icon: CheckCircleIcon },
  { label: 'Analytics', to: '/analytics', icon: AnalyticsIcon },
];

function formatToday(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
}

export function AppLayout() {
  const location = useLocation();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

  const currentSection = useMemo(() => {
    return navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? brandName;
  }, [location.pathname]);

  const sidebar = (
    <Stack sx={{ height: '100%' }}>
      <Toolbar sx={{ px: 2.25, py: 1.75, minHeight: 72 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <TaskLogo size={38} />
          <Box>
            <Typography variant="h6" fontWeight={780}>
              {brandName}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={650}>
              {brandSubtitle}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <List sx={{ px: 1.25, py: 1.25 }}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                mx: 0.5,
                my: 0.55,
                minHeight: 44,
                borderRadius: 2,
                color: 'text.secondary',
                transition: 'background-color 160ms ease, color 160ms ease, transform 160ms ease',
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                  minWidth: 36,
                },
                '&:hover': {
                  bgcolor: 'rgba(15, 23, 42, 0.04)',
                  transform: 'translateX(1px)',
                },
                '&.active': {
                  bgcolor: 'rgba(15, 118, 110, 0.085)',
                  color: 'primary.dark',
                  '& .MuiListItemText-primary': {
                    fontWeight: 720,
                  },
                },
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 1.75 }}>
        <Box
          sx={{
            p: 1.75,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="caption" color="primary.dark" fontWeight={720}>
            Workspace
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={720}>
            Product Review
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ready for auth integration
          </Typography>
        </Box>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRightColor: 'rgba(15, 23, 42, 0.08)',
            bgcolor: '#ffffff',
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            px: { xs: 2, md: 2.75 },
            py: { xs: 1, md: 1 },
            minHeight: { xs: 60, md: 66 },
            bgcolor: 'rgba(255, 255, 255, 0.94)',
            borderBottom: '1px solid',
            borderColor: 'rgba(15, 23, 42, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr auto',
                md: 'minmax(180px, 0.7fr) minmax(320px, 430px) minmax(360px, 1fr)',
              },
              alignItems: 'center',
              gap: { xs: 1.25, md: 2.25 },
            }}
          >
            <Stack spacing={0.15} sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 760, lineHeight: 1.15 }}>
                {currentSection}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600} lineHeight={1.2}>
                {formatToday()}
              </Typography>
            </Stack>

            <TextField
              size="small"
              placeholder="Search tasks, assignees..."
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '100%',
                maxWidth: 430,
                justifySelf: 'center',
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#ffffff',
                  height: 42,
                  borderRadius: 2.5,
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.055)',
                  '& fieldset': {
                    borderColor: 'rgba(15, 23, 42, 0.14)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(15, 118, 110, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1,
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: 15,
                  color: 'text.primary',
                  '&::placeholder': {
                    color: '#7c8593',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ minWidth: 0 }}>
              <Chip
                icon={<WorkspacesIcon />}
                label="Task AI"
                sx={{
                  display: { xs: 'none', lg: 'inline-flex' },
                  height: 38,
                  borderRadius: 2.25,
                  color: '#172033',
                  bgcolor: '#ffffff',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.045)',
                  fontWeight: 720,
                  '& .MuiChip-icon': {
                    color: 'primary.dark',
                    fontSize: 18,
                  },
                }}
              />
              <Chip
                label="Online"
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  height: 34,
                  borderRadius: 1.5,
                  color: '#166534',
                  bgcolor: 'rgba(22, 101, 52, 0.11)',
                  border: '1px solid rgba(22, 101, 52, 0.12)',
                  fontWeight: 700,
                }}
              />
              <IconButton
                size="small"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#ffffff',
                  border: '1px solid',
                  borderColor: 'rgba(15, 23, 42, 0.1)',
                  color: 'text.secondary',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.045)',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    color: 'primary.dark',
                  },
                }}
                aria-label="Notifications"
              >
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
              <ButtonBase
                onClick={(event) => setUserMenuAnchor(event.currentTarget)}
                sx={{
                  gap: 1,
                  height: 46,
                  minWidth: { xs: 46, sm: 196 },
                  p: 0.55,
                  pr: { xs: 0.55, sm: 1.25 },
                  borderRadius: 2.5,
                  bgcolor: '#ffffff',
                  border: '1px solid',
                  borderColor: 'rgba(15, 23, 42, 0.1)',
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                  '&:hover': {
                    borderColor: 'rgba(15, 118, 110, 0.22)',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'primary.main',
                    fontSize: 14,
                    fontWeight: 780,
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.35)',
                  }}
                >
                  CN
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={760} lineHeight={1.1} noWrap>
                    Chien
                  </Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1.1} noWrap>
                    Product Ops
                  </Typography>
                </Box>
                <KeyboardArrowDownIcon fontSize="small" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }} />
              </ButtonBase>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' }, mt: 1.25, overflowX: 'auto', pb: 0.25 }}
          >
            {navItems.map((item) => (
              <Chip
                key={item.to}
                component={NavLink}
                to={item.to}
                clickable
                label={item.label}
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 650,
                  '&.active': {
                    color: 'primary.dark',
                    bgcolor: 'rgba(15, 118, 110, 0.1)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>

        <Box component="main" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2.25, md: 3.5 }, maxWidth: 1440, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
