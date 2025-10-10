import { v4 as uuidv4 } from 'uuid';

export interface Video {
  id: string;
  title: string;
  channel: {
    name: string;
    avatar: string;
  };
  views: string;
  duration: string;
  thumbnailUrl: string;
  uploadTime: string;
}

// Sample video titles for va// Get video summary with AI-generated content
export const getVideoSummary = async (videoId: string): Promise<VideoSummaryData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 10% error rate
  if (Math.random() < 0.1) {
    throw new Error('Failed to generate AI summary. Please try again.');
  }
  
  // Get a random summary from our collection
  const randomSummary = aiSummaries[Math.floor(Math.random() * aiSummaries.length)];
  const randomHighlight = highlightVideoUrls[Math.floor(Math.random() * highlightVideoUrls.length)];
  
  return {
    text: randomSummary,
    highlightUrl: randomHighlight,
  };
};

// Search interface for suggestions and results
export interface SearchSuggestion {
  id: string;
  type: 'video' | 'channel';
  title: string;
  subtitle?: string;
  thumbnail?: string;
}

// Search videos by query with case-insensitive matching
export const searchVideos = async (query: string): Promise<Video[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!query.trim()) {
    return [];
  }
  
  const allVideos = getMockVideos(50); // Get larger pool for search
  const searchQuery = query.toLowerCase().trim();
  
  const filteredVideos = allVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery) ||
    video.channel.name.toLowerCase().includes(searchQuery)
  );
  
  // Return up to 10 results, sorted by relevance (title matches first)
  return filteredVideos
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchQuery) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(searchQuery) ? 0 : 1;
      return aTitle - bTitle;
    })
    .slice(0, 10);
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim() || query.length < 2) {
    return [];
  }
  
  const allVideos = getMockVideos(30);
  const searchQuery = query.toLowerCase().trim();
  const suggestions: SearchSuggestion[] = [];
  
  // Add video suggestions
  const videoMatches = allVideos
    .filter(video => video.title.toLowerCase().includes(searchQuery))
    .slice(0, 5)
    .map(video => ({
      id: video.id,
      type: 'video' as const,
      title: video.title,
      subtitle: video.channel.name,
      thumbnail: video.thumbnailUrl,
    }));
  
  suggestions.push(...videoMatches);
  
  // Add channel suggestions
  const uniqueChannels = Array.from(
    new Set(allVideos
      .filter(video => video.channel.name.toLowerCase().includes(searchQuery))
      .map(video => video.channel.name)
    )
  ).slice(0, 3);
  
  const channelSuggestions = uniqueChannels.map(channelName => {
    const channelVideo = allVideos.find(v => v.channel.name === channelName);
    return {
      id: `channel-${channelName.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'channel' as const,
      title: channelName,
      subtitle: 'Channel',
      thumbnail: channelVideo?.channel.avatar,
    };
  });
  
  suggestions.push(...channelSuggestions);
  
  return suggestions.slice(0, 8); // Limit to 8 total suggestions
};

// Comments interfaces and functions
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
  replies: Comment[];
  isLiked?: boolean;
  isDisliked?: boolean;
}

// Sample comments data
const sampleComments = [
  "Great tutorial! This really helped me understand the concepts better.",
  "Thanks for the clear explanation. Could you make a follow-up video?",
  "This is exactly what I was looking for. Subscribed!",
  "Amazing content as always. Keep up the good work!",
  "I have a question about the implementation in minute 5:30",
  "Perfect timing! I was just working on a similar project.",
  "The examples you showed were very practical and useful.",
  "Could you please create a video about advanced topics next?",
  "This solved my problem instantly. Thank you so much!",
  "Very well explained. Easy to follow along."
];

// Get video comments with mock data
export const getVideoComments = async (videoId: string): Promise<Comment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const commentCount = 5 + Math.floor(Math.random() * 10); // 5-15 comments
  const comments: Comment[] = [];
  
  for (let i = 0; i < commentCount; i++) {
    const userId = `user-${Math.floor(Math.random() * 1000)}`;
    const comment: Comment = {
      id: `comment-${videoId}-${i}`,
      userId,
      userName: `User${Math.floor(Math.random() * 1000)}`,
      userAvatar: `https://picsum.photos/seed/${userId}/40/40`,
      text: sampleComments[Math.floor(Math.random() * sampleComments.length)],
      likes: Math.floor(Math.random() * 100),
      dislikes: Math.floor(Math.random() * 10),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      replies: [],
    };
    
    // Add some replies to random comments
    if (Math.random() < 0.3) { // 30% chance of having replies
      const replyCount = 1 + Math.floor(Math.random() * 3); // 1-3 replies
      for (let j = 0; j < replyCount; j++) {
        const replyUserId = `user-${Math.floor(Math.random() * 1000)}`;
        comment.replies.push({
          id: `reply-${comment.id}-${j}`,
          userId: replyUserId,
          userName: `User${Math.floor(Math.random() * 1000)}`,
          userAvatar: `https://picsum.photos/seed/${replyUserId}/40/40`,
          text: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          likes: Math.floor(Math.random() * 20),
          dislikes: Math.floor(Math.random() * 5),
          timestamp: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
          replies: [],
        });
      }
    }
    
    comments.push(comment);
  }
  
  // Sort by likes (most popular first)
  return comments.sort((a, b) => b.likes - a.likes);
};

