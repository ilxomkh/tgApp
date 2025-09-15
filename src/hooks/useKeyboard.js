import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const checkKeyboard = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      const heightDifference = windowHeight - documentHeight;
      
      const keyboardOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
    };

    const handleResize = () => {
      checkKeyboard();
    };

    const handleFocus = () => {
      setTimeout(checkKeyboard, 100);
    };

    const handleBlur = () => {
      setTimeout(checkKeyboard, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    checkKeyboard();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  return {
    isKeyboardOpen,
    keyboardHeight
  };
};
