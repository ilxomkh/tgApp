import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import tallyWebhookService from '../services/tallyWebhook.js';
import tallyApiService from '../services/tallyApi.js';
import api from '../services/api.js';
import config from '../config.js';

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
              ? `Сумма приза: ${form.prizeInfo.basePrize} сум` 
              : `Yutuq summasi: ${form.prizeInfo.basePrize} so'm`,
            form.language === 'ru'
              ? `Участие в розыгрыше на ${form.prizeInfo.lotteryAmount} сум`
              : `${form.prizeInfo.lotteryAmount} so'm lotereyaga qo'shilish`
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
      const forms = await tallyApiService.getAvailableForms(language);
      
      const form = forms.find(f => f.id === surveyId);
      
      if (!form) {
        throw new Error(`Опрос с ID "${surveyId}" не найден`);
      }
      
      return {
        id: surveyId,
        title: form.title,
        type: 'tally',
        formUrl: form.url || tallyApiService.getFormUrl(language, form.formId),
        language,
        formId: form.formId,
        questions: [
          {
            id: 1,
            text: language === 'ru' ? 'Укажите свой пол' : 'Jinsingizni ko\'rsating',
            type: 'choice',
            required: true,
          },
          {
            id: 2,
            text: language === 'ru' ? 'Сколько вам лет?' : 'Yoshingiz nechchida?',
            type: 'number',
            required: true,
          }
        ]
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
