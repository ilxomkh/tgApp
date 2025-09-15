import { useEffect } from 'react';

/**
 * @param {Function} onBack
 * @param {boolean} enabled
 */
export const useTelegramBackButton = (onBack, enabled = true) => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (!tg || !enabled) {
      return;
    }

    if (tg.BackButton.setText) {
      tg.BackButton.setText('Назад');
    }
    
    tg.BackButton.show();
    
    const handleBackButton = () => {
      if (onBack && typeof onBack === 'function') {
        onBack();
      }
    };

    tg.onEvent('backButtonClicked', handleBackButton);

    return () => {
      tg.BackButton.hide();
      tg.offEvent('backButtonClicked', handleBackButton);
    };
  }, [onBack, enabled]);
};

export default useTelegramBackButton;
