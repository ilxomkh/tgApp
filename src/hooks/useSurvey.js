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

  // Получение списка доступных опросов
  const getAvailableSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      // Используем новый сервис для получения форм
      const forms = await tallyApiService.getAvailableForms(language);
      
      const surveys = forms.map(form => ({
        id: form.id,
        title: form.title,
        type: 'tally',
        formUrl: form.url || tallyApiService.getFormUrl(language, form.formId),
        language: form.language, // Используем язык из данных формы, а не из контекста
        formId: form.formId,
        // Информация о призах
        prizeInfo: form.prizeInfo,
        // Описание для отображения
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
      // Сначала получаем список всех форм
      const forms = await tallyApiService.getAvailableForms(language);
      
      // Ищем форму по ID в списке доступных форм
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
        // Для совместимости с существующим кодом, возвращаем базовую структуру
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
      // Получаем formId из surveyId (предполагаем, что surveyId это formId)
      const formId = surveyId;
      
      // Получаем userId из AuthContext или localStorage
      const userId = user?.id || user?.user_id || null;
      
      console.log('🔍 Survey submission debug:', {
        formId,
        userId,
        user: user,
        hasUser: !!user,
        authTokenFromStorage: localStorage.getItem('auth_token'),
        authTokenFromUser: user?.token,
        sessionId: localStorage.getItem('session_id'),
        hasAuthTokenFromStorage: !!localStorage.getItem('auth_token'),
        hasAuthTokenFromUser: !!user?.token,
        hasSessionId: !!localStorage.getItem('session_id'),
        allLocalStorageKeys: Object.keys(localStorage)
      });

      // Получаем токены из разных источников
      const authToken = localStorage.getItem('auth_token') || user?.token || null;
      const sessionId = localStorage.getItem('session_id');
      
      // Подготавливаем данные для отправки в новом формате
      const submitData = {
        answers, // Передаем answers напрямую
        language,
        submittedAt: new Date().toISOString(),
        userId: userId, // Добавляем userId в данные
        // Добавляем данные для аутентификации
        sessionId: sessionId,
        authToken: authToken,
        // Попробуем добавить OTP код (может быть нужен для некоторых операций)
        otp: localStorage.getItem('last_otp') || null
      };

      console.log('📤 SubmitData prepared:', submitData);
      
      // Отправляем данные на новый endpoint с userId
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

  // =======================
  // Дополнительные методы для работы с Tally API
  // =======================

  // Получение ответов на форму
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

  // Синхронизация данных с Tally
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
