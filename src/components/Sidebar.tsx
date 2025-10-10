import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  VideoLibrary as ShortsIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as LibraryIcon,
  History as HistoryIcon,
  WatchLater as WatchLaterIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const [libraryOpen, setLibraryOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Shorts', icon: <ShortsIcon />, path: '/shorts' },
    { text: 'Subscriptions', icon: <SubscriptionsIcon />, path: '/subscriptions' },
  ];

  const libraryItems = [
    { text: 'History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Watch Later', icon: <WatchLaterIcon />, path: '/playlist/watch-later' },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  const drawerWidth = isMobile ? 240 : (isOpen ? 240 : 72);

  const sidebarContent = (
    <Box
      sx={{ 
        backgroundColor: '#0F0F0F',
        width: '100%',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#404040',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#606060',
        },
      }}
    >
      <List sx={{ padding: '12px 0' }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            sx={{
              minHeight: isOpen || isMobile ? '40px' : '74px',
              borderRadius: isOpen || isMobile ? '10px' : '0',
              margin: isOpen || isMobile ? '0 8px 4px' : '0',
              padding: isOpen || isMobile ? '8px 12px' : '16px 0',
              backgroundColor: isActiveLink(item.path) ? '#FFFFFF' : 'transparent',
              color: isActiveLink(item.path) ? '#0F0F0F' : '#FFFFFF',
              '&:hover': {
                backgroundColor: isActiveLink(item.path) ? '#FFFFFF' : (isOpen || isMobile ? '#272727' : '#1F1F1F'),
              },
              display: 'flex',
              flexDirection: isOpen || isMobile ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: isOpen || isMobile ? 'flex-start' : 'center',
              gap: isOpen || isMobile ? '0' : '4px',
              transition: 'all 0.2s ease-in-out',
              textDecoration: 'none',
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: isOpen || isMobile ? '40px' : '24px',
                color: 'inherit',
                justifyContent: 'center',
                margin: 0,
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(isOpen || isMobile) ? (
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  margin: 0,
                  '& .MuiTypography-root': {
                    color: 'inherit',
                    fontSize: '14px',
                    fontWeight: isActiveLink(item.path) ? 600 : 400,
                    fontFamily: 'Roboto, sans-serif',
                  },
                }}
              />
            ) : (
              <Typography 
                variant="caption"
                sx={{
                  fontSize: '10px',
                  fontWeight: 400,
                  fontFamily: 'Roboto, sans-serif',
                  color: 'inherit',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  marginTop: '2px',
                }}
              >
                {item.text}
              </Typography>
            )}
          </ListItemButton>
        ))}
      </List>

      {(isOpen || isMobile) && (
        <>
          <Divider sx={{ backgroundColor: '#303030', margin: '8px 0', marginX: '12px' }} />
          
          <List sx={{ padding: '0' }}>
            <ListItemButton
              onClick={() => setLibraryOpen(!libraryOpen)}
              sx={{
                minHeight: '40px',
                borderRadius: '10px',
                margin: '8px 8px 2px',
                padding: '8px 12px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#272727',
                },
              }}
            >
              <ListItemIcon 
                className="text-youtube-light"
                sx={{ minWidth: '40px', color: '#FFFFFF' }}
              >
                <LibraryIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Library" 
                sx={{ 
                  '& .MuiTypography-root': {
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                  },
                }}
              />
              {libraryOpen ? (
                <ExpandLess sx={{ color: '#FFFFFF' }} />
              ) : (
                <ExpandMore sx={{ color: '#FFFFFF' }} />
              )}
            </ListItemButton>

            <Collapse in={libraryOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {libraryItems.map((item) => (
                  <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    onClick={isMobile ? onClose : undefined}
                    sx={{
                      minHeight: '36px',
                      borderRadius: '10px',
                      margin: '0 8px 2px',
                      marginLeft: '28px',
                      padding: '6px 12px',
                      backgroundColor: isActiveLink(item.path) ? '#FFFFFF' : 'transparent',
                      color: isActiveLink(item.path) ? '#0F0F0F' : '#FFFFFF',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: isActiveLink(item.path) ? '#FFFFFF' : '#272727',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: '40px', 
                        color: '#FFFFFF',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        '& .MuiTypography-root': {
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: isActiveLink(item.path) ? 500 : 400,
                          fontFamily: 'Roboto, sans-serif',
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#0F0F0F',
            border: 'none',
            width: drawerWidth,
            top: '56px',
            height: 'calc(100vh - 56px)',
            zIndex: 1300,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0F0F0F',
          border: 'none',
          borderRight: '1px solid #303030',
          transition: 'width 0.2s ease-in-out',
          top: '56px',
          height: 'calc(100vh - 56px)',
          zIndex: 1200,
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;