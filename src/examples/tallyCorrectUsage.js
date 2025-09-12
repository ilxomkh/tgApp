/**
 * Пример правильного использования Tally API
 * Демонстрирует разницу между внутренними ID и реальными ID Tally
 */

import { useApi } from '../hooks/useApi.js';
import { useSurvey } from '../hooks/useSurvey.js';
import tallyApiService from '../services/tallyApi.js';

export const TallyApiCorrectUsage = () => {
  const { getTallyForms, getTallyFormById, loading: apiLoading, error: apiError } = useApi();
  const { getAvailableSurveys, getSurvey, loading: surveyLoading, error: surveyError } = useSurvey();

  // ✅ ПРАВИЛЬНО: Получение всех форм с сервера
  const handleGetAllForms = async () => {
    try {
      console.log('=== Получение всех форм с сервера ===');
      const result = await getTallyForms();
      
      if (result.success) {
        console.log('Формы получены успешно:', result.data);
        
        // Выводим информацию о каждой форме
        result.data.forEach(form => {
          console.log(`Форма: ${form.title}`);
          console.log(`Реальный ID Tally: ${form.id}`);
          console.log(`URL: ${form.url || `https://tally.so/forms/${form.id}`}`);
          console.log('---');
        });
        
        return result.data;
      } else {
        console.error('Ошибка при получении форм:', result.error);
      }
    } catch (error) {
      console.error('Критическая ошибка:', error);
    }
  };

  // ✅ ПРАВИЛЬНО: Получение конкретной формы по реальному ID Tally
  const handleGetFormByRealId = async (realFormId) => {
    try {
      console.log(`=== Получение формы по реальному ID: ${realFormId} ===`);
      const result = await getTallyFormById(realFormId);
      
      if (result.success) {
        console.log('Форма получена успешно:', result.data);
        return result.data;
      } else {
        console.error('Ошибка при получении формы:', result.error);
      }
    } catch (error) {
      console.error('Критическая ошибка:', error);
    }
  };

  // ✅ ПРАВИЛЬНО: Использование внутренних ID через хуки (с fallback)
  const handleGetSurveyByInternalId = async (internalId) => {
    try {
      console.log(`=== Получение опроса по внутреннему ID: ${internalId} ===`);
      const survey = await getSurvey(internalId);
      console.log('Опрос получен успешно:', survey);
      return survey;
    } catch (error) {
      console.error('Ошибка при получении опроса:', error);
    }
  };

  // ✅ ПРАВИЛЬНО: Получение доступных опросов (автоматический fallback)
  const handleGetAvailableSurveys = async () => {
    try {
      console.log('=== Получение доступных опросов ===');
      const surveys = await getAvailableSurveys();
      console.log('Доступные опросы:', surveys);
      return surveys;
    } catch (error) {
      console.error('Ошибка при получении опросов:', error);
    }
  };

  // ❌ НЕПРАВИЛЬНО: Попытка использовать внутренний ID в API
  const handleWrongUsage = async () => {
    try {
      console.log('=== НЕПРАВИЛЬНОЕ использование (для демонстрации) ===');
      console.log('Попытка получить форму по внутреннему ID "registration"...');
      
      const result = await getTallyFormById('registration'); // Это вызовет ошибку 500!
      
      if (result.success) {
        console.log('Неожиданно сработало:', result.data);
      } else {
        console.log('Ожидаемая ошибка:', result.error);
      }
    } catch (error) {
      console.log('Ожидаемая ошибка:', error.message);
    }
  };

  // Демонстрация правильного workflow
  const handleCorrectWorkflow = async () => {
    try {
      console.log('=== ПРАВИЛЬНЫЙ WORKFLOW ===');
      
      // Шаг 1: Получаем все формы с сервера
      const forms = await handleGetAllForms();
      
      if (forms && forms.length > 0) {
        const firstForm = forms[0];
        const realId = firstForm.id;
        
        console.log(`Используем реальный ID: ${realId}`);
        
        // Шаг 2: Получаем конкретную форму по реальному ID
        await handleGetFormByRealId(realId);
        
        // Шаг 3: Получаем доступные опросы (для UI)
        await handleGetAvailableSurveys();
        
        // Шаг 4: Получаем опрос по внутреннему ID (для совместимости)
        await handleGetSurveyByInternalId('registration');
      }
    } catch (error) {
      console.error('Ошибка в workflow:', error);
    }
  };

  // Получение маппинга ID форм
  const handleGetIdMapping = async () => {
    try {
      console.log('=== Получение маппинга ID форм ===');
      const mapping = await tallyApiService.getFormIdMapping();
      console.log('Маппинг ID форм:', mapping);
      return mapping;
    } catch (error) {
      console.error('Ошибка при получении маппинга:', error);
    }
  };

  return {
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading: apiLoading || surveyLoading,
    error: apiError || surveyError
  };
};

// Пример использования в компоненте
export const TallyUsageExample = () => {
  const {
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading,
    error
  } = TallyApiCorrectUsage();

  const runAllExamples = async () => {
    console.log('🚀 Запуск всех примеров использования Tally API');
    
    // Правильный workflow
    await handleCorrectWorkflow();
    
    // Получение маппинга
    await handleGetIdMapping();
    
    // Демонстрация неправильного использования
    await handleWrongUsage();
    
    console.log('✅ Все примеры завершены');
  };

  return {
    runAllExamples,
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading,
    error
  };
};

export default TallyApiCorrectUsage;
