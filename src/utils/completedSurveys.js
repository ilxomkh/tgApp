/**
 * Утилита для отслеживания пройденных опросов
 * Сохраняет информацию о пройденных опросах в localStorage с привязкой к пользователю
 */

/**
 * Группы опросов по содержимому
 * Если пользователь прошел один опрос из группы, все остальные скрываются
 */
const SURVEY_GROUPS = {
  // Группа опросов знакомства/регистрации
  'registration': {
    name: 'Регистрация/Знакомство',
    surveys: ['3xqyg9', 'wbp8L6'], // русский и узбекский варианты
    description: 'Опросы знакомства на разных языках'
  }
};

/**
 * Получить группу опроса по его ID
 * @param {string} surveyId - ID опроса
 * @returns {string|null} ID группы или null если опрос не в группе
 */
const getSurveyGroup = (surveyId) => {
  for (const [groupId, group] of Object.entries(SURVEY_GROUPS)) {
    if (group.surveys.includes(surveyId)) {
      return groupId;
    }
  }
  return null;
};

/**
 * Проверить, пройден ли хотя бы один опрос из группы
 * @param {string} groupId - ID группы
 * @returns {boolean} true если хотя бы один опрос из группы пройден
 */
const isGroupCompleted = (groupId) => {
  const surveysInGroup = SURVEY_GROUPS[groupId]?.surveys || [];
  const completedSurveys = getCompletedSurveys();
  
  return surveysInGroup.some(surveyId => completedSurveys.includes(surveyId));
};

const COMPLETED_SURVEYS_KEY = 'completed_surveys';

/**
 * Получить ключ для пройденных опросов конкретного пользователя
 * @param {string|number} userId - ID пользователя
 * @returns {string} Ключ для localStorage
 */
const getUserCompletedSurveysKey = (userId) => {
  return `${COMPLETED_SURVEYS_KEY}_user_${userId}`;
};

/**
 * Получить ID текущего пользователя
 * @returns {string|null} ID пользователя или null
 */
const getCurrentUserId = () => {
  try {
    // Пробуем получить из localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id || userData.user_id || null;
    }
    
    // Пробуем получить из Telegram WebApp
    const tg = window?.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return String(tg.initDataUnsafe.user.id);
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при получении ID пользователя:', error);
    return null;
  }
};

/**
 * Получить список пройденных опросов для текущего пользователя
 * @returns {Array<string>} Массив ID пройденных опросов
 */
export const getCompletedSurveys = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('⚠️ ID пользователя не найден, возвращаем пустой список');
      return [];
    }
    
    const key = getUserCompletedSurveysKey(userId);
    const completed = localStorage.getItem(key);
    return completed ? JSON.parse(completed) : [];
  } catch (error) {
    console.error('Ошибка при получении пройденных опросов:', error);
    return [];
  }
};

/**
 * Добавить опрос в список пройденных для текущего пользователя
 * @param {string} surveyId - ID опроса
 */
export const markSurveyAsCompleted = (surveyId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('⚠️ ID пользователя не найден, не можем отметить опрос как пройденный');
      return;
    }
    
    const key = getUserCompletedSurveysKey(userId);
    const completed = getCompletedSurveys();
    
    // Отмечаем конкретный опрос как пройденный
    if (!completed.includes(surveyId)) {
      completed.push(surveyId);
      console.log(`✅ Опрос ${surveyId} отмечен как пройденный для пользователя ${userId}`);
      console.log(`📝 Обновленный список пройденных опросов:`, completed);
    } else {
      console.log(`ℹ️ Опрос ${surveyId} уже был отмечен как пройденный`);
    }
    
    // Проверяем группировку - если опрос входит в группу, отмечаем всю группу
    const groupId = getSurveyGroup(surveyId);
    if (groupId) {
      const surveysInGroup = SURVEY_GROUPS[groupId].surveys;
      surveysInGroup.forEach(groupSurveyId => {
        if (!completed.includes(groupSurveyId)) {
          completed.push(groupSurveyId);
          console.log(`✅ Опрос ${groupSurveyId} отмечен как пройденный из-за группировки (группа ${groupId})`);
        }
      });
    }
    
    localStorage.setItem(key, JSON.stringify(completed));
  } catch (error) {
    console.error('Ошибка при сохранении пройденного опроса:', error);
  }
};

/**
 * Проверить, пройден ли опрос текущим пользователем
 * @param {string} surveyId - ID опроса
 * @returns {boolean} true если опрос пройден
 */
export const isSurveyCompleted = (surveyId) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.log('⚠️ ID пользователя не найден, считаем опрос не пройденным');
    return false;
  }
  
  const completed = getCompletedSurveys();
  const isCompleted = completed.includes(surveyId);
  
  // Проверяем группировку - если один опрос из группы пройден, скрываем все
  const groupId = getSurveyGroup(surveyId);
  if (groupId && isGroupCompleted(groupId)) {
    console.log(`🔍 Проверка опроса ${surveyId} для пользователя ${userId}: скрыт из-за группировки (группа ${groupId})`);
    return true;
  }
  
  console.log(`🔍 Проверка опроса ${surveyId} для пользователя ${userId}: ${isCompleted ? 'пройден' : 'не пройден'}`);
  console.log(`📋 Список пройденных опросов:`, completed);
  return isCompleted;
};

/**
 * Удалить опрос из списка пройденных для текущего пользователя (для тестирования)
 * @param {string} surveyId - ID опроса
 */
export const unmarkSurveyAsCompleted = (surveyId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('⚠️ ID пользователя не найден, не можем удалить опрос из пройденных');
      return;
    }
    
    const key = getUserCompletedSurveysKey(userId);
    const completed = getCompletedSurveys();
    const filtered = completed.filter(id => id !== surveyId);
    localStorage.setItem(key, JSON.stringify(filtered));
    console.log(`❌ Опрос ${surveyId} удален из пройденных для пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка при удалении пройденного опроса:', error);
  }
};

/**
 * Очистить все пройденные опросы для текущего пользователя (для тестирования)
 */
export const clearCompletedSurveys = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('⚠️ ID пользователя не найден, не можем очистить пройденные опросы');
      return;
    }
    
    const key = getUserCompletedSurveysKey(userId);
    localStorage.removeItem(key);
    console.log(`🧹 Все пройденные опросы очищены для пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка при очистке пройденных опросов:', error);
  }
};

/**
 * Получить статистику пройденных опросов для текущего пользователя
 * @returns {Object} Статистика
 */
export const getCompletedSurveysStats = () => {
  const completed = getCompletedSurveys();
  const userId = getCurrentUserId();
  return {
    userId: userId,
    total: completed.length,
    surveys: completed
  };
};
