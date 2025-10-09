import config from '../config.js';
import { API_ENDPOINTS } from '../types/api.js';

class TildaWebhookService {
  constructor() {
    this.webhookUrl = `${config.API_BASE_URL}${API_ENDPOINTS.TALLY_WEBHOOK}`;
  }

  /**
   * @param {Object} webhookData
   * @returns {Promise<Object>}
   */
  async processWebhook(webhookData) {
    try {

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook processing failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} language
   * @returns {string}
   */
  getFormUrl(language = 'ru') {
    const formId = config.TALLY.FORM_IDS[language] || config.TALLY.FORM_IDS.ru;
    return `https://tally.so/forms/${formId}`;
  }

  /**
   * @param {string} language
   * @returns {Array}
   */
  getAvailableForms(language = 'ru') {
    const forms = [
      {
        id: 'registration',
        formId: config.TALLY.FORM_IDS[language] || config.TALLY.FORM_IDS.ru,
        title: language === 'ru' ? 'Тема: Регистрация' : 'Mavzu: Ro\'yxatdan o\'tish',
        description: language === 'ru' 
          ? 'Базовый опрос для регистрации пользователей' 
          : 'Foydalanuvchilarni ro\'yxatdan o\'tkazish uchun asosiy so\'rov',
        type: 'registration',
        prizeInfo: {
          basePrize: 20000,
          additionalPrize: 5000,
          lotteryAmount: 3000000,
          lotteryEligible: true
        }
      }
    ];

    return forms;
  }

  /**
   * @param {string} language
   * @returns {Promise<Object>}
   */
  async getSurveyStats(language = 'ru') {
    try {
      const response = await fetch(`${config.API_BASE_URL}${API_ENDPOINTS.GET_SURVEY_RESPONSES}?language=${language}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to get survey statistics');
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async checkWebhookHealth() {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'HEAD',
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

const tildaWebhookService = new TildaWebhookService();

export default tildaWebhookService;
