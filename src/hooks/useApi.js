import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import config from '../config';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const requestOtp = useCallback(async (phoneNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.requestOtp(phoneNumber);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phoneNumber, code) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.verifyOtp(phoneNumber, code);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getUserProfile();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get user profile';
      setError(errorMessage);
      
      // 401 ошибка уже обрабатывается глобально в API сервисе
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.updateUserProfile(userData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update user profile';
      setError(errorMessage);
      
      // 401 ошибка уже обрабатывается глобально в API сервисе
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getRaffles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getRaffles();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get raffles';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getCards();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get cards';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const addCard = useCallback(async (cardNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.addCard(cardNumber);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to add card';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getInviteStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getInviteStats();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get invite stats';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.createOrder(orderData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create order';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.createPayment(paymentData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create payment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // =======================
  // Tally API методы
  // =======================

  const getTallyForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyForms();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get Tally forms';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTallyFormById = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyFormById(formId);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get Tally form';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTallyFormResponses = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyFormResponses(formId);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get Tally form responses';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const syncTallyData = useCallback(async (syncData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.syncTallyData(syncData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sync Tally data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    requestOtp,
    verifyOtp,
    getUserProfile,
    updateUserProfile,
    getRaffles,
    getCards,
    addCard,
    getInviteStats,
    createOrder,
    createPayment,
    // Tally API методы
    getTallyForms,
    getTallyFormById,
    getTallyFormResponses,
    syncTallyData,
    clearError,
  };
};

export default useApi;
