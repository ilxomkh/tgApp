// api/index.js
import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

// Глобальный флаг для предотвращения перенаправления во время инициализации
let isInitializing = false;

export const setInitializing = (value) => {
  isInitializing = value;
};

// =======================
// Telegram helpers
// =======================
// helpers/telegram.js (новый маленький хелпер)
export const readTelegramContext = () => {
  const tg = window?.Telegram?.WebApp;
  try { tg?.ready?.(); } catch (_) {}
  const initData = tg?.initData || null;
  const telegramIdWebApp = tg?.initDataUnsafe?.user?.id ?? null;

  // fallback: ?tg_id=123...
  const qsId = new URLSearchParams(window.location.search).get('tg_id');

  // запомним dev id в localStorage (можно заранее положить руками)
  if (qsId) localStorage.setItem('dev_tg_id', qsId);
  const devId = localStorage.getItem('dev_tg_id');

  const telegramId =
    telegramIdWebApp ??
    (qsId ? Number(qsId) : null) ??
    (devId ? Number(devId) : null);

  return { initData, telegramId };
};

export const getTelegramHeaders = () => {
  const { initData, telegramId } = readTelegramContext();
  if (initData) return { 'X-Telegram-Init-Data': initData };   // правильный путь
  if (telegramId) return { 'X-Telegram-Id': String(telegramId) }; // dev/браузер
  return {};
};

// =======================
// API базовая конфигурация
// =======================
const API_BASE_URL = config.API_BASE_URL;

// Базовые заголовки для запросов
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const sessionId = localStorage.getItem('session_id');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'x-session-id': sessionId }),
    // <— добавляем заголовки Telegram
    ...getTelegramHeaders()
  };
};

// Обработка ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || errorData.error;

    switch (response.status) {
      case 400:
        // Если бэк вернул 400 без текста — чаще всего нет Telegram identity
        errorMessage = errorMessage || ERROR_MESSAGES?.INVALID_PHONE || 'Bad request';
        if (!errorData.message && !errorData.error) {
          errorMessage = 'Откройте приложение внутри Telegram. Личность пользователя не определена.';
        }
        break;
      case 401:
        errorMessage = errorMessage || ERROR_MESSAGES?.INVALID_OTP || 'Unauthorized';
        
        // Глобальная обработка 401 ошибки - перенаправляем на страницу авторизации
        // Но только если не инициализируемся и не находимся уже на странице авторизации
        if (!isInitializing && !window.location.pathname.includes('/auth')) {
          // Очищаем все данные пользователя
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('session_id');
          
          // Перенаправляем на страницу авторизации
          window.location.href = '/auth';
        }
        break;
      case 429:
        errorMessage = errorMessage || ERROR_MESSAGES?.TOO_MANY_ATTEMPTS || 'Too many requests';
        break;
      case 500:
        errorMessage = errorMessage || ERROR_MESSAGES?.SERVER_ERROR || 'Server error';
        break;
      default:
        errorMessage = errorMessage || `HTTP error! status: ${response.status}`;
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// Запрос с таймаутом
const fetchWithTimeout = async (url, options, timeout = config.REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES?.TIMEOUT_ERROR || 'Request timeout');
    }
    throw error;
  }
};

// =======================
// Публичный API
// =======================
export const api = {
  // Отправка OTP кода
  requestOtp: async (phoneNumber) => {
    // phone_number опционально; бэку достаточно Telegram identity
    const body = phoneNumber ? { phone_number: phoneNumber } : {};
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.REQUEST_OTP}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  // Проверка OTP кода
  verifyOtp: async (phoneNumber, code) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...(phoneNumber ? { phone_number: phoneNumber } : {}),
        code
      }),
    });
    return handleResponse(response);
  },

  // Профиль пользователя
  getUserProfile: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateUserProfile: async (userData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_USER_PROFILE}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Лотереи
  getRaffles: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_RAFFLES}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Карты
  getCards: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_CARDS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  addCard: async (cardNumber) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.ADD_CARD}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ card_number: cardNumber }),
    });
    return handleResponse(response);
  },

  // Инвайты
  getInviteStats: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_INVITE_STATS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Заказ опроса
  createOrder: async (orderData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_ORDER}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Платёж (вывод)
  createPayment: async (paymentData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_PAYMENT}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

  // Tally webhook
  processTallyWebhook: async (webhookData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_WEBHOOK}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // вебхуки можно отправлять и без Telegram-заголовков
      },
      body: JSON.stringify(webhookData),
    });
    return handleResponse(response);
  },

  // Статистика опросов
  getSurveyResponses: async (language = 'ru') => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${API_ENDPOINTS.GET_SURVEY_RESPONSES}?language=${encodeURIComponent(language)}`,
      { method: 'GET', headers: getHeaders() }
    );
    return handleResponse(response);
  },

  // Обработка ответа
  processSurveyResponse: async (surveyData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_SURVEY_RESPONSE}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(surveyData),
    });
    return handleResponse(response);
  },

  // =======================
  // Tally API через сервер
  // =======================
  
  // Получение списка форм Tally
  getTallyForms: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORMS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Получение конкретной формы Tally по ID
  getTallyFormById: async (formId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORM_BY_ID}/${formId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Получение ответов на форму Tally
  getTallyFormResponses: async (formId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORM_RESPONSES}/${formId}/responses`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Синхронизация данных с Tally
  syncTallyData: async (syncData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_SYNC}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(syncData),
    });
    return handleResponse(response);
  },
};

export default api;
