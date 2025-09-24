/**
 * Утилита для отслеживания пройденных опросов
 * Сохраняет информацию о пройденных опросах в localStorage
 */

const COMPLETED_SURVEYS_KEY = 'completed_surveys';

/**
 * Получить список пройденных опросов
 * @returns {Array<string>} Массив ID пройденных опросов
 */
export const getCompletedSurveys = () => {
  try {
    const completed = localStorage.getItem(COMPLETED_SURVEYS_KEY);
    return completed ? JSON.parse(completed) : [];
  } catch (error) {
    console.error('Ошибка при получении пройденных опросов:', error);
    return [];
  }
};

/**
 * Добавить опрос в список пройденных
 * @param {string} surveyId - ID опроса
 */
export const markSurveyAsCompleted = (surveyId) => {
  try {
    const completed = getCompletedSurveys();
    if (!completed.includes(surveyId)) {
      completed.push(surveyId);
      localStorage.setItem(COMPLETED_SURVEYS_KEY, JSON.stringify(completed));
      console.log(`✅ Опрос ${surveyId} отмечен как пройденный`);
    }
  } catch (error) {
    console.error('Ошибка при сохранении пройденного опроса:', error);
  }
};

/**
 * Проверить, пройден ли опрос
 * @param {string} surveyId - ID опроса
 * @returns {boolean} true если опрос пройден
 */
export const isSurveyCompleted = (surveyId) => {
  const completed = getCompletedSurveys();
  return completed.includes(surveyId);
};

/**
 * Удалить опрос из списка пройденных (для тестирования)
 * @param {string} surveyId - ID опроса
 */
export const unmarkSurveyAsCompleted = (surveyId) => {
  try {
    const completed = getCompletedSurveys();
    const filtered = completed.filter(id => id !== surveyId);
    localStorage.setItem(COMPLETED_SURVEYS_KEY, JSON.stringify(filtered));
    console.log(`❌ Опрос ${surveyId} удален из пройденных`);
  } catch (error) {
    console.error('Ошибка при удалении пройденного опроса:', error);
  }
};

/**
 * Очистить все пройденные опросы (для тестирования)
 */
export const clearCompletedSurveys = () => {
  try {
    localStorage.removeItem(COMPLETED_SURVEYS_KEY);
    console.log('🧹 Все пройденные опросы очищены');
  } catch (error) {
    console.error('Ошибка при очистке пройденных опросов:', error);
  }
};

/**
 * Получить статистику пройденных опросов
 * @returns {Object} Статистика
 */
export const getCompletedSurveysStats = () => {
  const completed = getCompletedSurveys();
  return {
    total: completed.length,
    surveys: completed
  };
};
