// api/index.js
import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

// =======================
// Telegram helpers
// =======================
const readTelegramContext = () => {
  try {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return { initData: null, telegramId: null };

    // Сигнализируем Telegram, что WebApp готов (безопасно вызывать много раз)
    try { tg.ready?.(); } catch (_) {}

    const initData = tg.initData || null;                          // подписанная строка для бэка
    const telegramId = tg.initDataUnsafe?.user?.id ?? null;        // ID пользователя (fallback)
    return { initData, telegramId };
  } catch {
    return { initData: null, telegramId: null };
  }
};

const getTelegramHeaders = () => {
  const { initData, telegramId } = readTelegramContext();
  // Предпочитаем initData — на бэке она проверяется по подписи
  if (initData) return { 'X-Telegram-Init-Data': initData };
  if (telegramId) return { 'X-Telegram-Id': String(telegramId) };
  // Вне Telegram (обычный браузер) ничего не добавляем — бэк вернёт 400
  return {};
};

// =======================
// API базовая конфигурация
// =======================
const API_BASE_URL = config.API_BASE_URL;

// Базовые заголовки для запросов
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
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
};

export default api;
