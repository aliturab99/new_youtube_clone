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
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  VideoLibrary as ShortsIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as LibraryIcon,
  History as HistoryIcon,
  WatchLater as WatchLaterIcon,
  ThumbUp as LikedIcon,
  PlaylistPlay as PlaylistIcon,
  ExpandLess,
  ExpandMore,
  Whatshot as TrendingIcon,
  MusicNote as MusicIcon,
  SportsEsports as GamingIcon,
  EmojiEvents as SportsIcon,
  Newspaper as NewsIcon,
  Lightbulb as LearningIcon,
  Podcasts as PodcastsIcon,
  Settings as SettingsIcon,
  Flag as ReportIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
  AccountCircle as ChannelIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
  const location = useLocation();
  const { mode, colors } = useTheme();

  const mainMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/', badge: null },
    { text: 'Shorts', icon: <ShortsIcon />, path: '/shorts', badge: null },
    { text: 'Subscriptions', icon: <SubscriptionsIcon />, path: '/subscriptions', badge: '12' },
  ];

  const libraryItems = [
    { text: 'History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Watch Later', icon: <WatchLaterIcon />, path: '/playlist/watch-later' },
    { text: 'Liked Videos', icon: <LikedIcon />, path: '/playlist/liked' },
    { text: 'Playlists', icon: <PlaylistIcon />, path: '/playlists' },
  ];

  const exploreItems = [
    { text: 'Trending', icon: <TrendingIcon />, path: '/trending', color: '#FF0000' },
    { text: 'Music', icon: <MusicIcon />, path: '/music', color: '#FF0000' },
    { text: 'Gaming', icon: <GamingIcon />, path: '/gaming', color: '#FF0000' },
    { text: 'Sports', icon: <SportsIcon />, path: '/sports', color: '#FF0000' },
    { text: 'News', icon: <NewsIcon />, path: '/news', color: '#FF0000' },
    { text: 'Learning', icon: <LearningIcon />, path: '/learning', color: '#FF0000' },
    { text: 'Podcasts', icon: <PodcastsIcon />, path: '/podcasts', color: '#FF0000' },
  ];

  const subscriptionChannels = [
    { text: 'Tech Channel', path: '/channel/tech', avatar: 'T' },
    { text: 'Music Vibes', path: '/channel/music', avatar: 'M' },
    { text: 'Gaming Pro', path: '/channel/gaming', avatar: 'G' },
    { text: 'Cooking Master', path: '/channel/cooking', avatar: 'C' },
    { text: 'Fitness Hub', path: '/channel/fitness', avatar: 'F' },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Report', icon: <ReportIcon />, path: '/report' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
    { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  const drawerWidth = isMobile ? 260 : (isOpen ? 260 : 72);

  const sidebarContent = (
    <Box
      sx={{ 
        background: colors.sidebarBg,
        width: '100%',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'dark' 
            ? 'linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%)' 
            : 'linear-gradient(180deg, #BFDBFE 0%, #93C5FD 100%)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'dark' 
            ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' 
            : 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
        },
      }}
    >
      {/* Main Menu */}
      <List sx={{ padding: '12px 0' }}>
        {mainMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            sx={{
              minHeight: isOpen || isMobile ? '42px' : '74px',
              borderRadius: isOpen || isMobile ? '10px' : '0',
              margin: isOpen || isMobile ? '0 8px 4px' : '0',
              padding: isOpen || isMobile ? '10px 12px' : '16px 0',
              background: isActiveLink(item.path) 
                ? colors.buttonGradient 
                : 'transparent',
              color: colors.primaryText,
              boxShadow: isActiveLink(item.path) ? `0 4px 12px ${mode === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}` : 'none',
              '&:hover': {
                background: isActiveLink(item.path) 
                  ? colors.buttonGradient 
                  : colors.activeGradient,
                transform: isActiveLink(item.path) ? 'none' : 'translateX(4px)',
                boxShadow: isActiveLink(item.path) 
                  ? `0 6px 16px ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.4)'}` 
                  : `0 2px 8px ${mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
              },
              display: 'flex',
              flexDirection: isOpen || isMobile ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: isOpen || isMobile ? 'flex-start' : 'center',
              gap: isOpen || isMobile ? '0' : '4px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
              position: 'relative',
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
              <>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    margin: 0,
                    flex: 1,
                    '& .MuiTypography-root': {
                      color: 'inherit',
                      fontSize: '14px',
                      fontWeight: isActiveLink(item.path) ? 600 : 500,
                      fontFamily: 'Roboto, sans-serif',
                    },
                  }}
                />
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small"
                    sx={{
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: colors.buttonGradient,
                      color: colors.primaryText,
                      boxShadow: `0 2px 6px ${mode === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`,
                      '& .MuiChip-label': {
                        padding: '0 6px',
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <Typography 
                variant="caption"
                sx={{
                  fontSize: '10px',
                  fontWeight: 500,
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
          <Divider sx={{ 
            backgroundColor: '#303030', 
            margin: '8px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }} />
          
          {/* Explore Section */}
          <List sx={{ padding: '0' }}>
            <ListItemButton
              onClick={() => setExploreOpen(!exploreOpen)}
              sx={{
                minHeight: '40px',
                borderRadius: '10px',
                margin: '8px 8px 2px',
                padding: '8px 12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#272727' : 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: colors.primaryText }}>
                <TrendingIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Explore" 
                sx={{ 
                  '& .MuiTypography-root': {
                    color: colors.primaryText,
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                  },
                }}
              />
              {exploreOpen ? (
                <ExpandLess sx={{ color: colors.secondaryText }} />
              ) : (
                <ExpandMore sx={{ color: colors.secondaryText }} />
              )}
            </ListItemButton>

            <Collapse in={exploreOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {exploreItems.map((item) => (
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
                      backgroundColor: isActiveLink(item.path) ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      borderLeft: isActiveLink(item.path) ? `3px solid ${colors.primary}` : '3px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: isActiveLink(item.path) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                        borderLeft: `3px solid ${colors.primary}`,
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: '40px', 
                        color: isActiveLink(item.path) ? colors.primary : colors.secondaryText,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        '& .MuiTypography-root': {
                          color: isActiveLink(item.path) ? colors.primaryText : colors.secondaryText,
                          fontSize: '13px',
                          fontWeight: isActiveLink(item.path) ? 600 : 400,
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'color 0.3s ease',
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>

          <Divider sx={{ 
            backgroundColor: colors.border, 
            margin: '8px 12px',
            boxShadow: `0 1px 2px ${mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'}`,
          }} />
          
          {/* Library Section */}
          <List sx={{ padding: '0' }}>
            <ListItemButton
              onClick={() => setLibraryOpen(!libraryOpen)}
              sx={{
                minHeight: '40px',
                borderRadius: '10px',
                margin: '8px 8px 2px',
                padding: '8px 12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#272727' : 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: colors.primaryText }}>
                <LibraryIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Library" 
                sx={{ 
                  '& .MuiTypography-root': {
                    color: colors.primaryText,
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                  },
                }}
              />
              {libraryOpen ? (
                <ExpandLess sx={{ color: colors.secondaryText }} />
              ) : (
                <ExpandMore sx={{ color: colors.secondaryText }} />
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
                      backgroundColor: isActiveLink(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      borderLeft: isActiveLink(item.path) ? '3px solid #FFFFFF' : '3px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: isActiveLink(item.path) ? 'rgba(255, 255, 255, 0.15)' : '#272727',
                        borderLeft: '3px solid #FFFFFF',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: '40px', 
                        color: isActiveLink(item.path) ? '#FFFFFF' : '#AAAAAA',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        '& .MuiTypography-root': {
                          color: isActiveLink(item.path) ? '#FFFFFF' : '#AAAAAA',
                          fontSize: '13px',
                          fontWeight: isActiveLink(item.path) ? 600 : 400,
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'color 0.3s ease',
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>

          <Divider sx={{ 
            backgroundColor: '#303030', 
            margin: '8px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }} />

          {/* Subscriptions Section */}
          <List sx={{ padding: '0' }}>
            <ListItemButton
              onClick={() => setSubscriptionsOpen(!subscriptionsOpen)}
              sx={{
                minHeight: '40px',
                borderRadius: '10px',
                margin: '8px 8px 2px',
                padding: '8px 12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#272727',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: '#FFFFFF' }}>
                <SubscriptionsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Subscriptions" 
                sx={{ 
                  '& .MuiTypography-root': {
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                  },
                }}
              />
              {subscriptionsOpen ? (
                <ExpandLess sx={{ color: '#AAAAAA' }} />
              ) : (
                <ExpandMore sx={{ color: '#AAAAAA' }} />
              )}
            </ListItemButton>

            <Collapse in={subscriptionsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subscriptionChannels.map((channel) => (
                  <ListItemButton
                    key={channel.text}
                    component={Link}
                    to={channel.path}
                    onClick={isMobile ? onClose : undefined}
                    sx={{
                      minHeight: '36px',
                      borderRadius: '10px',
                      margin: '0 8px 2px',
                      marginLeft: '28px',
                      padding: '6px 12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: '#272727',
                        transform: 'translateX(4px)',
                        '& .channel-avatar': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
                        },
                      },
                    }}
                  >
                    <Box
                      className="channel-avatar"
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginRight: '16px',
                        transition: 'all 0.3s ease',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {channel.avatar}
                    </Box>
                    <ListItemText 
                      primary={channel.text}
                      sx={{ 
                        '& .MuiTypography-root': {
                          color: '#AAAAAA',
                          fontSize: '13px',
                          fontWeight: 400,
                          fontFamily: 'Roboto, sans-serif',
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>

          <Divider sx={{ 
            backgroundColor: '#303030', 
            margin: '8px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }} />

          {/* Bottom Menu */}
          <List sx={{ padding: '8px 0 12px' }}>
            {bottomMenuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                sx={{
                  minHeight: '36px',
                  borderRadius: '10px',
                  margin: '0 8px 2px',
                  padding: '6px 12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#272727',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: '40px', 
                    color: '#AAAAAA',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiTypography-root': {
                      color: '#AAAAAA',
                      fontSize: '13px',
                      fontWeight: 400,
                      fontFamily: 'Roboto, sans-serif',
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* Footer */}
          <Box sx={{ padding: '12px 20px', marginTop: 'auto' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#717171',
                fontSize: '11px',
                lineHeight: 1.6,
                fontFamily: 'Roboto, sans-serif',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              About Press Copyright<br />
              Contact us Creators<br />
              Advertise Developers
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#717171',
                fontSize: '11px',
                lineHeight: 1.6,
                fontFamily: 'Roboto, sans-serif',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Terms Privacy Policy & Safety<br />
              How YouTube works<br />
              Test new features
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#606060',
                fontSize: '10px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              © 2025 YouTube Clone
            </Typography>
          </Box>
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
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          },
        }}
        PaperProps={{
          elevation: 24,
        }}
        transitionDuration={{
          enter: 350,
          exit: 300,
        }}
        SlideProps={{
          timeout: {
            enter: 350,
            exit: 300,
          },
          easing: {
            enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
            exit: 'cubic-bezier(0.4, 1, 0.75, 0.9)',
          },
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(180deg, #0a0e27 0%, #000000 50%, #0d1b2a 100%)',
            border: 'none',
            borderRight: '1px solid rgba(59, 130, 246, 0.2)',
            width: drawerWidth,
            top: '56px',
            height: 'calc(100vh - 56px)',
            zIndex: 1300,
            boxShadow: '4px 0 24px rgba(59, 130, 246, 0.2)',
            overflowY: 'hidden',
            '&:hover': {
              overflowY: 'auto',
            },
            '&::-webkit-scrollbar': {
              width: '8px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            },
          },
          '@media (max-width: 600px)': {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
        }}
        onTouchStart={(e) => {
          const touchStartX = e.touches[0].clientX;
          if (touchStartX <= 25 && !isOpen) {
            onClose(); // This will toggle the drawer
          }
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
          background: 'linear-gradient(180deg, #0a0e27 0%, #000000 50%, #0d1b2a 100%)',
          border: 'none',
          borderRight: '1px solid rgba(59, 130, 246, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          top: '56px',
          height: 'calc(100vh - 56px)',
          zIndex: 1200,
          overflowX: 'hidden',
          overflowY: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
          '&::-webkit-scrollbar': {
            width: '8px',
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& .MuiDrawer-paper': {
            transition: 'none',
          },
        },
      }}
      PaperProps={{
        elevation: isOpen ? 8 : 4,
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;