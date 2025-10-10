import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { getVideoComments, postComment, toggleCommentLike, Comment } from '../utils/mockData';

interface CommentsSectionProps {
  videoId: string;
}

interface CommentItemProps {
  comment: Comment;
  level: number;
  onReply: (parentId: string, text: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(comment.isDisliked || false);
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      const newIsDisliked = false;
      
      setIsLiked(newIsLiked);
      setIsDisliked(newIsDisliked);
      
      // Update counts optimistically
      if (newIsLiked) {
        setLikes(likes + (isDisliked ? 2 : 1)); // +2 if was disliked, +1 if neutral
        if (isDisliked) setDislikes(dislikes - 1);
      } else {
        setLikes(likes - 1);
      }
      
      // Mock API call
      await toggleCommentLike(comment.id, true);
    } catch (error) {
      // Revert on error
      setIsLiked(comment.isLiked || false);
      setIsDisliked(comment.isDisliked || false);
      setLikes(comment.likes);
      setDislikes(comment.dislikes);
    }
  };

  const handleDislike = async () => {
    try {
      const newIsDisliked = !isDisliked;
      const newIsLiked = false;
      
      setIsDisliked(newIsDisliked);
      setIsLiked(newIsLiked);
      
      // Update counts optimistically
      if (newIsDisliked) {
        setDislikes(dislikes + (isLiked ? 2 : 1));
        if (isLiked) setLikes(likes - 1);
      } else {
        setDislikes(dislikes - 1);
      }
      
      // Mock API call
      await toggleCommentLike(comment.id, false);
    } catch (error) {
      // Revert on error
      setIsLiked(comment.isLiked || false);
      setIsDisliked(comment.isDisliked || false);
      setLikes(comment.likes);
      setDislikes(comment.dislikes);
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ListItem
        sx={{
          alignItems: 'flex-start',
          paddingY: '12px',
          paddingLeft: level * 48 + 'px',
          backgroundColor: 'transparent',
        }}
      >
        <Avatar
          src={comment.userAvatar}
          sx={{
            width: 40,
            height: 40,
            marginRight: '12px',
            backgroundColor: '#FF0000',
          }}
        >
          {comment.userName.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {comment.userName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#AAAAAA',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {formatTimestamp(comment.timestamp)}
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: '#FFFFFF',
              marginBottom: '8px',
              lineHeight: 1.4,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {comment.text}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              size="small"
              onClick={handleLike}
              sx={{
                color: isLiked ? '#FF0000' : '#AAAAAA',
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ color: '#AAAAAA', minWidth: '20px' }}>
              {likes > 0 ? likes : ''}
            </Typography>
            
            <IconButton
              size="small"
              onClick={handleDislike}
              sx={{
                color: isDisliked ? '#FF0000' : '#AAAAAA',
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ThumbDownIcon fontSize="small" />
            </IconButton>
            
            {level < 2 && ( // Limit nesting to 2 levels
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setShowReplyBox(!showReplyBox)}
                sx={{
                  color: '#AAAAAA',
                  textTransform: 'none',
                  fontSize: '12px',
                  padding: '4px 8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Reply
              </Button>
            )}
          </Box>
          
          {showReplyBox && (
            <Box sx={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 24, height: 24, backgroundColor: '#FF0000' }}>
                U
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  multiline
                  rows={2}
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: '100%',
                    marginBottom: '8px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#303030',
                      },
                      '&:hover fieldset': {
                        borderColor: '#404040',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF0000',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                      fontSize: '14px',
                      '&::placeholder': {
                        color: '#AAAAAA',
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText('');
                    }}
                    sx={{
                      color: '#AAAAAA',
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    sx={{
                      backgroundColor: '#FF0000',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#CC0000',
                      },
                      '&:disabled': {
                        backgroundColor: '#666666',
                        color: '#AAAAAA',
                      },
                    }}
                  >
                    Reply
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </ListItem>
      
      {/* Render replies recursively */}
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          level={level + 1}
          onReply={onReply}
        />
      ))}
    </Box>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedComments = await getVideoComments(videoId);
      setComments(fetchedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      const postedComment = await postComment(videoId, newComment);
      setComments(prev => [postedComment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    try {
      const reply = await postComment(videoId, text, parentId);
      
      // Add reply to the parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        // Check nested replies
        const updatedReplies = comment.replies.map(nestedComment =>
          nestedComment.id === parentId
            ? { ...nestedComment, replies: [...nestedComment.replies, reply] }
            : nestedComment
        );
        return { ...comment, replies: updatedReplies };
      }));
    } catch (err) {
      setError('Failed to post reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <CircularProgress sx={{ color: '#FF0000' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          backgroundColor: '#2D1B1B',
          color: '#FF6B6B',
          '& .MuiAlert-icon': {
            color: '#FF6B6B',
          },
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#0F0F0F',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '16px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#FFFFFF',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          marginBottom: '16px',
        }}
      >
        {comments.length} Comments
      </Typography>

      {/* New comment input */}
      <Box sx={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Avatar sx={{ width: 40, height: 40, backgroundColor: '#FF0000' }}>
          U
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <TextField
            multiline
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            sx={{
              width: '100%',
              marginBottom: '12px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#303030',
                },
                '&:hover fieldset': {
                  borderColor: '#404040',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF0000',
                },
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
                fontSize: '14px',
                '&::placeholder': {
                  color: '#AAAAAA',
                  opacity: 1,
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              onClick={() => setNewComment('')}
              disabled={posting || !newComment.trim()}
              sx={{
                color: '#AAAAAA',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostComment}
              disabled={posting || !newComment.trim()}
              sx={{
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#CC0000',
                },
                '&:disabled': {
                  backgroundColor: '#666666',
                  color: '#AAAAAA',
                },
              }}
            >
              {posting ? 'Posting...' : 'Comment'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: '#303030', marginBottom: '16px' }} />

      {/* Comments list */}
      <List sx={{ padding: 0 }}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            level={0}
            onReply={handleReply}
          />
        ))}
      </List>

      {comments.length === 0 && (
        <Box sx={{ textAlign: 'center', padding: '32px' }}>
          <Typography
            variant="body1"
            sx={{
              color: '#AAAAAA',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            No comments yet. Be the first to comment!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection;