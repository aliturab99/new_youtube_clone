import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  // Background colors
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  gradientBg: string;
  
  // Text colors
  primaryText: string;
  secondaryText: string;
  
  // Accent colors
  primary: string;
  primaryHover: string;
  border: string;
  
  // Component specific
  headerBg: string;
  sidebarBg: string;
  cardGradient: string;
  buttonGradient: string;
  activeGradient: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const darkTheme: ThemeColors = {
  primaryBg: '#0a0e27',
  secondaryBg: '#000000',
  cardBg: '#0a0e27',
  gradientBg: 'linear-gradient(135deg, #0a0e27 0%, #000000 50%, #0d1b2a 100%)',
  
  primaryText: '#FFFFFF',
  secondaryText: 'rgba(255, 255, 255, 0.6)',
  
  primary: '#3b82f6',
  primaryHover: '#1d4ed8',
  border: 'rgba(59, 130, 246, 0.2)',
  
  headerBg: 'linear-gradient(90deg, #0a0e27 0%, #000000 50%, #0d1b2a 100%)',
  sidebarBg: 'linear-gradient(180deg, #0a0e27 0%, #000000 50%, #0d1b2a 100%)',
  cardGradient: 'linear-gradient(135deg, #0a0e27 0%, #000000 100%)',
  buttonGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  activeGradient: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.1) 100%)',
};

const lightTheme: ThemeColors = {
  primaryBg: '#FFFFFF',
  secondaryBg: '#F5F5F5',
  cardBg: '#FFFFFF',
  gradientBg: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 50%, #E8F1FF 100%)',
  
  primaryText: '#000000',
  secondaryText: 'rgba(0, 0, 0, 0.6)',
  
  primary: '#3b82f6',
  primaryHover: '#1d4ed8',
  border: 'rgba(59, 130, 246, 0.3)',
  
  headerBg: 'linear-gradient(90deg, #FFFFFF 0%, #F5F8FF 50%, #FFFFFF 100%)',
  sidebarBg: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 50%, #E8E8E8 100%)',
  cardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5F8FF 100%)',
  buttonGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  activeGradient: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.08) 100%)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'dark';
  });

  const colors = mode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    // Apply theme to body for global styles
    document.body.style.background = colors.gradientBg;
    document.body.style.transition = 'background 0.3s ease';
  }, [mode, colors.gradientBg]);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
