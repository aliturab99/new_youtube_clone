import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
}

type QualityOption = 'auto' | '720p' | '480p' | '360p';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnail }) => {
  const [quality, setQuality] = useState<QualityOption>('auto');
  const [qualityMenuAnchor, setQualityMenuAnchor] = useState<null | HTMLElement>(null);

  const qualityOptions: QualityOption[] = ['auto', '720p', '480p', '360p'];

  const handleQualityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setQualityMenuAnchor(event.currentTarget);
  };

  const handleQualityMenuClose = () => {
    setQualityMenuAnchor(null);
  };

  const handleQualitySelect = (selectedQuality: QualityOption) => {
    setQuality(selectedQuality);
    handleQualityMenuClose();
  };

  return (
    <Box
      className="relative w-full bg-black rounded-lg overflow-hidden"
      sx={{
        aspectRatio: '16 / 9',
        backgroundColor: '#000000',
      }}
    >
      {/* HTML5 Video Player */}
      <video
        src={videoUrl}
        poster={thumbnail}
        controls
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Quality Selector Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
        }}
      >
        <IconButton
          onClick={handleQualityMenuOpen}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={qualityMenuAnchor}
          open={Boolean(qualityMenuAnchor)}
          onClose={handleQualityMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#272727',
              color: 'white',
            },
          }}
        >
          <MenuItem disabled>
            <Typography sx={{ fontWeight: 'bold' }}>Quality</Typography>
          </MenuItem>
          {qualityOptions.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleQualitySelect(option)}
              selected={quality === option}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#FF0000',
                },
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default VideoPlayer;