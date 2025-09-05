/**
 * Утилиты для работы с Telegram WebApp
 */

import config from '../config.js';

/**
 * Получает объект Telegram WebApp
 * @returns {Object|null} Telegram WebApp объект или null если недоступен
 */
export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

/**
 * Получает ID пользователя Telegram
 * @returns {string|null} ID пользователя или null если недоступен
 */
export const getTelegramUserId = () => {
  const tg = getTelegramWebApp();
  
  if (config.DEBUG_MODE) {
    console.log('Telegram WebApp object:', tg);
  }
  
  if (tg && tg.initDataUnsafe) {
    if (config.DEBUG_MODE) {
      console.log('Telegram initDataUnsafe:', tg.initDataUnsafe);
    }
    
    if (tg.initDataUnsafe.user) {
      const userId = tg.initDataUnsafe.user.id.toString();
      if (config.DEBUG_MODE) {
        console.log('Telegram User ID found:', userId);
      }
      return userId;
    } else {
      if (config.DEBUG_MODE) {
        console.warn('Telegram user not found in initDataUnsafe');
      }
    }
  } else {
    if (config.DEBUG_MODE) {
      console.warn('Telegram WebApp or initDataUnsafe not available');
    }
    
    // Для режима разработки или тестирования вне Telegram
    // сначала проверяем конфигурацию, затем localStorage
    if (config.DEV_TELEGRAM_ID) {
      if (config.DEBUG_MODE) {
        console.log('Using development Telegram ID from config:', config.DEV_TELEGRAM_ID);
      }
      return config.DEV_TELEGRAM_ID;
    }
    
    const fallbackId = localStorage.getItem('telegram_user_id_fallback');
    if (fallbackId) {
      if (config.DEBUG_MODE) {
        console.log('Using fallback Telegram ID from localStorage:', fallbackId);
      }
      return fallbackId;
    }
  }
  
  return null;
};

/**
 * Получает полную информацию о пользователе Telegram
 * @returns {Object|null} Данные пользователя или null если недоступен
 */
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

/**
 * Проверяет, запущено ли приложение в Telegram
 * @returns {boolean} true если в Telegram, false иначе
 */
export const isRunningInTelegram = () => {
  return getTelegramWebApp() !== null;
};

/**
 * Получает init data для проверки подлинности
 * @returns {string|null} Init data строка или null
 */
export const getTelegramInitData = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initData) {
    return tg.initData;
  }
  return null;
};

/**
 * Устанавливает fallback ID для режима разработки
 * @param {string} userId - ID пользователя для использования в качестве fallback
 */
export const setFallbackTelegramId = (userId) => {
  localStorage.setItem('telegram_user_id_fallback', userId);
  console.log('Fallback Telegram ID set:', userId);
}; 