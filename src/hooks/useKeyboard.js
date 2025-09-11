import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Функция для определения открыта ли клавиатура
    const checkKeyboard = () => {
      // Для мобильных устройств используем разницу между window.innerHeight и document.documentElement.clientHeight
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      const heightDifference = windowHeight - documentHeight;
      
      // Если разница больше 150px, считаем что клавиатура открыта
      const keyboardOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
    };

    // Проверяем при изменении размера окна
    const handleResize = () => {
      checkKeyboard();
    };

    // Проверяем при фокусе на input элементах
    const handleFocus = () => {
      // Небольшая задержка для корректного определения размера
      setTimeout(checkKeyboard, 100);
    };

    const handleBlur = () => {
      // Небольшая задержка для корректного определения размера
      setTimeout(checkKeyboard, 100);
    };

    // Добавляем обработчики событий
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Добавляем обработчики для всех input элементов
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Проверяем изначальное состояние
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
