import api from './api.js';
import { useAuth } from '../contexts/AuthContext.jsx';


class TrackingService {
  constructor() {
    this.isEnabled = true;
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  /**
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * @param {string} actionName
   * @param {Object} context
   * @param {boolean} immediate
   */
  async track(actionName, context = {}, immediate = false) {
    if (!this.isEnabled) {
      return;
    }

    const user = localStorage.getItem('user');
    const sessionId = localStorage.getItem('session_id');
    
    if (!user || !sessionId) {
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

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const action = this.queue.shift();
      try {
        await this.sendAction(action);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.queue.unshift(action);
        break;
      }
    }

    this.isProcessing = false;
  }

  /**
   * @param {Object} action
   * @param {number} retryCount
   */
  async sendAction(action, retryCount = 0) {
    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        return;
      }

      await api.trackUserAction(action.action_name, action.context);
    } catch (error) {      
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendAction(action, retryCount + 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * @param {string} from
   * @param {string} to
   */
  trackNavigation(from, to) {
    this.track('page_navigation', {
      from_page: from,
      to_page: to,
      navigation_type: 'route_change'
    });
  }

  /**
   * @param {string} buttonName
   * @param {string} location
   * @param {Object} additionalContext
   */
  trackButtonClick(buttonName, location, additionalContext = {}) {
    this.track('button_click', {
      button_name: buttonName,
      location: location,
      ...additionalContext
    });
  }

  /**
   * @param {string} modalName
   * @param {Object} context
   */
  trackModalOpen(modalName, context = {}) {
    this.track('modal_open', {
      modal_name: modalName,
      ...context
    });
  }

  /**
   * @param {string} modalName
   * @param {string} closeMethod
   */
  trackModalClose(modalName, closeMethod = 'unknown') {
    this.track('modal_close', {
      modal_name: modalName,
      close_method: closeMethod
    });
  }

  /**
   * @param {string} formName
   * @param {Object} formData
   * @param {boolean} success
   */
  trackFormSubmit(formName, formData = {}, success = true) {
    this.track('form_submit', {
      form_name: formName,
      form_data: formData,
      success: success
    });
  }

  /**
   * @param {string} errorType
   * @param {string} errorMessage
   * @param {Object} context
   */
  trackError(errorType, errorMessage, context = {}) {
    this.track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...context
    });
  }

  /**
   * @param {string} pageName
   * @param {number} timeSpent
   */
  trackTimeOnPage(pageName, timeSpent) {
    this.track('time_on_page', {
      page_name: pageName,
      time_spent_ms: timeSpent,
      time_spent_seconds: Math.round(timeSpent / 1000)
    });
  }

  /**
   * @param {string} action
   * @param {string} surveyId
   * @param {Object} context
   */
  trackSurveyAction(action, surveyId, context = {}) {
    this.track('survey_action', {
      action: action,
      survey_id: surveyId,
      ...context
    });
  }

  /**
   * @param {string} action
   * @param {Object} context
   */
  trackProfileAction(action, context = {}) {
    this.track('profile_action', {
      action: action,
      ...context
    });
  }

  /**
   * @param {string} action
   * @param {Object} context
   */
  trackReferralAction(action, context = {}) {
    this.track('referral_action', {
      action: action,
      ...context
    });
  }

  /**
   * @param {string} action
   * @param {Object} context
   */
  trackPaymentAction(action, context = {}) {
    this.track('payment_action', {
      action: action,
      ...context
    });
  }
  clearQueue() {
    this.queue = [];
  }

  /**
   * @returns {number}
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * @returns {Object}
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

const trackingService = new TrackingService();

export default trackingService;
