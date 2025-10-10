import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Video } from '../utils/mockData';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          '& .video-thumbnail': {
            '& .play-overlay': {
              opacity: 1,
            },
          },
          '& .video-title': {
            color: '#AAAAAA',
          },
        },
      }}
    >
      <Link
        to={`/watch/${video.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {/* Video Thumbnail */}
        <Box
          className="video-thumbnail"
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: '#272727',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '12px',
            transition: 'border-radius 0.2s ease',
            '&:hover': {
              borderRadius: '0px',
            },
          }}
        >
          {/* Thumbnail Image */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          
          {/* Play Icon Overlay */}
          <Box
            className="play-overlay"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayArrowIcon
              sx={{
                color: '#FFFFFF',
                fontSize: '32px',
              }}
            />
          </Box>
          
          {/* Duration Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#FFFFFF',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {video.duration}
          </Box>
        </Box>
      </Link>

      {/* Video Info */}
      <Box sx={{ display: 'flex', gap: '12px' }}>
        {/* Channel Avatar */}
        <Link
          to={`/channel/${video.channel.name.replace(/\s+/g, '').toLowerCase()}`}
          style={{ textDecoration: 'none' }}
        >
          <Avatar
            src={video.channel.avatar}
            alt={video.channel.name}
            sx={{
              width: 36,
              height: 36,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {video.channel.name.charAt(0).toUpperCase()}
          </Avatar>
        </Link>

        {/* Video Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Video Title */}
          <Link
            to={`/watch/${video.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              className="video-title"
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.3,
                marginBottom: '4px',
                fontFamily: 'Roboto, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.2s ease',
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
                color: '#AAAAAA',
                fontSize: '12px',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
                '&:hover': {
                  color: '#FFFFFF',
                },
                transition: 'color 0.2s ease',
              }}
            >
              {video.channel.name}
            </Typography>
          </Link>

          {/* Views and Upload Time */}
          <Typography
            sx={{
              color: '#AAAAAA',
              fontSize: '12px',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {video.views} • {video.uploadTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;