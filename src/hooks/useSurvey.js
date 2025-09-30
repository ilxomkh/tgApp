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
  const [surveyCache, setSurveyCache] = useState({});
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

      preloadSurveyDetails(surveys);
      
      return surveys;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [language]);

  const preloadSurveyDetails = useCallback(async (surveys) => {
    const preloadPromises = surveys.map(async (survey) => {
      try {
        const details = await tallyApiService.getFormDetails(survey.id);
        setSurveyCache(prev => ({
          ...prev,
          [survey.id]: {
            id: survey.id,
            title: details.title,
            type: 'tally',
            formUrl: tallyApiService.getFormUrl(language, details.formId),
            language,
            formId: details.formId,
            questions: details.questions
          }
        }));
      } catch (error) {
      }
    });

    await Promise.allSettled(preloadPromises);
  }, [language]);

  const getSurvey = useCallback(async (surveyId) => {
    if (surveyCache[surveyId]) {
      return surveyCache[surveyId];
    }

    setLoading(true);
    setError(null);
    
    try {
      const details = await tallyApiService.getFormDetails(surveyId);
      
      const survey = {
        id: surveyId,
        title: details.title,
        type: 'tally',
        formUrl: tallyApiService.getFormUrl(language, details.formId),
        language,
        formId: details.formId,
        questions: details.questions
      };

      setSurveyCache(prev => ({
        ...prev,
        [surveyId]: survey
      }));

      return survey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [language, surveyCache]);

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

      markSurveyAsCompleted(formId);

      return result;
      } catch (err) {
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
    error,
    surveyCache
  };
};
