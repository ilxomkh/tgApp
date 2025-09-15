import { useEffect, useRef } from 'react';

export const useScrollControl = (enabled = true) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        const container = containerRef.current;
        const { scrollTop, scrollHeight, clientHeight } = container;
        
        if ((scrollTop === 0 && e.touches[0].clientY > e.touches[0].clientY) ||
            (scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < e.touches[0].clientY)) {
          e.preventDefault();
        }
      }
    };

    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [enabled]);

  return containerRef;
};
