import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    const checkKeyboard = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.visualViewport) {
          const currentHeight = window.visualViewport.height;
          const initialHeight = window.innerHeight;
          const heightDifference = initialHeight - currentHeight;
          
          const keyboardOpen = heightDifference > 150;
          setIsKeyboardOpen(keyboardOpen);
        } else {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.clientHeight;
          const heightDifference = windowHeight - documentHeight;
          
          const keyboardOpen = heightDifference > 150;
          setIsKeyboardOpen(keyboardOpen);
        }
      }, 100);
    };

    const handleResize = () => {
      checkKeyboard();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }
    
    window.addEventListener('orientationchange', handleResize);

    checkKeyboard();

    return () => {
      clearTimeout(timeoutId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    isKeyboardOpen
  };
};
