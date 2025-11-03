import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Theme Context
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';

// Lazy-loaded Pages
const Home = React.lazy(() => import('./pages/Home'));
const Watch = React.lazy(() => import('./pages/Watch'));
const Search = React.lazy(() => import('./pages/Search'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Upload = React.lazy(() => import('./pages/Upload'));
const Channel = React.lazy(() => import('./pages/Channel'));

// Loading Component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
    }}
  >
    <CircularProgress sx={{ color: '#FF0000' }} size={40} />
  </Box>
);

// Create MUI theme with dark colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF0000',
    },
    background: {
      default: '#0F0F0F',
      paper: '#181818',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#272727 #0F0F0F',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0F0F0F',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#272727',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Changed to 1024px for better responsive behavior
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box className="flex flex-col h-screen" sx={{ background: colors.gradientBg }}>
      <Header onMenuClick={handleMenuClick} />
      
      <Box className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose}
          isMobile={isMobile}
        />
        
        <Box 
          component="main" 
          sx={{
            transition: 'margin-left 0.2s ease-in-out',
            backgroundColor: colors.primaryBg,
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="watch/:id" element={<Watch />} />
                <Route path="search" element={<Search />} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="upload" element={<Upload />} />
                <Route path="channel/:channelName" element={<Channel />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
