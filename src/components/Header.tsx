import React, { useState, useCallback, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Autocomplete,
  TextField,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  PlayArrow as PlayIcon,
  AccountCircle as ChannelIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getSearchSuggestions, SearchSuggestion, getCurrentUser, initializeDemoUser, User } from '../utils/mockData';
import AuthModal from './AuthModal';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, colors, toggleTheme } = useTheme();

  // Initialize demo user and check auth state on component mount
  useEffect(() => {
    initializeDemoUser();
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Debounced search function
  const debouncedGetSuggestions = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim().length >= 2) {
            setLoading(true);
            try {
              const results = await getSearchSuggestions(query);
              setSuggestions(results);
            } catch (error) {
              console.error('Failed to fetch suggestions:', error);
              setSuggestions([]);
            } finally {
              setLoading(false);
            }
          } else {
            setSuggestions([]);
          }
        }, 500);
      };
    })(),
    []
  );

  useEffect(() => {
    debouncedGetSuggestions(searchQuery);
  }, [searchQuery, debouncedGetSuggestions]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSuggestions([]);
      setSearchQuery('');
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'video') {
      navigate(`/watch/${suggestion.id}`);
    } else if (suggestion.type === 'channel') {
      navigate(`/profile/${suggestion.id}`);
    }
    setSuggestions([]);
    setSearchQuery('');
  };

  const handleAuthSuccess = (user: { id: string; name: string; email: string }) => {
    // Convert to full User object by adding required fields
    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      avatar: undefined,
      bio: undefined,
      subscriberCount: undefined,
      videosCount: 0,
    };
    setCurrentUser(fullUser);
    setAuthModalOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('youtube_current_user');
    setCurrentUser(null);
    setUserMenuAnchor(null);
    navigate('/');
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.id}`);
    }
    handleUserMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: colors.headerBg,
        boxShadow: mode === 'dark' ? '0 2px 12px rgba(59, 130, 246, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid ${colors.border}`,
        zIndex: 1400,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ 
        minHeight: '56px !important',
        paddingLeft: '16px',
        paddingRight: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Left section - Menu + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '170px' }}>
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: colors.primaryText,
              padding: '8px',
              marginRight: '8px',
              '&:hover': {
                background: 'rgba(59, 130, 246, 0.2)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <Box sx={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
              letterSpacing: '-0.5px',
            }}>
              <span style={{ color: '#FF0000' }}>You</span>
              <span style={{ color: colors.primaryText }}>Tube</span>
            </Box>
          </Link>
        </Box>

        {/* Center section - Search */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: '600px',
          marginX: { xs: '8px', lg: '32px' },
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
        }}>
          <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            maxWidth: '500px',
          }}>
            <Autocomplete
              freeSolo
              options={suggestions}
              loading={loading}
              value={searchQuery}
              onInputChange={(_, newValue) => setSearchQuery(newValue)}
              onChange={(_, value) => {
                if (typeof value === 'string') {
                  handleSearchSubmit(value);
                } else if (value) {
                  handleSuggestionSelect(value);
                }
              }}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.title
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search"
                  variant="outlined"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: mode === 'dark' ? '#121212' : '#F1F1F1',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '40px 0 0 40px',
                      padding: '0 16px',
                      color: colors.primaryText,
                      fontSize: '16px',
                      height: '40px',
                      transition: 'all 0.2s ease-in-out',
                      '& fieldset': {
                        border: 'none',
                      },
                      '& input': {
                        padding: '0',
                        color: colors.primaryText,
                        '&::placeholder': {
                          color: colors.secondaryText,
                          opacity: 1,
                        },
                      },
                      '&:hover': {
                        borderColor: colors.primary,
                        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#E8E8E8',
                      },
                      '&.Mui-focused': {
                        borderColor: colors.primary,
                        borderWidth: '2px',
                        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#E8E8E8',
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} className="py-2">
                  <ListItemAvatar>
                    {option.type === 'video' ? (
                      option.thumbnail ? (
                        <Avatar 
                          src={option.thumbnail} 
                          variant="rounded"
                          sx={{ width: 32, height: 24 }}
                        />
                      ) : (
                        <PlayIcon sx={{ color: '#666666' }} />
                      )
                    ) : (
                      <ChannelIcon sx={{ color: '#666666' }} />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                        {option.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                        {option.subtitle}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
              PaperComponent={(props) => (
                <Paper 
                  {...props} 
                  sx={{ 
                    backgroundColor: mode === 'dark' ? '#212121' : '#FFFFFF',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    marginTop: '8px',
                    boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    '& .MuiAutocomplete-listbox': {
                      padding: '8px 0',
                    },
                  }} 
                />
              )}
              sx={{ flex: 1 }}
            />
            <IconButton
              onClick={() => handleSearchSubmit(searchQuery)}
              sx={{ 
                backgroundColor: mode === 'dark' ? '#303030' : '#E0E0E0',
                border: `1px solid ${colors.border}`,
                borderLeft: 'none',
                borderRadius: '0 40px 40px 0',
                padding: '8px 20px',
                height: '40px',
                minWidth: '64px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#404040' : '#D0D0D0',
                  borderColor: colors.primary,
                },
              }}
            >
              <SearchIcon sx={{ color: colors.primaryText, fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Mobile search - Show search bar or icon based on state */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: '8px', flex: mobileSearchOpen ? 1 : 'none' }}>
          {mobileSearchOpen ? (
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px' }}>
              <TextField
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit(searchQuery);
                    setMobileSearchOpen(false);
                  }
                }}
                autoFocus
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#121212',
                    border: '1px solid #303030',
                    borderRadius: '20px',
                    height: '36px',
                    color: '#FFFFFF',
                    '& fieldset': {
                      border: 'none',
                    },
                    '& input': {
                      padding: '8px 12px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      '&::placeholder': {
                        color: '#909090',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              <IconButton
                onClick={() => {
                  handleSearchSubmit(searchQuery);
                  setMobileSearchOpen(false);
                }}
                sx={{
                  color: '#FFFFFF',
                  padding: '6px',
                  backgroundColor: '#303030',
                  '&:hover': {
                    backgroundColor: '#404040',
                  },
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchQuery('');
                }}
                sx={{
                  color: '#FFFFFF',
                  padding: '6px',
                  '&:hover': {
                    backgroundColor: '#272727',
                  },
                }}
              >
                ×
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={() => setMobileSearchOpen(true)}
              sx={{
                color: '#FFFFFF',
                padding: '8px',
                '&:hover': {
                  backgroundColor: '#272727',
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          )}
        </Box>

        {/* Right section - Actions */}
        <Box sx={{ 
          display: mobileSearchOpen ? { xs: 'none', md: 'flex' } : 'flex', 
          alignItems: 'center', 
          gap: '8px',
          minWidth: '170px',
          justifyContent: 'flex-end',
        }}>
          {/* Theme Toggle Button */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: colors.primaryText,
              padding: '8px',
              background: colors.activeGradient,
              border: `1px solid ${colors.border}`,
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: colors.buttonGradient,
                transform: 'rotate(180deg)',
                boxShadow: `0 4px 12px ${mode === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`,
              },
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {currentUser ? (
            <>
              <Link to="/upload" style={{ textDecoration: 'none' }}>
                <IconButton
                  sx={{
                    color: colors.primaryText,
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    },
                  }}
                >
                  <VideoCallIcon />
                </IconButton>
              </Link>
              
              <IconButton
                sx={{
                  color: colors.primaryText,
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  },
                }}
              >
                <NotificationsIcon />
              </IconButton>
              
              <IconButton 
                onClick={handleUserMenuClick}
                sx={{ padding: '4px', marginLeft: '8px' }}
              >
                <Avatar 
                  src={currentUser.avatar}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: '#FF0000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: mode === 'dark' ? '#282828' : '#FFFFFF',
                    color: colors.primaryText,
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: '200px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon sx={{ marginRight: '12px', color: '#AAAAAA' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Your channel
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                      {currentUser.name}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ backgroundColor: '#404040' }} />
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon sx={{ marginRight: '12px', color: '#AAAAAA' }} />
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => setAuthModalOpen(true)}
              startIcon={<PersonIcon />}
              sx={{
                color: '#065fd4',
                borderColor: '#065fd4',
                borderRadius: '18px',
                textTransform: 'none',
                padding: '6px 16px',
                fontWeight: 500,
                fontSize: '14px',
                '&:hover': {
                  borderColor: '#4285f4',
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                },
              }}
            >
              Sign in
            </Button>
          )}
        </Box>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      </Toolbar>
    </AppBar>
  );
};

export default Header;