import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';
import { markSurveyAsCompleted } from '../utils/completedSurveys.js';

let isInitializing = false;

export const setInitializing = (value) => {
  isInitializing = value;
};

export const readTelegramContext = () => {
  const tg = window?.Telegram?.WebApp;
  try { tg?.ready?.(); } catch (_) {}
  const initData = tg?.initData || null;
  const telegramIdWebApp = tg?.initDataUnsafe?.user?.id ?? null;

  const qsId = new URLSearchParams(window.location.search).get('tg_id');

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
  if (initData) return { 'X-Telegram-Init-Data': initData };
  if (telegramId) return { 'X-Telegram-Id': String(telegramId) };
  return {};
};


const API_BASE_URL = config.API_BASE_URL;

const handleUnauthorized = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('session_id');
  
  window.location.href = '/onboarding';
};

const getHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem('auth_token');
  const sessionId = localStorage.getItem('session_id');
  const telegramHeaders = getTelegramHeaders();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'x-session-id': sessionId }),
    ...telegramHeaders,
    ...additionalHeaders
  };
  
  
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || errorData.error;

    switch (response.status) {
      case 400:
        errorMessage = errorMessage || ERROR_MESSAGES?.INVALID_PHONE || 'Bad request';
        if (!errorData.message && !errorData.error) {
          errorMessage = 'Откройте приложение внутри Telegram. Личность пользователя не определена.';
        }
        break;
      case 401:
        errorMessage = errorMessage || ERROR_MESSAGES?.INVALID_OTP || 'Unauthorized';
        handleUnauthorized();
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

export const api = {
  requestOtp: async (phoneNumber, referralCode = null) => {
    const body = phoneNumber ? { phone_number: phoneNumber } : {};
    if (referralCode) {
      body.referral_code = referralCode;
    }
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.REQUEST_OTP}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

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

  getRaffles: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_RAFFLES}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

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

  getInviteStats: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.GET_INVITE_STATS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createOrder: async (orderData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_ORDER}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  createPayment: async (paymentData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.CREATE_PAYMENT}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

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

  getSurveyResponses: async (language = 'ru') => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${API_ENDPOINTS.GET_SURVEY_RESPONSES}?language=${encodeURIComponent(language)}`,
      { method: 'GET', headers: getHeaders() }
    );
    return handleResponse(response);
  },

  processSurveyResponse: async (surveyData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_SURVEY_RESPONSE}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(surveyData),
    });
    return handleResponse(response);
  },


  getTallyForms: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORMS}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getTallyFormById: async (formId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORM_BY_ID}/${formId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getTallyFormResponses: async (formId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_FORM_RESPONSES}/${formId}/responses`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  syncTallyData: async (syncData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.TALLY_SYNC}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(syncData),
    });
    return handleResponse(response);
  },

  submitTallyForm: async (formId, answers, userId = null) => {
    if (!userId) {
      const { telegramId } = readTelegramContext();
      userId = telegramId;
    }
    const endpoint = `${API_BASE_URL}${API_ENDPOINTS.TALLY_FORM_SUBMIT}/${formId}/submit`;
    
    const requestBody = {
      answers: answers.answers || answers,
      user_id: userId || 0
    };
    
    
    
    const additionalHeaders = {};
    if (answers.otp) {
      additionalHeaders['x-otp-code'] = answers.otp;
    }
    
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: getHeaders(additionalHeaders),
        body: JSON.stringify(requestBody),
      });
      
      
      
      const result = await handleResponse(response);
      
      
      
      return result;
    } catch (error) {
      console.error('❌ API Error in submitTallyForm:', {
        error: error.message,
        endpoint,
        formId,
        userId,
        timestamp: new Date().toISOString()
      });
      
      // Проверяем, является ли ошибка сообщением о том, что опрос уже пройден
      if (error.message && error.message.includes('Вы уже прошли этот опрос')) {
        console.log(`📝 Опрос ${formId} уже пройден, отмечаем как завершенный`);
        markSurveyAsCompleted(formId);
      }
      
      throw error;
    }
  },

  // Admin API methods
  getUserStats: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/overstat`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
