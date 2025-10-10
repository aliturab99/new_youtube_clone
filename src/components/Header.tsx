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
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getSearchSuggestions, SearchSuggestion, getCurrentUser, initializeDemoUser, User } from '../utils/mockData';
import AuthModal from './AuthModal';

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
        backgroundColor: '#0F0F0F',
        boxShadow: 'none',
        borderBottom: '1px solid #303030',
        zIndex: 1400,
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
              color: '#FFFFFF',
              padding: '8px',
              marginRight: '8px',
              '&:hover': {
                backgroundColor: '#272727',
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
              <span style={{ color: '#FFFFFF' }}>Tube</span>
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
                      backgroundColor: '#121212',
                      border: '1px solid #303030',
                      borderRadius: '40px 0 0 40px',
                      padding: '0 16px',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      height: '40px',
                      transition: 'all 0.2s ease-in-out',
                      '& fieldset': {
                        border: 'none',
                      },
                      '& input': {
                        padding: '0',
                        color: '#FFFFFF',
                        '&::placeholder': {
                          color: '#909090',
                          opacity: 1,
                        },
                      },
                      '&:hover': {
                        borderColor: '#065fd4',
                        backgroundColor: '#1A1A1A',
                      },
                      '&.Mui-focused': {
                        borderColor: '#065fd4',
                        borderWidth: '2px',
                        backgroundColor: '#1A1A1A',
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
                    backgroundColor: '#212121',
                    border: '1px solid #404040',
                    borderRadius: '12px',
                    marginTop: '8px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
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
                backgroundColor: '#303030',
                border: '1px solid #303030',
                borderLeft: 'none',
                borderRadius: '0 40px 40px 0',
                padding: '8px 20px',
                height: '40px',
                minWidth: '64px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#404040',
                  borderColor: '#065fd4',
                },
              }}
            >
              <SearchIcon sx={{ color: '#FFFFFF', fontSize: '20px' }} />
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
          {currentUser ? (
            <>
              <Link to="/upload" style={{ textDecoration: 'none' }}>
                <IconButton
                  sx={{
                    color: '#FFFFFF',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#272727',
                    },
                  }}
                >
                  <VideoCallIcon />
                </IconButton>
              </Link>
              
              <IconButton
                sx={{
                  color: '#FFFFFF',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: '#272727',
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
                    backgroundColor: '#282828',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: '200px',
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