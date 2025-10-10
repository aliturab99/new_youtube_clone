import { useState, useEffect } from 'react';

export const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      
      if (width >= 1200) {
        return 4; // lg: 4 columns
      } else if (width >= 768) {
        return 3; // md: 3 columns
      } else if (width >= 640) {
        return 2; // sm: 2 columns
      } else {
        return 1; // xs: 1 column
      }
    };

    const handleResize = () => {
      setColumns(calculateColumns());
    };

    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
};