import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

// API конфигурация
const API_BASE_URL = config.API_BASE_URL;

// Telegram WebApp init data
let telegramInitData = null;

// Инициализация Telegram данных
const initTelegramData = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    telegramInitData = window.Telegram.WebApp.initData;
    
    if (!telegramInitData) {
      console.warn('Telegram initData not available. Make sure app is opened via Telegram bot.');
    }
  }
};

// Автоинициализация при импорте
initTelegramData();

// Базовые заголовки для запросов
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Добавляем Telegram init data для аутентификации
  if (includeAuth && telegramInitData) {
    headers['X-Telegram-Init-Data'] = telegramInitData;
  }

  // Добавляем session_id для авторизованных запросов
  const sessionId = localStorage.getItem('session_id');
  if (sessionId) {
    headers['Authorization'] = `Bearer ${sessionId}`;
  }

  return headers;
};

// Обработка ошибок с улучшенной обработкой Telegram специфичных ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.detail || errorData.message || errorData.error;
    
    // Специфичные ошибки по статус кодам
    switch (response.status) {
      case 400:
        if (errorMessage?.includes('X-Telegram-Init-Data')) {
          errorMessage = 'Ошибка аутентификации. Перезапустите приложение через бота.';
        } else if (errorMessage?.includes('phone')) {
          errorMessage = errorMessage || ERROR_MESSAGES.INVALID_PHONE;
        } else if (errorMessage?.includes('start')) {
          errorMessage = 'Сначала нажмите /start в боте.';
        } else {
          errorMessage = errorMessage || 'Неверные данные запроса.';
        }
        break;
      case 401:
        if (errorMessage?.includes('init_data')) {
          errorMessage = 'Недействительные данные Telegram. Перезапустите приложение.';
        } else {
          errorMessage = errorMessage || ERROR_MESSAGES.INVALID_OTP;
        }
        break;
      case 429:
        errorMessage = errorMessage || ERROR_MESSAGES.TOO_MANY_ATTEMPTS;
        break;
      case 500:
        errorMessage = errorMessage || ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        errorMessage = errorMessage || `Ошибка сервера: ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// Функция для создания запроса с таймаутом и retry логикой
const fetchWithTimeout = async (url, options, timeout = config.REQUEST_TIMEOUT, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      if (error.name === 'AbortError') {
        lastError = new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      // Не повторяем для специфичных ошибок
      if (attempt === maxRetries || 
          error.name === 'AbortError' || 
          error.message.includes('init_data')) {
        break;
      }
      
      // Ждем перед повтором (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw lastError;
};

// Проверка доступности Telegram WebApp API
const checkTelegramAvailability = () => {
  if (!telegramInitData) {
    throw new Error('Приложение должно запускаться через Telegram бота.');
  }
};

// Обновленные API функции
export const api = {
  // Инициализация (вызывается при запуске приложения)
  init: () => {
    initTelegramData();
  },

  // Проверка состояния аутентификации
  isAuthenticated: () => {
    return !!localStorage.getItem('session_id');
  },

  // Очистка сессии
  clearSession: () => {
    localStorage.removeItem('session_id');
  },

  // Отправка OTP кода (обновлено под новую систему)
  requestOtp: async (phoneNumber = null) => {
    checkTelegramAvailability();
    
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.REQUEST_OTP}`, {
      method: 'POST',
      headers: getHeaders(true), // включаем Telegram auth
      body: JSON.stringify({ 
        phone_number: phoneNumber 
      }),
    });
    return handleResponse(response);
  },

  // Проверка OTP кода (обновлено)
  verifyOtp: async (code, phoneNumber = null) => {
    checkTelegramAvailability();
    
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST',
      headers: getHeaders(true), // включаем Telegram auth
      body: JSON.stringify({ 
        code: code,
        phone_number: phoneNumber
      }),
    });
    
    const result = await handleResponse(response);
    
    // Сохраняем session_id после успешной аутентификации
    if (result.session_id) {
      localStorage.setItem('session_id', result.session_id);
    }
    
    return result;
  },

  // Получение данных пользователя
  getUserProfile: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Обновление данных пользователя
  updateUserProfile: async (userData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_USER_PROFILE}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Получение списка лотерей
  getRaffles: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_RAFFLES}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Получение списка карт
  getCards: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_CARDS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Добавление новой карты
  addCard: async (cardNumber) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.ADD_CARD}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ card_number: cardNumber }),
    });
    return handleResponse(response);
  },

  // Получение статистики приглашений
  getInviteStats: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_INVITE_STATS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Создание заказа опроса
  createOrder: async (orderData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_ORDER}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Создание платежа (вывод на карту)
  createPayment: async (paymentData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_PAYMENT}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

  // Tally webhook обработка
  processTallyWebhook: async (webhookData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_WEBHOOK}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    return handleResponse(response);
  },

  // Получение статистики опросов
  getSurveyResponses: async (language = 'ru') => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_SURVEY_RESPONSES}?language=${language}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Обработка ответа на опрос
  processSurveyResponse: async (surveyData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_SURVEY_RESPONSE}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(surveyData),
    });
    return handleResponse(response);
  },

  // Новые утилиты для работы с Telegram
  telegram: {
    // Получение данных пользователя из Telegram
    getUserData: () => {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        return window.Telegram.WebApp.initDataUnsafe?.user || null;
      }
      return null;
    },

    // Проверка доступности Telegram WebApp
    isAvailable: () => {
      return !!(typeof window !== 'undefined' && 
                window.Telegram && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initData);
    },

    // Настройка Telegram WebApp
    setupWebApp: () => {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        
        // Готовность приложения
        webApp.ready();
        
        // Расширяем приложение на весь экран
        webApp.expand();
        
        // Настройка цветовой схемы
        if (webApp.colorScheme === 'dark') {
          document.body.classList.add('dark-theme');
        }
        
        // Обработчик изменения viewport
        webApp.onEvent('viewportChanged', () => {
          console.log('Viewport changed:', webApp.viewportHeight);
        });
        
        return webApp;
      }
      return null;
    },

    // Показать уведомление
    showAlert: (message) => {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(message);
      } else {
        alert(message);
      }
    },

    // Вибрация
    hapticFeedback: (type = 'impact') => {
      if (typeof window !== 'undefined' && 
          window.Telegram && 
          window.Telegram.WebApp && 
          window.Telegram.WebApp.HapticFeedback) {
        
        const haptic = window.Telegram.WebApp.HapticFeedback;
        
        switch (type) {
          case 'impact':
            haptic.impactOccurred('medium');
            break;
          case 'success':
            haptic.notificationOccurred('success');
            break;
          case 'error':
            haptic.notificationOccurred('error');
            break;
          case 'warning':
            haptic.notificationOccurred('warning');
            break;
        }
      }
    },

    // Закрытие приложения
    close: () => {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
      }
    }
  }
};

// Автоматическая настройка при импорте модуля
if (typeof window !== 'undefined') {
  // Ждем загрузки Telegram WebApp
  const initApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      api.init();
      api.telegram.setupWebApp();
    } else {
      // Повторная попытка через 100мс
      setTimeout(initApp, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

export default api;