// Post new comment (mock)
export const postComment = async (videoId: string, text: string, parentId?: string): Promise<Comment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentUser = getCurrentUser();
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    userId: currentUser?.id || 'anonymous',
    userName: currentUser?.name || 'Anonymous User',
    userAvatar: currentUser?.avatar || `https://picsum.photos/seed/anonymous/40/40`,
    text,
    likes: 0,
    dislikes: 0,
    timestamp: new Date().toISOString(),
    replies: [],
  };
  
  return newComment;
};

// Like/unlike comment (mock)
export const toggleCommentLike = async (commentId: string, isLike: boolean): Promise<{ likes: number; dislikes: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock response - in real app this would update the database
  const likes = Math.floor(Math.random() * 100);
  const dislikes = Math.floor(Math.random() * 10);
  
  return { likes, dislikes };
};

// User management functions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  subscriberCount?: string;
  videosCount?: number;
  createdAt: string;
}

// Initialize demo user in localStorage if not exists
export const initializeDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('youtube_users') || '[]');
  const demoUserExists = users.find((u: any) => u.email === 'demo@youtube.com');
  
  if (!demoUserExists) {
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@youtube.com',
      password: 'demo123',
      avatar: 'https://picsum.photos/seed/demo-user/100/100',
      bio: 'Welcome to the YouTube clone demo! This is a sample user account for testing purposes.',
      subscriberCount: '1.2K subscribers',
      videosCount: 8,
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    
    users.push(demoUser);
    localStorage.setItem('youtube_users', JSON.stringify(users));
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('youtube_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get user profile data
export const getUserProfile = async (userId: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('youtube_users') || '[]');
  const user = users.find((u: any) => u.id === userId);
  
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || `https://picsum.photos/seed/${user.id}/100/100`,
      bio: user.bio || 'No bio available',
      subscriberCount: user.subscriberCount || '0 subscribers',
      videosCount: user.videosCount || 0,
      createdAt: user.createdAt,
    };
  }
  
  return null;
};

// Get videos uploaded by a user
export const getUserVideos = async (userId: string): Promise<Video[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For demo purposes, return some videos as if uploaded by the user
  const allVideos = getMockVideos(20);
  const userVideos = allVideos.slice(0, Math.floor(Math.random() * 8) + 3); // Random 3-10 videos
  
  return userVideos;
};

// Sample video titles for variety
const videoTitles = [
  "React Hooks Tutorial - Complete Guide",
  "JavaScript ES6 Features You Must Know",
  "Building Modern Web Apps with TypeScript",
  "CSS Grid vs Flexbox - When to Use What?",
  "Node.js Best Practices for Beginners",
  "Python Machine Learning Crash Course",
  "Docker for Developers - Complete Tutorial",
  "Git and GitHub Masterclass",
  "MongoDB Database Design Patterns",
  "Next.js 14 - What's New and Amazing",
  "Vue.js 3 Composition API Deep Dive",
  "AWS Cloud Architecture Fundamentals",
  "Tailwind CSS Tips and Tricks",
  "Redux Toolkit - State Management Made Easy",
  "Express.js REST API Development",
  "Angular 17 - New Features Overview",
  "GraphQL with Apollo Client Tutorial",
  "PostgreSQL Advanced Queries",
  "Kubernetes for Beginners",
  "React Native Mobile App Development",
  "Web Performance Optimization Techniques",
  "DevOps Pipeline with CI/CD",
  "Microservices Architecture Explained",
  "Socket.io Real-time Applications",
  "Electron Desktop App Development",
  "WebAssembly - Future of Web Performance",
  "Svelte vs React - Performance Comparison",
  "Firebase Authentication Tutorial",
  "Stripe Payment Integration Guide",
  "Three.js 3D Web Development",
];

