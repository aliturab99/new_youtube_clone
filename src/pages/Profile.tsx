import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Avatar, 
  Tabs, 
  Tab, 
  Button,
  CircularProgress,
  Alert 
} from '@mui/material';
import { 
  Subscriptions as SubscribeIcon,
  VideoLibrary as VideosIcon,
  Info as AboutIcon 
} from '@mui/icons-material';
import { getUserProfile, getUserVideos, User, Video } from '../utils/mockData';
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const fetchUserData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const userData = await getUserProfile(id);
      if (userData) {
        setUser(userData);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVideos = async () => {
    if (!id) return;

    setVideosLoading(true);
    try {
      const videos = await getUserVideos(id);
      setUserVideos(videos);
    } catch (err) {
      console.error('Failed to load user videos:', err);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (user && tabValue === 0) {
      fetchUserVideos();
    }
  }, [user, tabValue, id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
      }}>
        <CircularProgress sx={{ color: '#FF0000' }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ padding: '24px' }}>
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
          {error || 'User not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0F0F0F',
    }}>
      {/* Banner Image */}
      <Box
        sx={{
          height: '200px',
          backgroundImage: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      />

      {/* Profile Header */}
      <Box sx={{ padding: '0 24px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '24px',
            marginTop: '-60px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid #0F0F0F',
              backgroundColor: '#FF0000',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Typography
              variant="h4"
              sx={{
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#AAAAAA',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '4px',
              }}
            >
              {user.subscriberCount} • {user.videosCount} videos
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#AAAAAA',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '16px',
                maxWidth: '600px',
                lineHeight: 1.4,
              }}
            >
              {user.bio}
            </Typography>

            <Button
              variant={subscribed ? 'outlined' : 'contained'}
              onClick={handleSubscribe}
              startIcon={<SubscribeIcon />}
              sx={{
                backgroundColor: subscribed ? 'transparent' : '#FF0000',
                color: subscribed ? '#FFFFFF' : '#FFFFFF',
                borderColor: subscribed ? '#FFFFFF' : 'transparent',
                borderRadius: '18px',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500,
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: subscribed ? 'rgba(255, 255, 255, 0.1)' : '#CC0000',
                },
              }}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </Box>
        </Box>

        {/* Navigation Tabs */}
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
              icon={<VideosIcon />} 
              label="Videos" 
              iconPosition="start"
            />
            <Tab 
              icon={<AboutIcon />} 
              label="About" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {/* Videos Tab */}
          {videosLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '200px',
            }}>
              <CircularProgress sx={{ color: '#FF0000' }} />
            </Box>
          ) : userVideos.length > 0 ? (
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
                paddingBottom: '24px',
              }}
            >
              {userVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </Box>
          ) : (
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
                No videos uploaded yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666666',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                This channel hasn't uploaded any videos
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* About Tab */}
          <Box sx={{ maxWidth: '800px', paddingBottom: '24px' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              About {user.name}
            </Typography>

            <Box sx={{ marginBottom: '24px' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {user.bio}
              </Typography>
            </Box>

            <Box sx={{ 
              backgroundColor: '#1A1A1A', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px',
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#AAAAAA',
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: '8px',
                }}
              >
                Channel Stats
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: '4px',
                }}
              >
                Subscribers: {user.subscriberCount}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: '4px',
                }}
              >
                Videos: {user.videosCount}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Profile;