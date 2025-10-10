import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { id: string; name: string; email: string }) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onAuthSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!validateEmail(signInData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePassword(signInData.password)) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('youtube_users') || '[]');
      const user = users.find((u: any) => u.email === signInData.email && u.password === signInData.password);

      if (user) {
        // Store current user
        localStorage.setItem('youtube_current_user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
        }));

        onAuthSuccess({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        onClose();
        setSignInData({ email: '', password: '' });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!signUpData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!validateEmail(signUpData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePassword(signUpData.password)) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('youtube_users') || '[]');
      const existingUser = users.find((u: any) => u.email === signUpData.email);

      if (existingUser) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('youtube_users', JSON.stringify(users));

      // Store current user
      localStorage.setItem('youtube_current_user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }));

      onAuthSuccess({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });

      onClose();
      setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSignInData({ email: '', password: '' });
    setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          color: '#FFFFFF',
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 0 24px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
          }}
        >
          Welcome to YouTube
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: '#AAAAAA' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #303030', marginBottom: '24px' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: '#AAAAAA',
                fontFamily: 'Roboto, sans-serif',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px',
              },
              '& .Mui-selected': {
                color: '#FF0000 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF0000',
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: '16px',
              backgroundColor: '#2D1B1B',
              color: '#FF6B6B',
              '& .MuiAlert-icon': {
                color: '#FF6B6B',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Sign In Form */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleSignIn}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              required
              sx={{
                marginBottom: '16px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              required
              sx={{
                marginBottom: '24px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#CC0000',
                },
                '&:disabled': {
                  backgroundColor: '#666666',
                  color: '#AAAAAA',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </TabPanel>

        {/* Sign Up Form */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleSignUp}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              variant="outlined"
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
              required
              sx={{
                marginBottom: '16px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
              required
              sx={{
                marginBottom: '16px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
              required
              sx={{
                marginBottom: '16px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
              required
              sx={{
                marginBottom: '24px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2F2F2F',
                  '& fieldset': {
                    borderColor: '#404040',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF0000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#AAAAAA',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#CC0000',
                },
                '&:disabled': {
                  backgroundColor: '#666666',
                  color: '#AAAAAA',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </TabPanel>

        {/* Demo Users Info */}
        <Box sx={{ marginTop: '24px', padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '8px' }}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', marginBottom: '8px' }}>
            Demo Account (for testing):
          </Typography>
          <Typography variant="caption" sx={{ color: '#666666' }}>
            Email: demo@youtube.com<br />
            Password: demo123
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;