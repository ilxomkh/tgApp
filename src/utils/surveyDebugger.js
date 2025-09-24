/**
 * Утилита для диагностики проблем с опросами
 * Помогает выявить причины исчезновения опросов
 */

import { getCompletedSurveys, isSurveyCompleted } from './completedSurveys.js';
import { getSurveyGroup, shouldHideSurveyDueToGroup, getAllSurveyGroups } from './surveyGroups.js';
import api from '../services/api.js';

export class SurveyDebugger {
  constructor() {
    this.debugMode = true;
  }

  /**
   * Полная диагностика состояния опросов
   */
  async diagnoseSurveyIssues() {
    console.log('🔍 Начинаем диагностику проблем с опросами...');
    
    const results = {
      localStorage: this.checkLocalStorage(),
      surveyGroups: this.checkSurveyGroups(),
      apiStatus: await this.checkApiStatus(),
      recommendations: []
    };

    // Анализируем результаты и даем рекомендации
    results.recommendations = this.generateRecommendations(results);

    console.log('📊 Результаты диагностики:', results);
    return results;
  }

  /**
   * Проверяем состояние localStorage
   */
  checkLocalStorage() {
    const completedSurveys = getCompletedSurveys();
    const authToken = localStorage.getItem('auth_token');
    const sessionId = localStorage.getItem('session_id');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return {
      completedSurveys,
      hasAuthToken: !!authToken,
      hasSessionId: !!sessionId,
      hasUser: !!user.id,
      userInfo: user
    };
  }

  /**
   * Проверяем состояние групп опросов
   */
  checkSurveyGroups() {
    const allGroups = getAllSurveyGroups();
    const groupStats = {};

    for (const [groupId, group] of Object.entries(allGroups)) {
      const completedInGroup = group.surveys.filter(surveyId => 
        isSurveyCompleted(surveyId)
      );

      groupStats[groupId] = {
        name: group.name,
        surveys: group.surveys,
        completed: completedInGroup,
        isGroupCompleted: completedInGroup.length > 0
      };
    }

    return groupStats;
  }

  /**
   * Проверяем статус API
   */
  async checkApiStatus() {
    try {
      // Проверяем доступность основного API
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'x-session-id': localStorage.getItem('session_id')
        }
      });

      return {
        apiAvailable: response.ok,
        status: response.status,
        error: response.ok ? null : await response.text()
      };
    } catch (error) {
      return {
        apiAvailable: false,
        error: error.message
      };
    }
  }

  /**
   * Генерируем рекомендации на основе диагностики
   */
  generateRecommendations(results) {
    const recommendations = [];

    // Проверяем localStorage
    if (!results.localStorage.hasAuthToken) {
      recommendations.push({
        type: 'error',
        message: 'Отсутствует токен авторизации. Необходимо войти в систему.',
        action: 'Попробуйте перезайти в приложение'
      });
    }

    if (!results.localStorage.hasSessionId) {
      recommendations.push({
        type: 'warning',
        message: 'Отсутствует ID сессии. Это может влиять на отображение опросов.',
        action: 'Обновите страницу'
      });
    }

    // Проверяем группы опросов
    for (const [groupId, group] of Object.entries(results.surveyGroups)) {
      if (group.isGroupCompleted) {
        recommendations.push({
          type: 'info',
          message: `Группа "${group.name}" уже пройдена. Опросы ${group.completed.join(', ')} скрыты.`,
          action: 'Это нормальное поведение - опросы из группы скрываются после прохождения одного из них'
        });
      }
    }

    // Проверяем API
    if (!results.apiStatus.apiAvailable) {
      recommendations.push({
        type: 'error',
        message: 'API недоступен. Опросы не могут быть загружены.',
        action: 'Проверьте подключение к интернету и попробуйте позже'
      });
    }

    return recommendations;
  }

  /**
   * Проверяем конкретный опрос
   */
  async checkSpecificSurvey(surveyId) {
    console.log(`🔍 Проверяем опрос ${surveyId}...`);

    const checks = {
      isCompleted: isSurveyCompleted(surveyId),
      group: getSurveyGroup(surveyId),
      shouldHide: shouldHideSurveyDueToGroup(surveyId),
      apiStatus: await this.checkSurveyApiStatus(surveyId)
    };

    console.log(`📊 Результат проверки опроса ${surveyId}:`, checks);
    return checks;
  }

  /**
   * Проверяем статус опроса через API
   */
  async checkSurveyApiStatus(surveyId) {
    try {
      const response = await api.getTallyFormById(surveyId);
      return {
        available: true,
        data: response
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }

  /**
   * Сбрасываем состояние опросов (для тестирования)
   */
  resetSurveyState() {
    localStorage.removeItem('completed_surveys');
    localStorage.removeItem('survey_groups');
    console.log('🧹 Состояние опросов сброшено');
  }

  /**
   * Принудительно показываем все опросы (игнорируем группировку)
   */
  enableDebugMode() {
    this.debugMode = true;
    console.log('🐛 Режим отладки включен - все опросы будут показаны');
  }

  /**
   * Отключаем режим отладки
   */
  disableDebugMode() {
    this.debugMode = false;
    console.log('✅ Режим отладки отключен');
  }
}

// Создаем глобальный экземпляр для использования в консоли
const surveyDebugger = new SurveyDebugger();

// Экспортируем для использования в коде
export default surveyDebugger;

// Делаем доступным в глобальной области для консоли браузера
if (typeof window !== 'undefined') {
  window.surveyDebugger = surveyDebugger;
}
