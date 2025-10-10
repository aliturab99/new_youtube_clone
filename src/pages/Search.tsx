import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert 
} from '@mui/material';
import { 
  PlayArrow as VideoIcon, 
  AccountCircle as ChannelIcon,
  Search as SearchAllIcon 
} from '@mui/icons-material';
import { searchVideos, Video } from '../utils/mockData';
import VideoCard from '../components/VideoCard';

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
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || searchParams.get('q') || '';
  const [tabValue, setTabValue] = useState(0);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchVideos(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query);
  }, [query]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter results based on selected tab
  const filteredResults = searchResults.filter(video => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return true; // Videos (all current results are videos)
    if (tabValue === 2) return false; // Channels (not implemented yet)
    return true;
  });

  const resultCount = filteredResults.length;
  const formattedCount = resultCount === 1 ? '1 result' : `${resultCount} results`;

  return (
    <Box sx={{ 
      padding: '24px', 
      minHeight: '100vh',
      backgroundColor: '#0F0F0F',
    }}>
      {/* Search Header */}
      {query && (
        <Box sx={{ marginBottom: '24px' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              marginBottom: '8px',
            }}
          >
            {loading ? 'Searching...' : `${formattedCount} for "${query}"`}
          </Typography>
        </Box>
      )}

      {/* Filter Tabs */}
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
              minHeight: '48px',
              padding: '12px 24px',
              '&:hover': {
                color: '#FFFFFF',
              },
            },
            '& .Mui-selected': {
              color: '#FFFFFF !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FFFFFF',
              height: '2px',
            },
          }}
        >
          <Tab 
            icon={<SearchAllIcon />} 
            label="All" 
            iconPosition="start"
          />
          <Tab 
            icon={<VideoIcon />} 
            label="Videos" 
            iconPosition="start"
          />
          <Tab 
            icon={<ChannelIcon />} 
            label="Channels" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px',
        }}>
          <CircularProgress sx={{ color: '#FF0000' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
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

      {/* No Results */}
      {!loading && !error && query && resultCount === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          padding: '48px 24px',
        }}>
          <Typography
            variant="h6"
            sx={{
              color: '#AAAAAA',
              fontFamily: 'Roboto, sans-serif',
              marginBottom: '8px',
            }}
          >
            No results found for "{query}"
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Try different keywords or check your spelling
          </Typography>
        </Box>
      )}

      {/* No Query */}
      {!query && (
        <Box sx={{ 
          textAlign: 'center', 
          padding: '48px 24px',
        }}>
          <Typography
            variant="h6"
            sx={{
              color: '#AAAAAA',
              fontFamily: 'Roboto, sans-serif',
              marginBottom: '8px',
            }}
          >
            Start searching for videos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Use the search bar above to find videos and channels
          </Typography>
        </Box>
      )}

      {/* Search Results */}
      {!loading && !error && filteredResults.length > 0 && (
        <Box>
          <TabPanel value={tabValue} index={0}>
            {/* All Results */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: '16px',
              }}
            >
              {filteredResults.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {/* Video Results */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: '16px',
              }}
            >
              {filteredResults.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {/* Channel Results - Placeholder */}
            <Box sx={{ 
              textAlign: 'center', 
              padding: '48px 24px',
            }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#AAAAAA',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Channel search coming soon
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      )}
    </Box>
  );
};

export default Search;