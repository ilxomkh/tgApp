import config from '../config.js';

const API_BASE_URL = config.API_BASE_URL;

const getHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem('auth_token');
  const sessionId = localStorage.getItem('session_id');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'x-session-id': sessionId }),
    ...additionalHeaders
  };
  
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
    
    // Добавляем дополнительную информацию для отладки
    console.error('API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData: errorData
    });
    
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
      throw new Error('Request timeout');
    }
    throw error;
  }
};

export const adminApi = {
  // GET /admin/users/ - получить список пользователей с пагинацией
  getUsers: async (page = 1, limit = 20) => {
    const url = `${API_BASE_URL}/admin/users/?page=${page}&limit=${limit}`;
    console.log('Fetching users list:', { page, limit, url });
    
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // GET /admin/users/{id} - получить детальную информацию о пользователе
  getUserById: async (userId) => {
    const url = `${API_BASE_URL}/admin/users/${userId}`;
    console.log('Fetching user by ID:', { userId, url });
    
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // GET /admin/users/{id}/sources - получить источники пользователя
  getUserSources: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/sources`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // GET /admin/users/{id}/stats - получить статистику пользователя
  getUserStats: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // GET /admin/users/{id}/referrals - получить реферальную информацию пользователя
  getUserReferrals: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/referrals`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // GET /admin/users/{id}/balance - получить баланс пользователя
  getUserBalance: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/balance`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // POST /api/raffles/ - создать новый розыгрыш
  createRaffle: async (raffleData) => {
    const url = `${API_BASE_URL}/raffles/`;
    console.log('Creating raffle:', { raffleData, url });
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(raffleData),
    });
    return handleResponse(response);
  }
};

export default adminApi;
