/**
 * Пример использования новых Tally API методов
 * Этот файл демонстрирует, как использовать новые API endpoints для работы с Tally через сервер
 */

import { useSurvey } from '../hooks/useSurvey.js';
import { useApi } from '../hooks/useApi.js';
import tallyApiService from '../services/tallyApi.js';

// Пример компонента для работы с опросами через серверный API
export const SurveyManager = () => {
  const { 
    getAvailableSurveys, 
    getSurvey, 
    getFormResponses, 
    syncTallyData,
    loading, 
    error 
  } = useSurvey();

  const { 
    getTallyForms, 
    getTallyFormById, 
    getTallyFormResponses, 
    syncTallyData: syncData 
  } = useApi();

  // Получение списка доступных опросов
  const handleGetSurveys = async () => {
    try {
      console.log('Получение списка опросов...');
      const surveys = await getAvailableSurveys();
      console.log('Доступные опросы:', surveys);
      return surveys;
    } catch (error) {
      console.error('Ошибка при получении опросов:', error);
    }
  };

  // Получение конкретного опроса
  const handleGetSurvey = async (surveyId) => {
    try {
      console.log(`Получение опроса ${surveyId}...`);
      const survey = await getSurvey(surveyId);
      console.log('Данные опроса:', survey);
      return survey;
    } catch (error) {
      console.error('Ошибка при получении опроса:', error);
    }
  };

  // Получение ответов на форму
  const handleGetResponses = async (formId) => {
    try {
      console.log(`Получение ответов для формы ${formId}...`);
      const responses = await getFormResponses(formId);
      console.log('Ответы на форму:', responses);
      return responses;
    } catch (error) {
      console.error('Ошибка при получении ответов:', error);
    }
  };

  // Синхронизация данных с Tally
  const handleSyncData = async (formId) => {
    try {
      console.log(`Синхронизация данных для формы ${formId}...`);
      const result = await syncTallyData(formId);
      console.log('Результат синхронизации:', result);
      return result;
    } catch (error) {
      console.error('Ошибка при синхронизации:', error);
    }
  };

  // Прямое использование API методов
  const handleDirectApiCall = async () => {
    try {
      console.log('Прямой вызов API...');
      
      // Получение всех форм
      const formsResult = await getTallyForms();
      console.log('Формы через API:', formsResult);

      if (formsResult.success && formsResult.data.length > 0) {
        const firstForm = formsResult.data[0];
        
        // Получение конкретной формы
        const formResult = await getTallyFormById(firstForm.id);
        console.log('Форма через API:', formResult);

        // Получение ответов
        const responsesResult = await getTallyFormResponses(firstForm.id);
        console.log('Ответы через API:', responsesResult);

        // Синхронизация
        const syncResult = await syncData({ formId: firstForm.id, action: 'sync' });
        console.log('Синхронизация через API:', syncResult);
      }
    } catch (error) {
      console.error('Ошибка при прямом вызове API:', error);
    }
  };

  // Проверка доступности серверного API
  const checkApiAvailability = async () => {
    try {
      const isAvailable = await tallyApiService.isServerApiAvailable();
      console.log('Серверный API доступен:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Ошибка при проверке API:', error);
      return false;
    }
  };

  return {
    handleGetSurveys,
    handleGetSurvey,
    handleGetResponses,
    handleSyncData,
    handleDirectApiCall,
    checkApiAvailability,
    loading,
    error
  };
};

// Пример использования в компоненте
export const SurveyExample = () => {
  const surveyManager = SurveyManager();

  const handleTestAll = async () => {
    console.log('=== Тестирование Tally API ===');
    
    // Проверяем доступность API
    const isApiAvailable = await surveyManager.checkApiAvailability();
    
    if (isApiAvailable) {
      console.log('API доступен, продолжаем тестирование...');
      
      // Получаем список опросов
      const surveys = await surveyManager.handleGetSurveys();
      
      if (surveys && surveys.length > 0) {
        const firstSurvey = surveys[0];
        
        // Получаем данные опроса
        await surveyManager.handleGetSurvey(firstSurvey.id);
        
        // Получаем ответы
        await surveyManager.handleGetResponses(firstSurvey.formId);
        
        // Синхронизируем данные
        await surveyManager.handleSyncData(firstSurvey.formId);
      }
    } else {
      console.log('API недоступен, используем fallback...');
      
      // Все равно пытаемся получить опросы (будет использован fallback)
      await surveyManager.handleGetSurveys();
    }
    
    console.log('=== Тестирование завершено ===');
  };

  return {
    handleTestAll,
    loading: surveyManager.loading,
    error: surveyManager.error
  };
};

export default SurveyManager;
