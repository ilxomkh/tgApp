import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import tallyWebhookService from '../services/tallyWebhook.js';
import tallyApiService from '../services/tallyApi.js';
import api from '../services/api.js';
import config from '../config.js';

export const useSurvey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

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
        language,
        formId: form.formId,
        // Информация о призах
        prizeInfo: form.prizeInfo,
        // Описание для отображения
        displayInfo: {
          lines: [
            language === 'ru' 
              ? `Сумма приза: ${form.prizeInfo.basePrize} сум` 
              : `Yutuq summasi: ${form.prizeInfo.basePrize} so'm`,
            language === 'ru'
              ? `Участие в розыгрыше на ${form.prizeInfo.lotteryAmount} сум`
              : `${form.prizeInfo.lotteryAmount} so'm lotereyaga qo'shilish`
          ]
        }
      }));
      
      return surveys;
    } catch (err) {
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
      // Для Tally форм, отправляем данные на сервер для обработки
      const surveyData = {
        surveyId,
        language,
        answers,
        submittedAt: new Date().toISOString(),
      };

      // Отправляем данные на сервер
      const result = await api.processSurveyResponse(surveyData);
      
      return result;
    } catch (err) {
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
