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
      const result = await getTallyForms();
      
      if (result.success) {
        
        // Выводим информацию о каждой форме
        result.data.forEach(form => {
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
      const result = await getTallyFormById(realFormId);
      
      if (result.success) {
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
      const survey = await getSurvey(internalId);
      return survey;
    } catch (error) {
      console.error('Ошибка при получении опроса:', error);
    }
  };

  // ✅ ПРАВИЛЬНО: Получение доступных опросов (автоматический fallback)
  const handleGetAvailableSurveys = async () => {
    try {
      const surveys = await getAvailableSurveys();
      return surveys;
    } catch (error) {
      console.error('Ошибка при получении опросов:', error);
    }
  };

  // ❌ НЕПРАВИЛЬНО: Попытка использовать внутренний ID в API
  const handleWrongUsage = async () => {
    try {
      
      const result = await getTallyFormById('registration'); // Это вызовет ошибку 500!
      
      if (result.success) {
      } else {
      }
    } catch (error) {
      console.error('Ожидаемая ошибка:', error.message);
    }
  };

  // Демонстрация правильного workflow
  const handleCorrectWorkflow = async () => {
    try {
      
      // Шаг 1: Получаем все формы с сервера
      const forms = await handleGetAllForms();
      
      if (forms && forms.length > 0) {
        const firstForm = forms[0];
        const realId = firstForm.id;
        
        
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
      const mapping = await tallyApiService.getFormIdMapping();
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
    
    // Правильный workflow
    await handleCorrectWorkflow();
    
    // Получение маппинга
    await handleGetIdMapping();
    
    // Демонстрация неправильного использования
    await handleWrongUsage();
    
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
