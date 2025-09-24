import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import tallyWebhookService from '../services/tallyWebhook.js';
import tallyApiService from '../services/tallyApi.js';
import api from '../services/api.js';
import config from '../config.js';
import { markSurveyAsCompleted } from '../utils/completedSurveys.js';

export const useSurvey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  const getAvailableSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const forms = await tallyApiService.getAvailableForms(language);
      
      const surveys = forms.map(form => ({
        id: form.id,
        title: form.title,
        type: 'tally',
        formUrl: form.url || tallyApiService.getFormUrl(language, form.formId),
        language: form.language,
        formId: form.formId,
        prizeInfo: form.prizeInfo,
        displayInfo: {
          lines: [
            form.language === 'ru' 
              ? 'Сумма приза: 12 000 сум' 
              : 'Yutuq summasi: 12 000 so\'m',
          ]
        }
      }));
      
      
      return surveys;
    } catch (err) {
      console.error('❌ Ошибка при загрузке опросов:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [language]);

  const getSurvey = useCallback(async (surveyId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Получаем детали опроса напрямую с сервера
      const details = await tallyApiService.getFormDetails(surveyId);
      
      return {
        id: surveyId,
        title: details.title,
        type: 'tally',
        formUrl: tallyApiService.getFormUrl(language, details.formId),
        language,
        formId: details.formId,
        questions: details.questions
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [language]);

  const submitSurvey = useCallback(async (surveyId, answers) => {
    setLoading(true);
    setError(null);
    
    try {
      const formId = surveyId;
      
      const userId = user?.id || user?.user_id || null;

      const authToken = localStorage.getItem('auth_token') || user?.token || null;
      const sessionId = localStorage.getItem('session_id');

      const submitData = {
        answers,
        language,
        submittedAt: new Date().toISOString(),
        userId: userId,
        sessionId: sessionId,
        authToken: authToken,
        otp: localStorage.getItem('last_otp') || null
      };

      
      const result = await api.submitTallyForm(formId, submitData, userId);

      // Отмечаем опрос как пройденный при успешном завершении
      markSurveyAsCompleted(formId);

      return result;
    } catch (err) {
      console.error('❌ Ошибка при отправке опроса:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [language]);

  const getFormResponses = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tallyApiService.getFormResponses(formId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncTallyData = useCallback(async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tallyApiService.syncData(formId, 'sync');
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getSurvey,
    submitSurvey,
    getAvailableSurveys,
    getFormResponses,
    syncTallyData,
    loading,
    error
  };
};
