import React from 'react';

/**
 * Утилита для работы с haptic feedback в Telegram WebApp
 */

/**
 * Проверяет доступность Telegram WebApp API
 */
const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp && 
         window.Telegram.WebApp.HapticFeedback;
};

/**
 * Вызывает легкую вибрацию при нажатии на кнопку
 */
export const lightImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает среднюю вибрацию при нажатии на кнопку
 */
export const mediumImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает сильную вибрацию при нажатии на кнопку
 */
export const heavyImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает вибрацию при успешном действии
 */
export const notificationSuccess = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает вибрацию при ошибке
 */
export const notificationError = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает вибрацию при предупреждении
 */
export const notificationWarning = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Вызывает вибрацию при выборе элемента
 */
export const selectionChanged = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }
};

/**
 * Хук для создания обработчика клика с haptic feedback
 * @param {Function} originalOnClick - оригинальный обработчик клика
 * @param {string} feedbackType - тип вибрации ('light', 'medium', 'heavy', 'success', 'error', 'warning', 'selection')
 * @returns {Function} - новый обработчик клика с вибрацией
 */
export const useHapticClick = (originalOnClick, feedbackType = 'light') => {
  return (event) => {
    // Вызываем haptic feedback
    switch (feedbackType) {
      case 'light':
        lightImpact();
        break;
      case 'medium':
        mediumImpact();
        break;
      case 'heavy':
        heavyImpact();
        break;
      case 'success':
        notificationSuccess();
        break;
      case 'error':
        notificationError();
        break;
      case 'warning':
        notificationWarning();
        break;
      case 'selection':
        selectionChanged();
        break;
      default:
        lightImpact();
    }
    
    // Вызываем оригинальный обработчик
    if (originalOnClick) {
      originalOnClick(event);
    }
  };
};

/**
 * HOC для добавления haptic feedback к компоненту кнопки
 * @param {React.Component} ButtonComponent - компонент кнопки
 * @param {string} feedbackType - тип вибрации
 * @returns {React.Component} - обернутый компонент с haptic feedback
 */
export const withHapticFeedback = (ButtonComponent, feedbackType = 'light') => {
  return React.forwardRef(({ onClick, ...props }, ref) => {
    const hapticOnClick = useHapticClick(onClick, feedbackType);
    
    return React.createElement(ButtonComponent, {
      ...props,
      onClick: hapticOnClick,
      ref: ref
    });
  });
};

/**
 * Глобальная функция для инициализации автоматического haptic feedback
 * Добавляет обработчик клика ко всему документу для автоматической вибрации
 * @param {Object} options - опции конфигурации
 * @param {string} options.feedbackType - тип вибрации по умолчанию
 * @param {Array} options.excludeSelectors - селекторы элементов для исключения
 * @param {Array} options.includeSelectors - дополнительные селекторы для включения
 */
export const initGlobalHapticFeedback = (options = {}) => {
  const {
    feedbackType = 'light',
    excludeSelectors = ['.no-haptic', '[data-no-haptic]'],
    includeSelectors = ['button', '[role="button"]', '.clickable', '[data-clickable]']
  } = options;

  const handleGlobalClick = (event) => {
    const target = event.target;
    
    // Проверяем исключения
    const isExcluded = excludeSelectors.some(selector => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch (e) {
        return false;
      }
    });
    
    if (isExcluded) return;
    
    // Проверяем включения
    const isIncluded = includeSelectors.some(selector => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch (e) {
        return false;
      }
    });
    
    if (!isIncluded) return;
    
    // Вызываем haptic feedback
    if (isTelegramWebApp()) {
      try {
        switch (feedbackType) {
          case 'light':
            lightImpact();
            break;
          case 'medium':
            mediumImpact();
            break;
          case 'heavy':
            heavyImpact();
            break;
          case 'success':
            notificationSuccess();
            break;
          case 'error':
            notificationError();
            break;
          case 'warning':
            notificationWarning();
            break;
          case 'selection':
            selectionChanged();
            break;
          default:
            lightImpact();
        }
      } catch (error) {
        console.warn('Global haptic feedback error:', error);
      }
    }
  };

  // Добавляем обработчик
  document.addEventListener('click', handleGlobalClick, true);
  
  // Возвращаем функцию для удаления обработчика
  return () => {
    document.removeEventListener('click', handleGlobalClick, true);
  };
};
