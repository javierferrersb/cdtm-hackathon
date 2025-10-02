import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../services/auth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}>
          ConsultIQ Dashboard
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Welcome, {user.name}
            </Typography>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ cursor: 'pointer' }}
              onClick={handleMenu}
            >
              {user.name?.charAt(0)}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            color="primary"
            variant="outlined"
            href="/auth/google"
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Sign in with Google
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;