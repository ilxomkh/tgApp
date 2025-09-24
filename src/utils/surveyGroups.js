/**
 * Утилита для группировки опросов по содержимому
 * Позволяет скрывать опросы на других языках, если один уже пройден
 */

const SURVEY_GROUPS_KEY = 'survey_groups';

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
  // Можно добавить другие группы в будущем
};

/**
 * Получить группу опроса по его ID
 * @param {string} surveyId - ID опроса
 * @returns {string|null} ID группы или null если опрос не в группе
 */
export const getSurveyGroup = (surveyId) => {
  for (const [groupId, group] of Object.entries(SURVEY_GROUPS)) {
    if (group.surveys.includes(surveyId)) {
      return groupId;
    }
  }
  return null;
};

/**
 * Получить все опросы из группы
 * @param {string} groupId - ID группы
 * @returns {Array<string>} Массив ID опросов в группе
 */
export const getSurveysInGroup = (groupId) => {
  return SURVEY_GROUPS[groupId]?.surveys || [];
};

/**
 * Получить все группы опросов
 * @returns {Object} Объект с группами опросов
 */
export const getAllSurveyGroups = () => {
  return SURVEY_GROUPS;
};

/**
 * Проверить, пройден ли хотя бы один опрос из группы
 * @param {string} groupId - ID группы
 * @returns {boolean} true если хотя бы один опрос из группы пройден
 */
export const isGroupCompleted = (groupId) => {
  const surveysInGroup = getSurveysInGroup(groupId);
  const completedSurveys = getCompletedSurveys();
  
  return surveysInGroup.some(surveyId => completedSurveys.includes(surveyId));
};

/**
 * Проверить, должен ли опрос быть скрыт из-за группы
 * @param {string} surveyId - ID опроса
 * @returns {boolean} true если опрос должен быть скрыт
 */
export const shouldHideSurveyDueToGroup = (surveyId) => {
  const groupId = getSurveyGroup(surveyId);
  if (!groupId) {
    return false; // Опрос не в группе, не скрываем
  }
  
  return isGroupCompleted(groupId);
};

/**
 * Получить статистику по группам опросов
 * @returns {Object} Статистика по группам
 */
export const getSurveyGroupsStats = () => {
  const stats = {};
  
  for (const [groupId, group] of Object.entries(SURVEY_GROUPS)) {
    const surveysInGroup = group.surveys;
    const completedSurveys = getCompletedSurveys();
    const completedInGroup = surveysInGroup.filter(id => completedSurveys.includes(id));
    
    stats[groupId] = {
      name: group.name,
      total: surveysInGroup.length,
      completed: completedInGroup.length,
      surveys: surveysInGroup,
      completedSurveys: completedInGroup,
      isCompleted: completedInGroup.length > 0
    };
  }
  
  return stats;
};

/**
 * Отметить все опросы в группе как пройденные
 * @param {string} groupId - ID группы
 */
export const markGroupAsCompleted = (groupId) => {
  const surveysInGroup = getSurveysInGroup(groupId);
  surveysInGroup.forEach(surveyId => {
    markSurveyAsCompleted(surveyId);
  });
  console.log(`📝 Группа ${groupId} отмечена как пройденная (${surveysInGroup.length} опросов)`);
};

/**
 * Убрать все опросы группы из пройденных
 * @param {string} groupId - ID группы
 */
export const unmarkGroupAsCompleted = (groupId) => {
  const surveysInGroup = getSurveysInGroup(groupId);
  surveysInGroup.forEach(surveyId => {
    unmarkSurveyAsCompleted(surveyId);
  });
  console.log(`❌ Группа ${groupId} убрана из пройденных (${surveysInGroup.length} опросов)`);
};

// Импортируем функции из completedSurveys.js
import { 
  getCompletedSurveys, 
  markSurveyAsCompleted, 
  unmarkSurveyAsCompleted 
} from './completedSurveys.js';
