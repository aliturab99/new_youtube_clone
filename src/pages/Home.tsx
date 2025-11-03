import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Grid, IconButton, Chip } from '@mui/material';
import VideoCard from '../components/VideoCard';
import { getMockVideos, Video } from '../utils/mockData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useTheme } from '../context/ThemeContext';
import { 
  PlayArrow as PlayIcon, 
  Visibility as ViewIcon, 
  Schedule as TimeIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Whatshot as WhatshotIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [discoverScrollPosition, setDiscoverScrollPosition] = useState(0);
  const [trendingScrollPosition, setTrendingScrollPosition] = useState(0);
  const { mode, colors } = useTheme();

  // Featured Video of the Day
  const featuredVideo = {
    id: 'featured-1',
    title: "WE DON'T TALK ANYMORE FEAT. SELENA GOMEZ",
    artist: 'Charlie Puth',
    description: 'Charlie Puth - We Don\'t Talk Anymore feat. Selena Gomez [Official Video]',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    views: '564M views',
    uploadDate: '12th July 2019',
    likes: '657K',
    comments: '754K',
    channel: 'Shawn Sharma',
    channelDate: '12th July 2019',
  };

  // Video of the Day Playlist
  const videoDayPlaylist = [
    {
      id: 'vod-1',
      title: 'We Got Talk',
      date: '12th July 2019',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    },
    {
      id: 'vod-2',
      title: "She Don't know",
      date: '15th Jan 2019',
      duration: '4:12',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80',
    },
    {
      id: 'vod-3',
      title: 'Mera Wala Sardar',
      date: '12th July 2019',
      duration: '3:28',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    },
    {
      id: 'vod-4',
      title: 'Slowly Slowly',
      date: '8th July 2019',
      duration: '3:55',
      thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&q=80',
    },
  ];

  const discoverVideos = [
    {
      id: 1,
      title: 'Shawn Mendes - Treat You Better',
      artist: 'Shawn Mendes',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
      views: '1,844,638 views',
      duration: '3:45',
      badge: 'NEW',
    },
    {
      id: 2,
      title: 'Ed Sheeran - Shape of You',
      artist: 'Ed Sheeran',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
      views: '687,298 views',
      duration: '4:24',
      badge: 'NEW',
    },
    {
      id: 3,
      title: 'Marshmello & Anne-Marie - Friends',
      artist: 'Marshmello',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
      views: '1,354,827,298 views',
      duration: '3:23',
      badge: 'LIVE',
    },
    {
      id: 4,
      title: 'The Chainsmokers & Coldplay - Something',
      artist: 'The Chainsmokers',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      views: '561,298 views',
      duration: '4:01',
      badge: 'NEW',
    },
    {
      id: 5,
      title: "The Chainsmokers - Don't Let Me Down",
      artist: 'The Chainsmokers',
      thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80',
      views: '685,298 views',
      duration: '3:55',
      badge: 'NEW',
    },
  ];

  const trendingVideos = [
    {
      id: 1,
      title: 'Shawn Mendes - Treat You Better',
      artist: 'Shawn Mendes',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
      views: '1,844,638 views',
      duration: '3:45',
      badge: 'NEW',
    },
    {
      id: 2,
      title: 'Ed Sheeran - Shape of You',
      artist: 'Ed Sheeran',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
      views: '687,298 views',
      duration: '4:24',
      badge: 'NEW',
    },
    {
      id: 3,
      title: 'Marshmello & Anne-Marie - Friends',
      artist: 'Marshmello',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
      views: '1,354,827,298 views',
      duration: '3:23',
      badge: 'LIVE',
    },
    {
      id: 4,
      title: 'The Chainsmokers & Coldplay - Something',
      artist: 'The Chainsmokers',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      views: '561,298 views',
      duration: '4:01',
      badge: 'NEW',
    },
    {
      id: 5,
      title: "The Chainsmokers - Don't Let Me Down",
      artist: 'The Chainsmokers',
      thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80',
      views: '685,298 views',
      duration: '3:55',
      badge: 'NEW',
    },
  ];

  // Initial video load
  useEffect(() => {
    const initialVideos = getMockVideos(40);
    setVideos(initialVideos);
    setInitialLoad(false);
  }, []);

  // Load more videos function for infinite scroll
  const loadMoreVideos = useCallback(async (): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVideos = getMockVideos(20);
    setVideos(prev => [...prev, ...newVideos]);
    
    // Stop loading more after 200 videos for demo
    return videos.length < 180;
  }, [videos.length]);

  // Use the infinite scroll hook
  const { isLoading, hasMore, error, lastElementRef } = useInfiniteScroll(
    loadMoreVideos,
    {
      threshold: 0.5,
      rootMargin: '200px',
      enabled: !initialLoad,
    }
  );



  const handleDiscoverScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('discover-scroll');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? discoverScrollPosition - scrollAmount 
        : discoverScrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setDiscoverScrollPosition(newPosition);
    }
  };

  const handleTrendingScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('trending-scroll');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? trendingScrollPosition - scrollAmount 
        : trendingScrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setTrendingScrollPosition(newPosition);
    }
  };

  if (initialLoad) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress sx={{ color: '#FF0000' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: colors.gradientBg,
      minHeight: '100vh',
      width: '100%',
      transition: 'background 0.3s ease',
    }}
    >
      {/* Smart Category Filters */}
      <Box
        sx={{
          top: '56px',
          zIndex: 1300,
          background: mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(10, 14, 39, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: { xs: '8px 16px', md: '10px 40px' },
          margin: 0,
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: '3px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          {[
            { id: 'all', label: '🏠 All', icon: '🏠', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
            { id: 'music', label: '🎵 Music', icon: '🎵', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
            { id: 'gaming', label: '🎮 Gaming', icon: '🎮', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
            { id: 'news', label: '📰 News', icon: '📰', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
            { id: 'sports', label: '⚽ Sports', icon: '⚽', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
            { id: 'education', label: '📚 Education', icon: '📚', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
            { id: 'entertainment', label: '🎬 Entertainment', icon: '🎬', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
            { id: 'tech', label: '💻 Tech', icon: '💻', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
            { id: 'cooking', label: '👨‍🍳 Cooking', icon: '👨‍🍳', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
            { id: 'travel', label: '✈️ Travel', icon: '✈️', gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
            { id: 'fashion', label: '👗 Fashion', icon: '👗', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
            { id: 'fitness', label: '💪 Fitness', icon: '💪', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
            { id: 'comedy', label: '😂 Comedy', icon: '😂', gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' },
            { id: 'live', label: '🔴 Live', icon: '🔴', gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
          ].map((category, index) => (
            <Chip
              key={category.id}
              label={category.label}
              onClick={() => {
                // Handle category selection
                console.log('Selected category:', category.id);
              }}
              sx={{
                background: index === 0 ? category.gradient : 'rgba(59, 130, 246, 0.1)',
                color: index === 0 ? '#FFFFFF' : colors.primaryText,
                fontSize: '13px',
                fontWeight: 600,
                height: '32px',
                padding: '0 14px',
                border: index === 0 ? 'none' : `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: index === 0 ? '0 4px 16px rgba(59, 130, 246, 0.4)' : 'none',
                '&:hover': {
                  background: category.gradient,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                  borderColor: 'transparent',
                },
                '& .MuiChip-label': {
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                },
                animation: index === 0 ? 'pulse 2s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                  },
                  '50%': {
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)',
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Featured Video of the Day */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '500px', md: '600px' },
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #0f172a 100%)',
          overflow: 'hidden',
          marginTop: 0,
          marginBottom: '40px',
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src={featuredVideo.thumbnail}
          alt={featuredVideo.title}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4,
            filter: 'blur(8px)',
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(240, 244, 255, 0.95) 50%, rgba(255, 255, 255, 0.95) 100%)',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: { xs: '20px', md: '60px' },
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, zIndex: 2 }}>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '12px', md: '14px' },
                fontWeight: 600,
                letterSpacing: '2px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <WhatshotIcon sx={{ fontSize: '18px' }} />
              VIDEO OF THE DAY 🎵
            </Typography>

            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '28px', md: '48px', lg: '56px' },
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '16px',
                textShadow: mode === 'dark' ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 20px rgba(0,0,0,0.1)',
                maxWidth: '600px',
              }}
            >
              {featuredVideo.title}
            </Typography>

            <Typography
              sx={{
                color: colors.secondaryText,
                fontSize: { xs: '14px', md: '16px' },
                marginBottom: '24px',
                maxWidth: '500px',
              }}
            >
              {featuredVideo.description}
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: '30px', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  {featuredVideo.channel[0]}
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryText, fontSize: '13px', fontWeight: 600 }}>
                    {featuredVideo.channel}
                  </Typography>
                  <Typography sx={{ color: colors.secondaryText, fontSize: '11px' }}>
                    {featuredVideo.channelDate}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <IconButton
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#FFFFFF',
                  padding: '12px 28px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 30px rgba(59, 130, 246, 0.6)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <PlayIcon sx={{ marginRight: '8px' }} />
                PLAY NOW
              </IconButton>

              <IconButton
                sx={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: colors.primaryText,
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: `1px solid ${colors.border}`,
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.3)',
                    borderColor: colors.primary,
                  },
                }}
              >
                <ThumbUpIcon sx={{ fontSize: '20px' }} />
              </IconButton>

              <IconButton
                sx={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: colors.primaryText,
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: `1px solid ${colors.border}`,
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.3)',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                  },
                }}
              >
                <CommentIcon sx={{ fontSize: '20px' }} />
              </IconButton>

              <IconButton
                sx={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: colors.primaryText,
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: `1px solid ${colors.border}`,
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.3)',
                    borderColor: colors.primary,
                  },
                }}
              >
                <FavoriteIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Right Sidebar - Playlist */}
          <Box
            sx={{
              width: { xs: '0', md: '280px', lg: '320px' },
              display: { xs: 'none', md: 'block' },
              background: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px',
              maxHeight: '500px',
              overflowY: 'auto',
              border: `1px solid ${colors.border}`,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '3px',
              },
            }}
          >
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '16px',
                letterSpacing: '1px',
              }}
            >
              Last 4 days
              <Typography component="span" sx={{ color: colors.secondaryText, ml: 1 }}>
                video of the day
              </Typography>
            </Typography>

            {videoDayPlaylist.map((video, index) => (
              <Box
                key={video.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  marginBottom: '16px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  },
                }}
              >
                {/* Thumbnail */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={video.thumbnail}
                    alt={video.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {video.duration}
                  </Box>
                  {index === 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#FF1744',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayIcon sx={{ color: '#FFFFFF', fontSize: '18px' }} />
                    </Box>
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: colors.primaryText,
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {video.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.secondaryText,
                      fontSize: '11px',
                    }}
                  >
                    {video.date}
                  </Typography>
                </Box>

                {/* Play Button */}
                <IconButton
                  sx={{
                    width: '32px',
                    height: '32px',
                    color: colors.secondaryText,
                    '&:hover': {
                      color: colors.primaryText,
                    },
                  }}
                >
                  <PlayIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Discover Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '20px', md: '24px' },
                fontWeight: 700,
              }}
            >
              🔍 DISCOVER
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => handleDiscoverScroll('left')}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDiscoverScroll('right')}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Discover Videos Scroll */}
        <Box
          id="discover-scroll"
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            paddingBottom: '20px',
          }}
        >
          {discoverVideos.map((video) => (
            <Box
              key={video.id}
              sx={{
                minWidth: { xs: '200px', md: '240px' },
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '280px', md: '320px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <Box
                  component="img"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Badge */}
                <Chip
                  label={video.badge}
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: video.badge === 'LIVE' ? '#FF1744' : '#00C853',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    height: '24px',
                    fontWeight: 700,
                  }}
                />

                {/* Duration */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  {video.duration}
                </Box>

                {/* Play Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: '#FF1744',
                      borderRadius: '50%',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayIcon sx={{ color: '#FFFFFF', fontSize: '32px' }} />
                  </Box>
                </Box>
              </Box>

              {/* Info */}
              <Typography
                sx={{
                  color: colors.primaryText,
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  color: colors.secondaryText,
                  fontSize: '12px',
                }}
              >
                {video.views}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Trending Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '20px', md: '24px' },
                fontWeight: 700,
              }}
            >
              🔥 TRENDING
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => handleTrendingScroll('left')}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => handleTrendingScroll('right')}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Trending Videos Scroll */}
        <Box
          id="trending-scroll"
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            paddingBottom: '20px',
          }}
        >
          {trendingVideos.map((video) => (
            <Box
              key={video.id}
              sx={{
                minWidth: { xs: '200px', md: '240px' },
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '280px', md: '320px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <Box
                  component="img"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Badge */}
                <Chip
                  label={video.badge}
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: video.badge === 'LIVE' ? '#FF1744' : '#00C853',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    height: '24px',
                    fontWeight: 700,
                  }}
                />

                {/* Duration */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  {video.duration}
                </Box>

                {/* Play Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: '#FF1744',
                      borderRadius: '50%',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayIcon sx={{ color: '#FFFFFF', fontSize: '32px' }} />
                  </Box>
                </Box>
              </Box>

              {/* Info */}
              <Typography
                sx={{
                  color: colors.primaryText,
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  color: colors.secondaryText,
                  fontSize: '12px',
                }}
              >
                {video.views}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Shorts Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '20px', md: '24px' },
                fontWeight: 700,
              }}
            >
              ⚡ SHORTS
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => {
                const container = document.getElementById('shorts-scroll');
                if (container) {
                  container.scrollBy({ left: -400, behavior: 'smooth' });
                }
              }}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                const container = document.getElementById('shorts-scroll');
                if (container) {
                  container.scrollBy({ left: 400, behavior: 'smooth' });
                }
              }}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Shorts Videos Scroll */}
        <Box
          id="shorts-scroll"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            paddingBottom: '20px',
          }}
        >
          {[
            {
              id: 1,
              title: 'Amazing Dance Performance 🔥',
              thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
              views: '2.5M views',
              channel: 'Dance Studio',
              channelAvatar: 'D',
            },
            {
              id: 2,
              title: 'Quick Cooking Tutorial',
              thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
              views: '1.8M views',
              channel: 'Chef Masters',
              channelAvatar: 'C',
            },
            {
              id: 3,
              title: 'Epic Travel Moment',
              thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
              views: '3.2M views',
              channel: 'Travel Vlog',
              channelAvatar: 'T',
            },
            {
              id: 4,
              title: 'Fitness Challenge 💪',
              thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
              views: '1.5M views',
              channel: 'Fit Life',
              channelAvatar: 'F',
            },
            {
              id: 5,
              title: 'Tech Tips & Tricks',
              thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
              views: '2.1M views',
              channel: 'Tech Guru',
              channelAvatar: 'T',
            },
            {
              id: 6,
              title: 'Fashion Styling Ideas',
              thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
              views: '1.9M views',
              channel: 'Style Icon',
              channelAvatar: 'S',
            },
            {
              id: 7,
              title: 'Comedy Sketch LOL 😂',
              thumbnail: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&q=80',
              views: '4.2M views',
              channel: 'Funny Zone',
              channelAvatar: 'F',
            },
            {
              id: 8,
              title: 'Music Cover Performance',
              thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
              views: '2.8M views',
              channel: 'Music Box',
              channelAvatar: 'M',
            },
          ].map((short) => (
            <Box
              key={short.id}
              sx={{
                minWidth: { xs: '160px', sm: '180px', md: '200px' },
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .shorts-play-button': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1)',
                  },
                },
              }}
            >
              {/* Vertical Video Card */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '280px', sm: '320px', md: '360px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                  },
                }}
              >
                {/* Thumbnail */}
                <Box
                  component="img"
                  src={short.thumbnail}
                  alt={short.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: mode === 'dark'
                      ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)'
                      : 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 50%)',
                  }}
                />

                {/* Shorts Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.5)',
                    zIndex: 2,
                  }}
                >
                  ⚡ SHORTS
                </Box>

                {/* Play Button Overlay */}
                <Box
                  className="shorts-play-button"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    zIndex: 2,
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)',
                    }}
                  >
                    <PlayIcon sx={{ color: '#FFFFFF', fontSize: '28px' }} />
                  </Box>
                </Box>

                {/* Channel Info at Bottom */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    zIndex: 2,
                  }}
                >
                  {/* Title */}
                  <Typography
                    sx={{
                      color: colors.primaryText,
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                    }}
                  >
                    {short.title}
                  </Typography>

                  {/* Channel and Views */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '6px' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {short.channelAvatar}
                    </Box>
                    <Typography
                      sx={{
                        color: colors.secondaryText,
                        fontSize: '11px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {short.channel}
                    </Typography>
                  </Box>

                  {/* Views */}
                  <Typography
                    sx={{
                      color: colors.secondaryText,
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ViewIcon sx={{ fontSize: 12 }} />
                    {short.views}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Live Now Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '20px', md: '24px' },
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  animation: 'blink 1.5s ease-in-out infinite',
                  boxShadow: '0 0 10px #ef4444, 0 0 20px #ef4444',
                  '@keyframes blink': {
                    '0%, 100%': {
                      opacity: 1,
                      boxShadow: '0 0 10px #ef4444, 0 0 20px #ef4444',
                    },
                    '50%': {
                      opacity: 0.3,
                      boxShadow: '0 0 5px #ef4444',
                    },
                  },
                }}
              />
              LIVE NOW
            </Typography>
            <Chip
              label="12,543 watching"
              size="small"
              sx={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => {
                const container = document.getElementById('live-scroll');
                if (container) {
                  container.scrollBy({ left: -400, behavior: 'smooth' });
                }
              }}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                const container = document.getElementById('live-scroll');
                if (container) {
                  container.scrollBy({ left: 400, behavior: 'smooth' });
                }
              }}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: colors.primaryText,
                border: `1px solid ${colors.border}`,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderColor: colors.primary,
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Live Streams Grid */}
        <Box
          id="live-scroll"
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            paddingBottom: '20px',
          }}
        >
          {[
            {
              id: 1,
              title: 'Epic Gaming Tournament - Finals Match!',
              thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
              streamer: 'ProGamer',
              avatar: 'P',
              viewers: '45.2K',
              category: 'Gaming',
            },
            {
              id: 2,
              title: 'Live Music Concert - Rock Band Performance',
              thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80',
              streamer: 'Rock Stars',
              avatar: 'R',
              viewers: '28.5K',
              category: 'Music',
            },
            {
              id: 3,
              title: 'Breaking News: Major Tech Announcement',
              thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80',
              streamer: 'News 24/7',
              avatar: 'N',
              viewers: '15.8K',
              category: 'News',
            },
            {
              id: 4,
              title: 'Cooking Masterclass - Italian Cuisine',
              thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80',
              streamer: 'Chef Marco',
              avatar: 'C',
              viewers: '12.3K',
              category: 'Cooking',
            },
            {
              id: 5,
              title: 'Fitness Challenge - 24 Hour Workout',
              thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
              streamer: 'Fit Pro',
              avatar: 'F',
              viewers: '9.7K',
              category: 'Fitness',
            },
            {
              id: 6,
              title: 'Travel Vlog - Exploring Japan Live',
              thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80',
              streamer: 'World Explorer',
              avatar: 'W',
              viewers: '18.4K',
              category: 'Travel',
            },
          ].map((stream) => (
            <Box
              key={stream.id}
              sx={{
                minWidth: { xs: '280px', md: '320px' },
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .live-play-overlay': {
                    opacity: 1,
                  },
                },
              }}
            >
              {/* Live Stream Card */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '180px', md: '200px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
                  boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  marginBottom: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: mode === 'dark' ? '0 8px 32px rgba(239, 68, 68, 0.4)' : '0 8px 32px rgba(239, 68, 68, 0.3)',
                    borderColor: 'rgba(239, 68, 68, 0.6)',
                  },
                }}
              >
                {/* Thumbnail */}
                <Box
                  component="img"
                  src={stream.thumbnail}
                  alt={stream.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                  }}
                />

                {/* LIVE Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#ef4444',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.6)',
                    zIndex: 2,
                    animation: 'pulse-live 2s ease-in-out infinite',
                    '@keyframes pulse-live': {
                      '0%, 100%': {
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.6)',
                      },
                      '50%': {
                        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.8)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      animation: 'blink-dot 1.5s ease-in-out infinite',
                      '@keyframes blink-dot': {
                        '0%, 100%': {
                          opacity: 1,
                        },
                        '50%': {
                          opacity: 0.3,
                        },
                      },
                    }}
                  />
                  LIVE
                </Box>

                {/* Viewers Count */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 2,
                  }}
                >
                  <ViewIcon sx={{ fontSize: 14 }} />
                  {stream.viewers}
                </Box>

                {/* Category Tag */}
                <Chip
                  label={stream.category}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(59, 130, 246, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    height: '24px',
                    fontWeight: 700,
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    zIndex: 2,
                  }}
                />

                {/* Play Overlay */}
                <Box
                  className="live-play-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(10, 14, 39, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 3,
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      borderRadius: '50%',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.6)',
                    }}
                  >
                    <PlayIcon sx={{ color: '#FFFFFF', fontSize: '32px' }} />
                  </Box>
                </Box>
              </Box>

              {/* Stream Info */}
              <Box>
                <Typography
                  sx={{
                    color: colors.primaryText,
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                  }}
                >
                  {stream.title}
                </Typography>

                {/* Streamer Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      border: '2px solid rgba(239, 68, 68, 0.3)',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    {stream.avatar}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: colors.primaryText,
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {stream.streamer}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          animation: 'blink 1.5s ease-in-out infinite',
                        }}
                      />
                      <Typography
                        sx={{
                          color: '#ef4444',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        Streaming now
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Trending Creator Spotlight Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Box>
            <Typography
              sx={{
                color: colors.primaryText,
                fontSize: { xs: '20px', md: '24px' },
                fontWeight: 700,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              ⭐ TRENDING CREATORS
            </Typography>
            <Typography
              sx={{
                color: colors.secondaryText,
                fontSize: '14px',
              }}
            >
              Follow your favorite content creators
            </Typography>
          </Box>
        </Box>

        {/* Creators Grid */}
        <Grid container spacing={3}>
          {[
            {
              id: 1,
              name: 'Tech Master',
              username: '@techmaster',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
              subscribers: '2.5M',
              videos: '1.2K',
              category: 'Technology',
              verified: true,
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            },
            {
              id: 2,
              name: 'Music Vibes',
              username: '@musicvibes',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
              subscribers: '3.8M',
              videos: '856',
              category: 'Music',
              verified: true,
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            },
            {
              id: 3,
              name: 'Gaming Pro',
              username: '@gamingpro',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80',
              subscribers: '5.2M',
              videos: '2.3K',
              category: 'Gaming',
              verified: true,
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            },
            {
              id: 4,
              name: 'Chef Sarah',
              username: '@chefsarah',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
              subscribers: '1.9M',
              videos: '645',
              category: 'Cooking',
              verified: true,
              gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            },
            {
              id: 5,
              name: 'Fitness King',
              username: '@fitnessking',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
              subscribers: '2.1M',
              videos: '892',
              category: 'Fitness',
              verified: true,
              gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            },
            {
              id: 6,
              name: 'Travel World',
              username: '@travelworld',
              avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
              banner: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
              subscribers: '4.3M',
              videos: '1.5K',
              category: 'Travel',
              verified: true,
              gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            },
          ].map((creator) => (
            <Grid key={creator.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  background: colors.cardGradient,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.3)' : '0 12px 40px rgba(59, 130, 246, 0.2)',
                    borderColor: colors.primary,
                    '& .creator-banner': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {/* Banner */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '120px',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    className="creator-banner"
                    component="img"
                    src={creator.banner}
                    alt={creator.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: creator.gradient,
                      opacity: 0.6,
                    }}
                  />
                  
                  {/* Category Badge */}
                  <Chip
                    label={creator.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      height: '24px',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </Box>

                {/* Creator Info */}
                <Box sx={{ padding: '20px 16px 16px', position: 'relative' }}>
                  {/* Avatar */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-40px',
                      left: '16px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: mode === 'dark' ? '4px solid #000000' : '4px solid #FFFFFF',
                      overflow: 'hidden',
                      boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Box
                      component="img"
                      src={creator.avatar}
                      alt={creator.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Follow Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <Box
                      sx={{
                        background: creator.gradient,
                        color: '#FFFFFF',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                        },
                      }}
                    >
                      + FOLLOW
                    </Box>
                  </Box>

                  {/* Name and Username */}
                  <Box sx={{ marginTop: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
                      <Typography
                        sx={{
                          color: colors.primaryText,
                          fontSize: '18px',
                          fontWeight: 700,
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      >
                        {creator.name}
                      </Typography>
                      {creator.verified && (
                        <Box
                          sx={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: creator.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                          }}
                        >
                          ✓
                        </Box>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        color: colors.secondaryText,
                        fontSize: '13px',
                        marginBottom: '16px',
                      }}
                    >
                      {creator.username}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      paddingTop: '16px',
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  >
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography
                        sx={{
                          color: colors.primaryText,
                          fontSize: '16px',
                          fontWeight: 700,
                          marginBottom: '4px',
                        }}
                      >
                        {creator.subscribers}
                      </Typography>
                      <Typography
                        sx={{
                          color: colors.secondaryText,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        SUBSCRIBERS
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '1px',
                        background: colors.border,
                      }}
                    />
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography
                        sx={{
                          color: colors.primaryText,
                          fontSize: '16px',
                          fontWeight: 700,
                          marginBottom: '4px',
                        }}
                      >
                        {creator.videos}
                      </Typography>
                      <Typography
                        sx={{
                          color: colors.secondaryText,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        VIDEOS
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Bottom Gradient Line */}
                <Box
                  sx={{
                    height: '3px',
                    background: creator.gradient,
                    opacity: 0.8,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* All Videos Section */}
      <Box sx={{ padding: { xs: '20px', md: '40px 60px' }, maxWidth: '1400px', margin: '0 auto' }}>
        {/* Page Title */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: colors.primaryText,
            fontWeight: 600,
            marginBottom: '24px',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          All Videos
        </Typography>

        {/* Video Grid */}
        <Grid container spacing={2}>
          {videos.map((video) => (
            <Grid 
              key={video.id} 
              size={{ 
                xs: 12, 
                sm: 6, 
                md: 4, 
                lg: 3,
                xl: 3,
              }}
            >
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
        
        {/* Load More Trigger */}
        {hasMore && (
          <Box
            ref={lastElementRef}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 20px',
              minHeight: '80px',
            }}
          >
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress 
                  size={24} 
                  sx={{ color: '#FF0000' }} 
                />
                <Typography
                  sx={{
                    color: '#AAAAAA',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  Loading more videos...
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {/* Error Message */}
        {error && (
          <Typography
            sx={{
              color: '#FF0000',
              fontSize: '14px',
              padding: '20px',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Error: {error}
          </Typography>
        )}

        {/* No More Content Message */}
        {!hasMore && videos.length > 0 && (
          <Typography
            sx={{
              color: '#AAAAAA',
              fontSize: '14px',
              padding: '40px 20px',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            🎉 You've reached the end! No more videos to load.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;