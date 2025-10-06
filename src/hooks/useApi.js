import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import config from '../config';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, resetToOnboarding } = useAuth();

  const handleApiError = useCallback((err) => {
    const errorMessage = err.message || 'API request failed';
    setError(errorMessage);
    

    if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
      resetToOnboarding();
    }
    
    return { success: false, error: errorMessage };
  }, [resetToOnboarding]);

  const requestOtp = useCallback(async (phoneNumber, referralCode = null, language = 'ru', source = 'telegram') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.requestOtp(phoneNumber, referralCode, language, source);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const verifyOtp = useCallback(async (phoneNumber, code) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.verifyOtp(phoneNumber, code);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getUserProfile();
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const updateUserProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.updateUserProfile(userData);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getRaffles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getRaffles();
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getCards();
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const addCard = useCallback(async (cardNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.addCard(cardNumber);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getInviteStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getInviteStats();
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.createOrder(orderData);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const createPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.createPayment(paymentData);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getTallyForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyForms();
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getTallyFormById = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyFormById(formId);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const getTallyFormResponses = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getTallyFormResponses(formId);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const syncTallyData = useCallback(async (syncData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.syncTallyData(syncData);
      return { success: true, data: result };
    } catch (err) {
      return handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [handleApiError]);

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
    getTallyForms,
    getTallyFormById,
    getTallyFormResponses,
    syncTallyData,
    clearError,
  };
};

export default useApi;
