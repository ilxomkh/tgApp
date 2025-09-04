import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

// API конфигурация
const API_BASE_URL = config.API_BASE_URL;

// Базовые заголовки для запросов
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Обработка ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || errorData.error;
    
    // Специфичные ошибки по статус кодам
    switch (response.status) {
      case 400:
        errorMessage = errorMessage || ERROR_MESSAGES.INVALID_PHONE;
        break;
      case 401:
        errorMessage = errorMessage || ERROR_MESSAGES.INVALID_OTP;
        break;
      case 429:
        errorMessage = errorMessage || ERROR_MESSAGES.TOO_MANY_ATTEMPTS;
        break;
      case 500:
        errorMessage = errorMessage || ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        errorMessage = errorMessage || `HTTP error! status: ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// Функция для создания запроса с таймаутом
const fetchWithTimeout = async (url, options, timeout = config.REQUEST_TIMEOUT) => {
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
    if (error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    throw error;
  }
};

// Базовые API функции
export const api = {
  // Отправка OTP кода
  requestOtp: async (phoneNumber) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.REQUEST_OTP}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return handleResponse(response);
  },

  // Проверка OTP кода
  verifyOtp: async (phoneNumber, code) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        phone_number: phoneNumber,
        code: code 
      }),
    });
    return handleResponse(response);
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
};

export default api;
