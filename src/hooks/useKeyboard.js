import { useState, useEffect, useCallback } from 'react';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Функция для прокрутки к активному элементу
  const scrollToActiveElement = useCallback((offset = 100) => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      setTimeout(() => {
        const elementRect = activeElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const keyboardHeight = isKeyboardOpen ? keyboardHeight : 0;
        const availableHeight = viewportHeight - keyboardHeight;
        
        // Если элемент находится за клавиатурой
        if (elementRect.bottom > availableHeight) {
          const scrollAmount = elementRect.bottom - availableHeight + offset;
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          });
        }
      }, 300); // Задержка для анимации клавиатуры
    }
  }, [isKeyboardOpen, keyboardHeight]);

  useEffect(() => {
    let timeoutId;
    
    const checkKeyboard = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Используем visualViewport если доступен (более точный)
        if (window.visualViewport) {
          const currentHeight = window.visualViewport.height;
          const initialHeight = window.innerHeight;
          const heightDifference = initialHeight - currentHeight;
          
          const keyboardOpen = heightDifference > 150;
          
          setIsKeyboardOpen(keyboardOpen);
          setKeyboardHeight(keyboardOpen ? heightDifference : 0);
        } else {
          // Fallback для старых браузеров
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.clientHeight;
          const heightDifference = windowHeight - documentHeight;
          
          const keyboardOpen = heightDifference > 150;
          
          setIsKeyboardOpen(keyboardOpen);
          setKeyboardHeight(keyboardOpen ? heightDifference : 0);
        }
      }, 100);
    };

    const handleResize = () => {
      checkKeyboard();
    };

    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        checkKeyboard();
        // Автоматически прокручиваем к активному элементу
        scrollToActiveElement();
      }
    };

    const handleBlur = () => {
      checkKeyboard();
    };

    // Используем visualViewport если доступен
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }
    
    window.addEventListener('orientationchange', handleResize);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    checkKeyboard();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, [scrollToActiveElement]);

  return {
    isKeyboardOpen,
    keyboardHeight,
    scrollToActiveElement
  };
};
