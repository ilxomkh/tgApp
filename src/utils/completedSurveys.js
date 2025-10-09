const SURVEY_GROUPS = {
  'registration': {
    name: 'Регистрация/Знакомство',
    surveys: ['3xqyg9', 'wbp8L6'],
    description: 'Опросы знакомства на разных языках'
  }
};

/**
 * @param {string} surveyId
 * @returns {string|null}
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
 * @param {string} groupId
 * @returns {boolean}
 */
const isGroupCompleted = (groupId) => {
  const surveysInGroup = SURVEY_GROUPS[groupId]?.surveys || [];
  const completedSurveys = getCompletedSurveys();
  
  return surveysInGroup.some(surveyId => completedSurveys.includes(surveyId));
};

const COMPLETED_SURVEYS_KEY = 'completed_surveys';

/**
 * @param {string|number} userId
 * @returns {string}
 */
const getUserCompletedSurveysKey = (userId) => {
  return `${COMPLETED_SURVEYS_KEY}_user_${userId}`;
};

/**
 * @returns {string|null}
 */
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id || userData.user_id || null;
    }
    
    const tg = window?.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return String(tg.initDataUnsafe.user.id);
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * @returns {Array<string>}
 */
export const getCompletedSurveys = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return [];
    }
    
    const key = getUserCompletedSurveysKey(userId);
    const completed = localStorage.getItem(key);
    return completed ? JSON.parse(completed) : [];
  } catch (error) {
    return [];
  }
};

/**
 * @param {string} surveyId
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
    
    if (!completed.includes(surveyId)) {
      completed.push(surveyId);

    } else {}
    
    const groupId = getSurveyGroup(surveyId);
    if (groupId) {
      const surveysInGroup = SURVEY_GROUPS[groupId].surveys;
      surveysInGroup.forEach(groupSurveyId => {
        if (!completed.includes(groupSurveyId)) {
          completed.push(groupSurveyId);
        }
      });
    }
    
    localStorage.setItem(key, JSON.stringify(completed));
  } catch (error) {}
};

/**
 * @param {string} surveyId
 * @returns {boolean}
 */
export const isSurveyCompleted = (surveyId) => {
  const userId = getCurrentUserId();
  if (!userId) {
    return false;
  }
  
  const completed = getCompletedSurveys();
  const isCompleted = completed.includes(surveyId);
  
  const groupId = getSurveyGroup(surveyId);
  if (groupId && isGroupCompleted(groupId)) {
    return true;
  }
  return isCompleted;
};

/**
 * @param {string} surveyId
 */
export const unmarkSurveyAsCompleted = (surveyId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return;
    }
    
    const key = getUserCompletedSurveysKey(userId);
    const completed = getCompletedSurveys();
    const filtered = completed.filter(id => id !== surveyId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
  }
};

export const clearCompletedSurveys = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return;
    }
    
    const key = getUserCompletedSurveysKey(userId);
    localStorage.removeItem(key);
  } catch (error) {}
};

/**
 * @returns {Object}
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
