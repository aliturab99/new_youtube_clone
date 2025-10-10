import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { getRelatedVideos, Video } from '../utils/mockData';

interface RelatedVideosProps {
  videoId: string;
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({ videoId }) => {
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const videos = getRelatedVideos(videoId, 8);
    setRelatedVideos(videos);
  }, [videoId]);

  return (
    <Paper
      sx={{
        backgroundColor: 'transparent',
        borderRadius: '8px',
        padding: '0',
        boxShadow: 'none',
        maxHeight: '80vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#272727',
          borderRadius: '3px',
        },
      }}
    >
      <Typography
        sx={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '16px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Related Videos
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {relatedVideos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: '#272727',
                  '& .video-title': {
                    color: '#AAAAAA',
                  },
                },
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  position: 'relative',
                  width: '168px',
                  minWidth: '168px',
                  height: '94px',
                  backgroundColor: '#272727',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                
                {/* Duration Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#FFFFFF',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    fontSize: '10px',
                    fontWeight: 500,
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {video.duration}
                </Box>
              </Box>

              {/* Video Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
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

                {/* Channel Name */}
                <Typography
                  sx={{
                    color: '#AAAAAA',
                    fontSize: '12px',
                    fontFamily: 'Roboto, sans-serif',
                    marginBottom: '2px',
                  }}
                >
                  {video.channel.name}
                </Typography>

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
          </Link>
        ))}
      </Box>
    </Paper>
  );
};

export default RelatedVideos;