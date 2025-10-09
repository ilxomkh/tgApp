import React from 'react';

const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp && 
         window.Telegram.WebApp.HapticFeedback;
};

export const lightImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    } catch (error) {}
  }
};

export const mediumImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } catch (error) {}
  }
};

export const heavyImpact = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    } catch (error) {}
  }
};

export const notificationSuccess = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    } catch (error) {}
  }
};

export const notificationError = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    } catch (error) {}
  }
};

export const notificationWarning = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    } catch (error) {}
  }
};

export const selectionChanged = () => {
  if (isTelegramWebApp()) {
    try {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    } catch (error) {}
  }
};

/**
 * @param {Function} originalOnClick
 * @param {string} feedbackType
 * @returns {Function}
 */
export const useHapticClick = (originalOnClick, feedbackType = 'light') => {
  return (event) => {
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
    
    if (originalOnClick) {
      originalOnClick(event);
    }
  };
};

/**
 * @param {React.Component} ButtonComponent
 * @param {string} feedbackType
 * @returns {React.Component}
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
 * @param {Object} options
 * @param {string} options.feedbackType
 * @param {Array} options.excludeSelectors
 * @param {Array} options.includeSelectors
 */
export const initGlobalHapticFeedback = (options = {}) => {
  const {
    feedbackType = 'light',
    excludeSelectors = ['.no-haptic', '[data-no-haptic]'],
    includeSelectors = ['button', '[role="button"]', '.clickable', '[data-clickable]']
  } = options;

  const handleGlobalClick = (event) => {
    const target = event.target;
    
    const isExcluded = excludeSelectors.some(selector => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch (e) {
        return false;
      }
    });
    
    if (isExcluded) return;
    
    const isIncluded = includeSelectors.some(selector => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch (e) {
        return false;
      }
    });
    
    if (!isIncluded) return;
    
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
      } catch (error) {}
    }
  };

  document.addEventListener('click', handleGlobalClick, true);
  
  return () => {
    document.removeEventListener('click', handleGlobalClick, true);
  };
};
