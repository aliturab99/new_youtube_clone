import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface UploadProgressProps {
  progress: number; // 0-100
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <Box sx={{ width: '100%', marginTop: '16px' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            marginRight: '12px',
          }}
        >
          Uploading...
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#AAAAAA',
            fontFamily: 'Roboto, sans-serif',
            marginLeft: 'auto',
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: '8px',
          borderRadius: '4px',
          backgroundColor: '#404040',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#FF0000',
            borderRadius: '4px',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      />
      
      <Typography
        variant="caption"
        sx={{
          color: '#AAAAAA',
          fontFamily: 'Roboto, sans-serif',
          marginTop: '4px',
          display: 'block',
        }}
      >
        {progress < 100 
          ? 'Please don\'t close this page while uploading...' 
          : 'Upload complete!'
        }
      </Typography>
    </Box>
  );
};

export default UploadProgress;