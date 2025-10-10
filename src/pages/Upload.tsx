import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  VideoFile as VideoIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import UploadProgress from '../components/UploadProgress';

interface VideoFile {
  file: File;
  preview: string;
}

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<VideoFile | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      const videoFile: VideoFile = {
        file,
        preview: URL.createObjectURL(file),
      };
      setSelectedFile(videoFile);
      setError(null);
      
      // Auto-generate title from filename
      if (!title) {
        const filename = file.name.replace(/\.[^/.]+$/, '');
        setTitle(filename.replace(/[_-]/g, ' '));
      }
    } else {
      setError('Please select a valid video file');
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
      setSelectedFile(null);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 10) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const simulateUpload = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadProgress(100);
            setTimeout(resolve, 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError('Please select a video file and provide a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      await simulateUpload();

      // Mock API call
      const formData = new FormData();
      formData.append('video', selectedFile.file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      console.log('Upload successful:', {
        title,
        description,
        tags,
        fileSize: selectedFile.file.size,
        fileType: selectedFile.file.type,
      });

      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setTags([]);
        setUploadProgress(0);
      }, 2000);

    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ 
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#0F0F0F',
    }}>
      <Typography
        variant="h4"
        sx={{
          color: '#FFFFFF',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        Upload Video
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: '#AAAAAA',
          fontFamily: 'Roboto, sans-serif',
          marginBottom: '32px',
        }}
      >
        Share your video with the world
      </Typography>

      {/* File Upload Area */}
      {!selectedFile && (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #404040',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '24px',
            backgroundColor: isDragActive ? '#1A1A1A' : '#121212',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: '#FF0000',
              backgroundColor: '#1A1A1A',
            },
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 48, color: '#666666', marginBottom: '16px' }} />
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontFamily: 'Roboto, sans-serif',
              marginBottom: '8px',
            }}
          >
            {isDragActive ? 'Drop your video here' : 'Drag and drop video files to upload'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#AAAAAA',
              fontFamily: 'Roboto, sans-serif',
              marginBottom: '16px',
            }}
          >
            Or click to select files
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#666666',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Supported formats: MP4, AVI, MOV, WMV, FLV, WebM
          </Typography>
        </Box>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <Card sx={{ 
          marginBottom: '24px',
          backgroundColor: '#181818',
          border: '1px solid #303030',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <VideoIcon sx={{ color: '#FF0000', marginRight: '12px' }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFFFFF',
                    fontFamily: 'Roboto, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {selectedFile.file.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#AAAAAA',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {(selectedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
              <Button
                onClick={removeFile}
                startIcon={<DeleteIcon />}
                sx={{ color: '#FF6B6B' }}
              >
                Remove
              </Button>
            </Box>
            
            {/* Video Preview */}
            <CardMedia
              component="video"
              controls
              src={selectedFile.preview}
              sx={{
                width: '100%',
                maxHeight: '300px',
                backgroundColor: '#000000',
                borderRadius: '8px',
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploading && (
        <UploadProgress progress={uploadProgress} />
      )}

      {/* Form Fields */}
      {selectedFile && !uploading && (
        <Box component="form" sx={{ marginBottom: '24px' }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#181818',
                '& fieldset': {
                  borderColor: '#404040',
                },
                '&:hover fieldset': {
                  borderColor: '#FF0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF0000',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#AAAAAA',
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#181818',
                '& fieldset': {
                  borderColor: '#404040',
                },
                '&:hover fieldset': {
                  borderColor: '#FF0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF0000',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#AAAAAA',
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
              },
            }}
          />

          <TextField
            fullWidth
            label="Add tags (press Enter)"
            variant="outlined"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            helperText={`${tags.length}/10 tags`}
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#181818',
                '& fieldset': {
                  borderColor: '#404040',
                },
                '&:hover fieldset': {
                  borderColor: '#FF0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF0000',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#AAAAAA',
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
              },
              '& .MuiFormHelperText-root': {
                color: '#AAAAAA',
              },
            }}
          />

          {/* Tags Display */}
          {tags.length > 0 && (
            <Box sx={{ marginBottom: '24px' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#AAAAAA',
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: '8px',
                }}
              >
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      backgroundColor: '#FF0000',
                      color: '#FFFFFF',
                      '& .MuiChip-deleteIcon': {
                        color: '#FFFFFF',
                        '&:hover': {
                          color: '#FFCCCC',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpload}
            disabled={!title.trim() || uploading}
            startIcon={<UploadIcon />}
            sx={{
              backgroundColor: '#FF0000',
              color: '#FFFFFF',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#CC0000',
              },
              '&:disabled': {
                backgroundColor: '#666666',
                color: '#AAAAAA',
              },
            }}
          >
            Upload Video
          </Button>
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          sx={{
            backgroundColor: '#2E7D32',
            color: '#FFFFFF',
          }}
        >
          Video uploaded successfully! 🎉
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Upload;