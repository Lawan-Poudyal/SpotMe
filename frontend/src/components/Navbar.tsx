import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { handleLogOut } from '../api/sign-out';
import { SwitchCamera } from 'lucide-react';

const pages: string[] = [];
const settings = ['Profile', 'Account', 'Logout'];

interface NavbarProps {
  onMenuClick: () => void;
}

export default function ResponsiveAppBar({ onMenuClick }: NavbarProps) {
  // remove anchorElNav state entirely
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const userContext = useContext(UserContext);
  const navigation = useNavigate();

  const fullName = userContext?.contextState?.userName as string;
  const profilePicLink = userContext?.contextState?.profilePicLink as string;
  const twoInitials = fullName
    .split(' ')
    .map((item) => item[0].toUpperCase())
    .join('');

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#0A0A12',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 60 } }}>
          {/* Desktop logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, mr: 0 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: '#F97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SwitchCamera size={16} color="#fff" />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '.05rem',
                color: '#EAEAF5',
                textDecoration: 'none',
              }}
            >
              SpotMe
            </Typography>
          </Box>

          {/* Mobile hamburger — now calls onMenuClick */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              onClick={onMenuClick}
              sx={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile logo */}
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                background: '#F97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SwitchCamera size={14} color="#fff" />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '.05rem',
                color: '#EAEAF5',
                textDecoration: 'none',
              }}
            >
              SpotMe
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />

          {/* Avatar / user menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {!profilePicLink ? (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(249,115,22,0.15)',
                      border: '1.5px solid rgba(249,115,22,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F97316',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {twoInitials}
                  </Box>
                ) : (
                  <Avatar
                    alt={twoInitials}
                    src={profilePicLink}
                    sx={{
                      width: 36,
                      height: 36,
                      border: '1.5px solid rgba(249,115,22,0.35)',
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{
                mt: '48px',
                '& .MuiPaper-root': {
                  background: '#1A1A2E',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  minWidth: 160,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                },
                '& .MuiMenuItem-root': {
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.875rem',
                  padding: '10px 16px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.04)',
                    color: '#EAEAF5',
                  },
                  '&:last-child': {
                    color: 'rgba(239,68,68,0.7)',
                    '&:hover': {
                      background: 'rgba(239,68,68,0.08)',
                      color: '#ef4444',
                    },
                  },
                },
              }}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    if (setting === 'Logout') {
                      handleLogOut(navigation, userContext?.setContextState);
                    }
                    handleCloseUserMenu();
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
