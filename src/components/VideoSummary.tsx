import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Button,
  Alert 
} from '@mui/material';
import { Refresh as RefreshIcon, AutoAwesome as AIIcon } from '@mui/icons-material';
import { getVideoSummary, VideoSummaryData } from '../utils/mockData';

interface VideoSummaryProps {
  videoId: string;
}

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
      id={`video-summary-tabpanel-${index}`}
      aria-labelledby={`video-summary-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const VideoSummary: React.FC<VideoSummaryProps> = ({ videoId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [summaryData, setSummaryData] = useState<VideoSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVideoSummary(videoId);
      setSummaryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRegenerate = () => {
    fetchSummary();
  };

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // Check if text is longer than 100 words
  const isLongText = summaryData ? summaryData.text.split(' ').length > 100 : false;
  const displayText = summaryData 
    ? showFullText 
      ? summaryData.text 
      : isLongText 
        ? summaryData.text.split(' ').slice(0, 100).join(' ') + '...'
        : summaryData.text
    : '';

  return (
    <Box
      className="bg-gray-100 rounded-lg mt-4"
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        marginTop: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Header with tabs and regenerate button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#e0e0e0',
          padding: '0 16px',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#666666',
              fontFamily: 'Roboto, sans-serif',
              textTransform: 'none',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#FF0000 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF0000',
            },
          }}
        >
          <Tab 
            icon={<AIIcon />} 
            label="Text Summary" 
            iconPosition="start"
            sx={{ minHeight: '48px' }}
          />
          <Tab 
            label="Video Highlights" 
            sx={{ minHeight: '48px' }}
          />
        </Tabs>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleRegenerate}
          disabled={loading}
          sx={{
            color: '#666666',
            borderColor: '#666666',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#FF0000',
              color: '#FF0000',
            },
          }}
        >
          Regenerate
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ padding: '16px' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#FF0000' }} />
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRegenerate}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && summaryData && (
          <>
            {/* Text Summary Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography
                sx={{
                  color: '#333333',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: isLongText ? '12px' : 0,
                }}
              >
                {displayText}
              </Typography>

              {isLongText && (
                <Button
                  onClick={toggleFullText}
                  sx={{
                    color: '#FF0000',
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {showFullText ? 'Show less' : 'Show more'}
                </Button>
              )}
            </TabPanel>

            {/* Video Highlights Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  backgroundColor: '#000000',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <video
                  src={summaryData.highlightUrl}
                  controls
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    display: 'block',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  marginTop: '8px',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                AI-generated video highlights showing key moments from this tutorial.
              </Typography>
            </TabPanel>
          </>
        )}

        {!loading && !error && !summaryData && (
          <Typography
            sx={{
              color: '#666666',
              fontSize: '14px',
              textAlign: 'center',
              py: 4,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            No summary available for this video.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VideoSummary;