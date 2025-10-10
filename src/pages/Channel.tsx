import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';

const Channel: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();

  return (
    <Box sx={{ 
      padding: { xs: '16px', md: '24px' },
      backgroundColor: '#0F0F0F',
      minHeight: '100vh',
    }}>
      {/* Channel Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '32px',
        gap: '16px',
      }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            fontSize: '32px',
            fontWeight: 'bold',
            backgroundColor: '#FF0000',
          }}
        >
          {channelName?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '8px',
              fontFamily: 'Roboto, sans-serif',
              textTransform: 'capitalize',
            }}
          >
            {channelName?.replace(/([a-z])([A-Z])/g, '$1 $2')}
          </Typography>
          
          <Typography
            sx={{
              color: '#AAAAAA',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            1.2M subscribers • 500 videos
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          color: '#AAAAAA',
          fontSize: '16px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Channel page for: {channelName}
      </Typography>
    </Box>
  );
};

export default Channel;