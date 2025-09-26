import api from './api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Сервис для трекинга действий пользователей
 * Отправляет данные о действиях пользователя на бекенд для анализа
 */
class TrackingService {
  constructor() {
    this.isEnabled = true;
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 секунда
  }

  /**
   * Включает/выключает трекинг
   * @param {boolean} enabled - включить или выключить трекинг
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Трекает действие пользователя
   * @param {string} actionName - название действия
   * @param {Object} context - дополнительный контекст
   * @param {boolean} immediate - отправить немедленно или добавить в очередь
   */
  async track(actionName, context = {}, immediate = false) {
    if (!this.isEnabled) {
      return;
    }

    // Проверяем, что пользователь аутентифицирован
    const user = localStorage.getItem('user');
    const sessionId = localStorage.getItem('session_id');
    
    if (!user || !sessionId) {
      console.warn('User not authenticated, skipping tracking action:', actionName);
      return;
    }

    const action = {
      action_name: actionName,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
      }
    };

    if (immediate) {
      return this.sendAction(action);
    } else {
      this.queue.push(action);
      this.processQueue();
    }
  }

  /**
   * Обрабатывает очередь действий
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const action = this.queue.shift();
      try {
        await this.sendAction(action);
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Failed to track action:', action.action_name, error);
        // Возвращаем действие в очередь для повторной попытки
        this.queue.unshift(action);
        break;
      }
    }

    this.isProcessing = false;
  }

  /**
   * Отправляет действие на сервер
   * @param {Object} action - действие для отправки
   * @param {number} retryCount - количество попыток
   */
  async sendAction(action, retryCount = 0) {
    try {
      // Проверяем наличие session_id перед отправкой
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        console.warn('No session_id found, skipping tracking action:', action.action_name);
        return;
      }

      await api.trackUserAction(action.action_name, action.context);
    } catch (error) {
      console.error('Failed to track action:', action.action_name, error);
      
      if (retryCount < this.maxRetries) {
        // Экспоненциальная задержка для повторных попыток
        const delay = this.retryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendAction(action, retryCount + 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Трекает навигацию между страницами
   * @param {string} from - откуда перешел пользователь
   * @param {string} to - куда перешел пользователь
   */
  trackNavigation(from, to) {
    this.track('page_navigation', {
      from_page: from,
      to_page: to,
      navigation_type: 'route_change'
    });
  }

  /**
   * Трекает клики по кнопкам
   * @param {string} buttonName - название кнопки
   * @param {string} location - где находится кнопка
   * @param {Object} additionalContext - дополнительный контекст
   */
  trackButtonClick(buttonName, location, additionalContext = {}) {
    this.track('button_click', {
      button_name: buttonName,
      location: location,
      ...additionalContext
    });
  }

  /**
   * Трекает открытие модальных окон
   * @param {string} modalName - название модального окна
   * @param {Object} context - контекст открытия
   */
  trackModalOpen(modalName, context = {}) {
    this.track('modal_open', {
      modal_name: modalName,
      ...context
    });
  }

  /**
   * Трекает закрытие модальных окон
   * @param {string} modalName - название модального окна
   * @param {string} closeMethod - как было закрыто (button, backdrop, escape)
   */
  trackModalClose(modalName, closeMethod = 'unknown') {
    this.track('modal_close', {
      modal_name: modalName,
      close_method: closeMethod
    });
  }

  /**
   * Трекает отправку форм
   * @param {string} formName - название формы
   * @param {Object} formData - данные формы (без чувствительной информации)
   * @param {boolean} success - успешность отправки
   */
  trackFormSubmit(formName, formData = {}, success = true) {
    this.track('form_submit', {
      form_name: formName,
      form_data: formData,
      success: success
    });
  }

  /**
   * Трекает ошибки
   * @param {string} errorType - тип ошибки
   * @param {string} errorMessage - сообщение об ошибке
   * @param {Object} context - контекст ошибки
   */
  trackError(errorType, errorMessage, context = {}) {
    this.track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...context
    });
  }

  /**
   * Трекает время, проведенное на странице
   * @param {string} pageName - название страницы
   * @param {number} timeSpent - время в миллисекундах
   */
  trackTimeOnPage(pageName, timeSpent) {
    this.track('time_on_page', {
      page_name: pageName,
      time_spent_ms: timeSpent,
      time_spent_seconds: Math.round(timeSpent / 1000)
    });
  }

  /**
   * Трекает взаимодействие с опросами
   * @param {string} action - действие (start, complete, abandon)
   * @param {string} surveyId - ID опроса
   * @param {Object} context - дополнительный контекст
   */
  trackSurveyAction(action, surveyId, context = {}) {
    this.track('survey_action', {
      action: action,
      survey_id: surveyId,
      ...context
    });
  }

  /**
   * Трекает действия с профилем пользователя
   * @param {string} action - действие (view, edit, save)
   * @param {Object} context - контекст действия
   */
  trackProfileAction(action, context = {}) {
    this.track('profile_action', {
      action: action,
      ...context
    });
  }

  /**
   * Трекает действия с реферальной программой
   * @param {string} action - действие (view, share, copy_code)
   * @param {Object} context - контекст действия
   */
  trackReferralAction(action, context = {}) {
    this.track('referral_action', {
      action: action,
      ...context
    });
  }

  /**
   * Трекает действия с платежами
   * @param {string} action - действие (initiate, complete, fail)
   * @param {Object} context - контекст действия
   */
  trackPaymentAction(action, context = {}) {
    this.track('payment_action', {
      action: action,
      ...context
    });
  }

  /**
   * Очищает очередь действий
   */
  clearQueue() {
    this.queue = [];
  }

  /**
   * Получает количество действий в очереди
   * @returns {number}
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * Проверяет статус трекинга
   * @returns {Object} статус трекинга
   */
  getStatus() {
    const user = localStorage.getItem('user');
    const sessionId = localStorage.getItem('session_id');
    const token = localStorage.getItem('auth_token');

    return {
      enabled: this.isEnabled,
      authenticated: !!(user && sessionId && token),
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      hasUser: !!user,
      hasSessionId: !!sessionId,
      hasToken: !!token
    };
  }
}

// Создаем единственный экземпляр сервиса
const trackingService = new TrackingService();

export default trackingService;
