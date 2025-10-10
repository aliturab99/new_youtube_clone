import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import VideoCard from '../components/VideoCard';
import { getMockVideos, Video } from '../utils/mockData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

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
      padding: { xs: '16px', md: '24px' },
      backgroundColor: '#0F0F0F',
      minHeight: '100vh',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      {/* Page Title */}
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#FFFFFF',
          fontWeight: 600,
          marginBottom: '24px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Home
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
  );
};

export default Home;