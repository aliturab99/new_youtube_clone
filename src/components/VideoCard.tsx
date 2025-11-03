import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Video } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video }) => {
  const { mode, colors } = useTheme();
  
  // Randomly assign badge types for visual variety
  const badges = ['NEW', 'LIVE', 'TRENDING', null];
  const randomBadge = badges[Math.floor(Math.random() * badges.length)];
  
  const getBadgeColor = (badge: string | null) => {
    if (badge === 'LIVE') return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    if (badge === 'NEW') return 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
    if (badge === 'TRENDING') return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          '& .video-thumbnail': {
            '& .play-overlay': {
              opacity: 1,
            },
            '& img': {
              transform: 'scale(1.1)',
            },
            '& .channel-info-overlay': {
              opacity: 1,
            },
          },
          '& .video-title': {
            color: '#FF1744',
          },
          '& .gradient-line': {
            opacity: 1,
          },
          '& .glow-effect': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Video Card Container */}
      <Box
        sx={{
          position: 'relative',
          background: colors.cardGradient,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
            borderColor: colors.primary,
          },
        }}
      >
        <Link
          to={`/watch/${video.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {/* Thumbnail Container */}
          <Box
            className="video-thumbnail"
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '200px', sm: '220px', md: '240px' },
              overflow: 'hidden',
              background: '#1c1c1c',
            }}
          >
            {/* Thumbnail Image */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)',
                opacity: 0.6,
              }}
            />

            {/* Play Button Overlay */}
            <Box
              className="play-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                background: 'rgba(10, 14, 39, 0.7)',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)',
                  transform: 'scale(0.9)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1)',
                  },
                }}
              >
                <PlayArrowIcon sx={{ color: '#FFFFFF', fontSize: '32px' }} />
              </Box>
            </Box>

            {/* Badge */}
            {randomBadge && (
              <Chip
                label={randomBadge}
                sx={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: getBadgeColor(randomBadge),
                  color: '#FFFFFF',
                  fontSize: '10px',
                  height: '24px',
                  fontWeight: 700,
                  zIndex: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  border: `1px solid ${getBadgeColor(randomBadge)}30`,
                }}
              />
            )}

            {/* Duration Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 2,
              }}
            >
              {video.duration}
            </Box>

            {/* Channel Info Overlay - Appears on Hover */}
            <Box
              className="channel-info-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '12px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  {video.channel.name.charAt(0).toUpperCase()}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {video.channel.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ViewIcon sx={{ fontSize: 11 }} />
                    {video.views}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Link>

        {/* Video Info Section */}
        <Box
          sx={{
            padding: '12px',
            background: mode === 'dark' 
              ? 'linear-gradient(to bottom, #0d1b2a 0%, #000000 100%)'
              : 'linear-gradient(to bottom, #F5F8FF 0%, #FFFFFF 100%)',
          }}
        >
          {/* Title */}
          <Link
            to={`/watch/${video.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              className="video-title"
              sx={{
                color: colors.primaryText,
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
                fontFamily: 'Poppins, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: colors.primary,
                },
              }}
            >
              {video.title}
            </Typography>
          </Link>

          {/* Channel Name */}
          <Link
            to={`/channel/${video.channel.name.replace(/\s+/g, '').toLowerCase()}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              sx={{
                color: colors.secondaryText,
                fontSize: '12px',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: colors.primaryText,
                },
              }}
            >
              {video.channel.name}
            </Typography>
          </Link>

          {/* Stats Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: colors.secondaryText,
            }}
          >
            <Typography sx={{ fontSize: '11px', color: colors.secondaryText }}>
              {video.uploadTime}
            </Typography>
            <Box
              sx={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#3b82f6',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                  },
                  '50%': {
                    opacity: 0.5,
                    boxShadow: '0 0 4px rgba(59, 130, 246, 0.3)',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Bottom Gradient Line */}
        <Box
          className="gradient-line"
          sx={{
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </Box>

      {/* Hover Glow Effect */}
      <Box
        className="glow-effect"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: -1,
          filter: 'blur(20px)',
        }}
      />
    </Box>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;