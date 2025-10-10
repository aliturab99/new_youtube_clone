import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Button,
  Divider,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  MoreHoriz as MoreHorizIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import VideoPlayer from '../components/VideoPlayer';
import RelatedVideos from '../components/RelatedVideos';
import VideoSummary from '../components/VideoSummary';
import CommentsSection from '../components/CommentsSection';
import { getVideoDetails, VideoDetails } from '../utils/mockData';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    if (id) {
      const videoData = getVideoDetails(id);
      setVideo(videoData);
      // Initialize like counts from video data
      if (videoData) {
        setLikeCount(parseInt(videoData.views.replace(/[^\d]/g, '')) / 100); // Mock calculation
        setDislikeCount(Math.floor(parseInt(videoData.views.replace(/[^\d]/g, '')) / 1000)); // Mock calculation
      }
    }
  }, [id]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    
    if (disliked) {
      setDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
    }
    
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
  };

  const handleDislike = () => {
    const newDisliked = !disliked;
    setDisliked(newDisliked);
    
    if (liked) {
      setLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    }
    
    setDislikeCount(prev => newDisliked ? prev + 1 : Math.max(0, prev - 1));
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  if (!video) {
    return (
      <Box sx={{ 
        padding: { xs: '16px', md: '24px' },
        backgroundColor: '#0F0F0F',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography sx={{ color: '#FFFFFF' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: { xs: '16px', md: '24px' },
      backgroundColor: '#0F0F0F',
      minHeight: '100vh',
    }}>
      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Left Column - Video Player and Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Video Player */}
          <Box sx={{ marginBottom: '16px' }}>
            <VideoPlayer 
              videoUrl={video.videoUrl} 
              thumbnail={video.thumbnailUrl}
            />
          </Box>

          {/* Video Title */}
          <Typography
            variant="h5"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '12px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: { xs: '18px', md: '20px' },
              lineHeight: 1.3,
            }}
          >
            {video.title}
          </Typography>

          {/* Video Stats and Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              marginBottom: '16px',
              gap: '16px',
            }}
          >
            {/* Views and Date */}
            <Typography
              sx={{
                color: '#AAAAAA',
                fontSize: '14px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {video.views} • {video.uploadTime}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconButton
                onClick={handleLike}
                sx={{
                  color: liked ? '#FF0000' : '#FFFFFF',
                  backgroundColor: '#272727',
                  '&:hover': { backgroundColor: '#404040' },
                  borderRadius: '20px',
                  padding: '8px 12px',
                }}
              >
                <ThumbUpIcon sx={{ fontSize: '20px', marginRight: '4px' }} />
                <Typography sx={{ fontSize: '14px' }}>{likeCount.toLocaleString()}</Typography>
              </IconButton>

              <IconButton
                onClick={handleDislike}
                sx={{
                  color: disliked ? '#FF0000' : '#FFFFFF',
                  backgroundColor: '#272727',
                  '&:hover': { backgroundColor: '#404040' },
                  borderRadius: '20px',
                  padding: '8px 12px',
                }}
              >
                <ThumbDownIcon sx={{ fontSize: '20px', marginRight: '4px' }} />
                <Typography sx={{ fontSize: '14px' }}>{dislikeCount > 0 ? dislikeCount.toLocaleString() : ''}</Typography>
              </IconButton>

              <IconButton
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: '#272727',
                  '&:hover': { backgroundColor: '#404040' },
                  borderRadius: '20px',
                  padding: '8px 12px',
                }}
              >
                <ShareIcon sx={{ fontSize: '20px', marginRight: '4px' }} />
                <Typography sx={{ fontSize: '14px' }}>Share</Typography>
              </IconButton>

              <IconButton
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: '#272727',
                  '&:hover': { backgroundColor: '#404040' },
                  borderRadius: '20px',
                  padding: '8px 12px',
                }}
              >
                <DownloadIcon sx={{ fontSize: '20px' }} />
              </IconButton>

              <IconButton
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: '#272727',
                  '&:hover': { backgroundColor: '#404040' },
                  borderRadius: '20px',
                  padding: '8px',
                }}
              >
                <MoreHorizIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: '#303030', marginBottom: '16px' }} />

          {/* Channel Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                src={video.channel.avatar}
                alt={video.channel.name}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {video.channel.name}
                </Typography>
                <Typography
                  sx={{
                    color: '#AAAAAA',
                    fontSize: '12px',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  1.2M subscribers
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubscribe}
              startIcon={subscribed ? <NotificationsIcon /> : undefined}
              sx={{
                backgroundColor: subscribed ? '#272727' : '#FF0000',
                color: '#FFFFFF',
                borderRadius: '20px',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: subscribed ? '#404040' : '#CC0000',
                },
              }}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </Box>

          {/* Description */}
          <Box
            sx={{
              backgroundColor: '#272727',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                lineHeight: 1.5,
                fontFamily: 'Roboto, sans-serif',
                whiteSpace: 'pre-line',
              }}
            >
              {showDescription 
                ? video.description 
                : video.description.length > 150 
                  ? `${video.description.substring(0, 150)}...`
                  : video.description
              }
            </Typography>
            {video.description.length > 150 && (
              <Typography
                onClick={() => setShowDescription(!showDescription)}
                sx={{
                  color: '#FF0000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '8px',
                  fontFamily: 'Roboto, sans-serif',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {showDescription ? 'Show less' : 'Show more'}
              </Typography>
            )}
          </Box>

          {/* Video Summary */}
          {id && <VideoSummary videoId={id} />}

          {/* Comments Section */}
          {id && <CommentsSection videoId={id} />}
        </Box>

        {/* Right Column - Related Videos */}
        <Box 
          sx={{ 
            width: { xs: '100%', lg: '400px' },
            flexShrink: 0,
          }}
        >
          <RelatedVideos videoId={video.id} />
        </Box>
      </Box>
    </Box>
  );
};

export default Watch;