// Sample channel names
const channelNames = [
  "Code Academy Pro",
  "Dev Masters",
  "Tech Tutorials",
  "Programming Hub",
  "Web Dev Simplified",
  "JavaScript Mastery",
  "React Expert",
  "Full Stack Journey",
  "Code with Mosh",
  "The Net Ninja",
  "Traversy Media",
  "Academind",
  "FreeCodeCamp",
  "Programming with Mosh",
  "Coding Garden",
];

// Generate random views count
function generateViews(): string {
  const rand = Math.random();
  if (rand < 0.1) {
    return `${Math.floor(Math.random() * 999) + 1} views`;
  } else if (rand < 0.3) {
    return `${(Math.random() * 99 + 1).toFixed(1)}K views`;
  } else if (rand < 0.7) {
    return `${Math.floor(Math.random() * 999) + 1}K views`;
  } else if (rand < 0.9) {
    return `${(Math.random() * 9 + 1).toFixed(1)}M views`;
  } else {
    return `${Math.floor(Math.random() * 50) + 1}M views`;
  }
}

// Generate random duration
function generateDuration(): string {
  const minutes = Math.floor(Math.random() * 45) + 1; // 1-45 minutes
  const seconds = Math.floor(Math.random() * 60); // 0-59 seconds
  
  if (minutes < 10) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Generate random upload time
function generateUploadTime(): string {
  const timeOptions = [
    '2 hours ago',
    '5 hours ago',
    '12 hours ago',
    '1 day ago',
    '2 days ago',
    '3 days ago',
    '4 days ago',
    '5 days ago',
    '6 days ago',
    '1 week ago',
    '2 weeks ago',
    '3 weeks ago',
    '1 month ago',
    '2 months ago',
    '3 months ago',
    '4 months ago',
    '5 months ago',
    '6 months ago',
    '7 months ago',
    '8 months ago',
    '9 months ago',
    '10 months ago',
    '11 months ago',
    '1 year ago',
  ];
  
  return timeOptions[Math.floor(Math.random() * timeOptions.length)];
}

export function getMockVideos(count: number): Video[] {
  const videos: Video[] = [];
  
  for (let i = 0; i < count; i++) {
    const video: Video = {
      id: uuidv4(),
      title: videoTitles[Math.floor(Math.random() * videoTitles.length)],
      channel: {
        name: channelNames[Math.floor(Math.random() * channelNames.length)],
        avatar: `https://picsum.photos/seed/${i + 100}/40/40`, // 40x40 avatar
      },
      views: generateViews(),
      duration: generateDuration(),
      thumbnailUrl: `https://picsum.photos/seed/${i + 1000}/320/180`, // 16:9 aspect ratio
      uploadTime: generateUploadTime(),
    };
    
    videos.push(video);
  }
  
  return videos;
}

// Helper function to format view count for display
export interface VideoDetails extends Video {
  description: string;
  likes: string;
  dislikes: string;
  videoUrl: string;
  publishedDate: string;
  category: string;
  tags: string[];
}

// Sample video descriptions
const videoDescriptions = [
  "In this comprehensive tutorial, we'll dive deep into the fundamentals and advanced concepts. Perfect for beginners and experienced developers alike!\n\n📚 Resources mentioned:\n- Official documentation\n- GitHub repository\n- Community Discord\n\n⏰ Timestamps:\n0:00 Introduction\n2:30 Setup\n5:15 Basic concepts\n12:45 Advanced techniques\n18:20 Best practices\n25:10 Conclusion\n\n👍 Don't forget to like and subscribe for more content!",
  
  "Learn everything you need to know in this step-by-step guide. We'll cover all the essential topics with practical examples.\n\n🔗 Useful Links:\n- Project files\n- Additional resources\n- Follow-up tutorials\n\n💡 What you'll learn:\n✅ Core concepts\n✅ Practical applications\n✅ Common pitfalls to avoid\n✅ Pro tips and tricks\n\nSubscribe and hit the bell icon for notifications!",
  
  "Master these concepts with this detailed walkthrough. Includes downloadable resources and code examples.\n\n🎯 Who this is for:\n- Beginners looking to learn\n- Developers wanting to improve\n- Anyone interested in the topic\n\n📝 Note: Make sure to practice along with the video for the best learning experience.\n\nLet me know in the comments if you have any questions!"
];

// Sample video URLs (using sample videos)
const sampleVideoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

// Generate likes count
function generateLikes(): string {
  const rand = Math.random();
  if (rand < 0.3) {
    return `${Math.floor(Math.random() * 999) + 1}`;
  } else if (rand < 0.7) {
    return `${(Math.random() * 99 + 1).toFixed(1)}K`;
  } else {
    return `${Math.floor(Math.random() * 500) + 1}K`;
  }
}

// Get video details by ID
export function getVideoDetails(videoId: string): VideoDetails {
  // Generate consistent data based on video ID
  const seed = videoId.charCodeAt(0) + videoId.charCodeAt(1);
  const titleIndex = seed % videoTitles.length;
  const channelIndex = seed % channelNames.length;
  const descriptionIndex = seed % videoDescriptions.length;
  const videoUrlIndex = seed % sampleVideoUrls.length;
  
  return {
    id: videoId,
    title: videoTitles[titleIndex],
    channel: {
      name: channelNames[channelIndex],
      avatar: `https://picsum.photos/seed/${channelIndex + 100}/40/40`,
    },
    views: generateViews(),
    duration: generateDuration(),
    thumbnailUrl: `https://picsum.photos/seed/${seed + 1000}/320/180`,
    uploadTime: generateUploadTime(),
    description: videoDescriptions[descriptionIndex],
    likes: generateLikes(),
    dislikes: Math.floor(parseInt(generateLikes().replace('K', '')) * 0.05).toString(),
    videoUrl: sampleVideoUrls[videoUrlIndex],
    publishedDate: generateUploadTime(),
    category: "Education",
    tags: ["tutorial", "programming", "web development", "coding"],
  };
}

// Get related videos for a video ID
export function getRelatedVideos(videoId: string, count: number = 5): Video[] {
  const relatedVideos = getMockVideos(count);
  // Filter out the current video if it appears in related
  return relatedVideos.filter(video => video.id !== videoId);
}

export interface VideoSummaryData {
  text: string;
  highlightUrl: string;
}

// Sample AI-generated summaries
const aiSummaries = [
  "This comprehensive tutorial covers React hooks in detail, starting with useState and useEffect. The instructor demonstrates practical examples of state management, side effects, and custom hooks. Key topics include hook rules, dependency arrays, and performance optimization techniques. The video also explores advanced patterns like useReducer, useContext, and building reusable custom hooks for complex state logic.",
  
  "In this JavaScript ES6 features overview, we explore arrow functions, destructuring, template literals, and the spread operator. The tutorial provides hands-on examples of each feature and explains when to use them in real-world applications. Advanced topics include async/await, promises, and module imports/exports for modern JavaScript development.",
  
  "This web development guide walks through building modern applications with TypeScript. Starting with basic types and interfaces, the tutorial progresses to advanced concepts like generics, union types, and type guards. The instructor demonstrates practical patterns for React development and shows how TypeScript improves code quality and developer experience.",
  
  "Learn CSS Grid and Flexbox layout systems in this detailed comparison. The tutorial covers when to use each approach, with practical examples of responsive design patterns. Key concepts include grid template areas, flexible box properties, and combining both systems for complex layouts. Perfect for developers wanting to master modern CSS layout techniques.",
  
  "This Node.js best practices guide covers project structure, error handling, and performance optimization. The tutorial demonstrates proper middleware usage, database connections, and security implementations. Advanced topics include clustering, logging strategies, and deployment considerations for production environments.",
];

// Sample highlight video URLs (using publicly available sample videos)
const highlightVideoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];



export function formatViews(views: string): string {
  // If views is already formatted (contains 'K', 'M', etc.), return as is
  if (views.includes('K') || views.includes('M') || views.includes('views')) {
    return views;
  }
  
  // Otherwise, format the number
  const num = parseInt(views);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  } else {
    return `${num} views`;
  }
}