import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  lastElementRef: (node: HTMLElement | null) => void;
  reset: () => void;
}

export const useInfiniteScroll = (
  callback: () => Promise<boolean> | boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || !enabled) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsLoading(true);
            setError(null);

            Promise.resolve(callback())
              .then((moreDataAvailable) => {
                setHasMore(moreDataAvailable);
              })
              .catch((err) => {
                setError(err.message || 'An error occurred while loading more data');
                console.error('Infinite scroll error:', err);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore, callback, threshold, rootMargin, enabled]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setHasMore(true);
    setError(null);
    if (observer.current) {
      observer.current.disconnect();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    isLoading,
    hasMore,
    error,
    lastElementRef,
    reset,
  };
};

export default useInfiniteScroll;