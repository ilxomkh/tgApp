import { useEffect } from 'react';

/**
 * Хук для управления кнопкой "Назад" в Telegram Mini App
 * @param {Function} onBack - функция, которая будет вызвана при нажатии кнопки "Назад"
 * @param {boolean} enabled - включить ли обработку кнопки "Назад"
 */
export const useTelegramBackButton = (onBack, enabled = true) => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    console.log('useTelegramBackButton - Telegram WebApp:', tg);
    console.log('useTelegramBackButton - enabled:', enabled);
    
    if (!tg || !enabled) {
      console.log('useTelegramBackButton - Telegram WebApp not available or disabled');
      return;
    }

    console.log('useTelegramBackButton - Showing back button');
    // Показываем кнопку "Назад"
    tg.BackButton.show();
    
    // Устанавливаем обработчик события
    const handleBackButton = () => {
      console.log('useTelegramBackButton - Back button clicked');
      if (onBack && typeof onBack === 'function') {
        onBack();
      }
    };

    tg.onEvent('backButtonClicked', handleBackButton);

    // Cleanup: скрываем кнопку и удаляем обработчик при размонтировании
    return () => {
      console.log('useTelegramBackButton - Cleaning up, hiding back button');
      tg.BackButton.hide();
      tg.offEvent('backButtonClicked', handleBackButton);
    };
  }, [onBack, enabled]);
};

export default useTelegramBackButton;
