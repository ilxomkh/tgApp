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
  getUsers: async (page = 1, limit = 20) => {
    const url = `${API_BASE_URL}/admin/users/?page=${page}&limit=${limit}`;
    
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserById: async (userId) => {
    const url = `${API_BASE_URL}/admin/users/${userId}`;
    
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserSources: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/sources`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserStats: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserReferrals: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/referrals`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserBalance: async (userId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}/balance`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createRaffle: async (raffleData) => {
    const url = `${API_BASE_URL}/raffles/`;
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(raffleData),
    });
    return handleResponse(response);
  },

  sendBroadcast: async (formData) => {
    const url = `${API_BASE_URL}/broadcast/broadcast/`;
    
    const headers = getHeaders();
    delete headers['Content-Type'];
    
    headers['X-Secret'] = 'ProSurvey123#@!';
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    return handleResponse(response);
  },

  getBalances: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/balances`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export default adminApi;
