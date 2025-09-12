import { useEffect } from 'react';

/**
 * Хук для управления кнопкой "Назад" в Telegram Mini App
 * @param {Function} onBack - функция, которая будет вызвана при нажатии кнопки "Назад"
 * @param {boolean} enabled - включить ли обработку кнопки "Назад"
 */
export const useTelegramBackButton = (onBack, enabled = true) => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (!tg || !enabled) {
      return;
    }

    // Устанавливаем текст кнопки "Назад" (если поддерживается)
    if (tg.BackButton.setText) {
      tg.BackButton.setText('Назад');
    }
    
    // Показываем кнопку "Назад"
    tg.BackButton.show();
    
    // Устанавливаем обработчик события
    const handleBackButton = () => {
      if (onBack && typeof onBack === 'function') {
        onBack();
      }
    };

    tg.onEvent('backButtonClicked', handleBackButton);

    // Cleanup: скрываем кнопку и удаляем обработчик при размонтировании
    return () => {
      tg.BackButton.hide();
      tg.offEvent('backButtonClicked', handleBackButton);
    };
  }, [onBack, enabled]);
};

export default useTelegramBackButton;
