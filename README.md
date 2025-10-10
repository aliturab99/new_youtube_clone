# YouTube Clone - Advanced Video Streaming Platform

A modern, feature-rich YouTube clone built with React, TypeScript, and Material-UI. This application demonstrates advanced React patterns, performance optimizations, and Progressive Web App (PWA) capabilities.

## ✨ Key Features

### 🎥 Core Functionality
- **Video Streaming**: Browse and watch videos with full player controls
- **Interactive Comments**: Threaded comment system with nested replies (up to 2 levels)
- **User Engagement**: Like/dislike videos and comments with real-time count updates
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices

### ⚡ Performance Optimizations
- **Lazy Loading**: All pages are lazy-loaded using `React.lazy()` and `Suspense`
- **Component Memoization**: Critical components wrapped with `React.memo`
- **Infinite Scroll**: Custom `useInfiniteScroll` hook with Intersection Observer API
- **Code Splitting**: Automatic code splitting for optimal bundle sizes

### 📱 Progressive Web App (PWA)
- **Offline Support**: Service worker for caching and offline functionality
- **App-like Experience**: Standalone mode with custom theme colors
- **Install Prompt**: Native install experience on supported devices
- **Background Sync**: Offline action queuing for better UX

### 🎨 User Interface
- **Material-UI Components**: Consistent design system with YouTube-inspired styling
- **Dark Theme**: YouTube-like dark mode interface
- **Smooth Animations**: Fluid transitions and loading states
- **Mobile-First**: Optimized for mobile devices with touch interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser with ES6+ support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd new_youtube_clone

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
# Create optimized production build
npm run build

# Serve production build locally (optional)
npx serve -s build
```

## 🏗️ Architecture & Design Patterns

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── VideoCard.tsx   # Memoized video card component
│   └── CommentsSection.tsx  # Threaded comment system
├── pages/              # Lazy-loaded page components
│   ├── Home.tsx        # Video grid with infinite scroll
│   ├── Watch.tsx       # Video player with comments
│   └── ...
├── hooks/              # Custom React hooks
│   └── useInfiniteScroll.ts  # Intersection Observer hook
├── utils/              # Utility functions and mock data
│   └── mockData.ts     # Mock API with realistic delays
└── serviceWorkerRegistration.ts  # PWA service worker
```

### Key Technologies
- **React 18**: Latest React features including Suspense and lazy loading
- **TypeScript**: Type-safe development with strict typing
- **Material-UI v6**: Modern component library with theming
- **React Router v6**: Client-side routing with nested routes
- **Intersection Observer**: Native browser API for infinite scroll

## 🛠️ Custom Hooks & Utilities

### useInfiniteScroll Hook
```typescript
const { isLoading, hasMore, error, lastElementRef } = useInfiniteScroll(
  loadMoreData,
  {
    threshold: 0.5,
    rootMargin: '200px',
    enabled: true
  }
);
```

Features:
- Intersection Observer API integration
- Error handling and loading states
- Configurable threshold and root margin
- TypeScript support with full type safety

### Mock API System
- Realistic network delays (500-1000ms)
- Comprehensive comment threading
- User interaction simulation
- Error scenario handling

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
