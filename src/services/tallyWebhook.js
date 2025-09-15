import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

class TallyWebhookService {
  constructor() {
    this.webhookUrl = config.TALLY.WEBHOOK_URL;
    this.formIds = config.TALLY.FORM_IDS;
    this.webhookSecret = config.TALLY.WEBHOOK_SECRET;
  }

  /**
   * @param {string} signature
   * @param {string} payload
   * @returns {boolean}
   */
  verifyWebhookSignature(signature, payload) {
    if (!this.webhookSecret) {
      return true;
    }

    return true;
  }

  /**
   * @param {Object} webhookData
   * @returns {Object}
   */
  processWebhook(webhookData) {
    try {
      if (!webhookData || !webhookData.payload) {
        throw new Error('Invalid webhook data structure');
      }

      const { payload } = webhookData;
      
      let language = 'ru';
      if (payload.formName && payload.formName.includes('Uz')) {
        language = 'uz';
      }

      const processedAnswers = this.processAnswers(payload.answers);

      return {
        id: payload.responseId,
        formId: payload.formId,
        formName: payload.formName,
        language,
        answers: processedAnswers,
        createdAt: payload.createdAt,
        respondentId: payload.respondentId,
        submissionId: payload.submissionId,
      };
    } catch (error) {
      console.error('Error processing Tally webhook:', error);
      throw new Error('Failed to process webhook data');
    }
  }

  /**
   * @param {Object} answers
   * @returns {Object}
   */
  processAnswers(answers) {
    const processed = {};

    if (!answers || typeof answers !== 'object') {
      return processed;
    }

    Object.keys(answers).forEach(fieldId => {
      const answer = answers[fieldId];
      
      if (answer && answer.value !== undefined) {
        const questionType = this.getQuestionType(fieldId);
        
        processed[fieldId] = {
          value: answer.value,
          type: questionType,
          label: answer.label || fieldId,
        };
      }
    });

    return processed;
  }

  /**
   * @param {string} fieldId
   * @returns {string}
   */
  getQuestionType(fieldId) {
    const fieldTypeMap = {
      'id': 'text',
      'gender': 'choice',
      'age': 'number',
    };

    return fieldTypeMap[fieldId] || 'text';
  }

  /**
   * @param {string} language
   * @param {string} formId
   * @returns {string}
   */
  getFormUrl(language = 'ru', formId = null) {
    const defaultFormId = this.formIds[language] || this.formIds.ru;
    const targetFormId = formId || defaultFormId;
    return `https://tally.so/forms/${targetFormId}`;
  }

  /**
   * @param {string} language
   * @returns {Array}
   */
  getAvailableForms(language = 'ru') {
    const forms = [
      {
        id: 'registration',
        formId: this.formIds[language] || this.formIds.ru,
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
   * @returns {string}
   */
  getEditFormUrl(language = 'ru') {
    const formId = this.formIds[language] || this.formIds.ru;
    return `https://tally.so/forms/${formId}/edit`;
  }

  /**
   * @param {Object} surveyData
   * @returns {Promise<Object>}
   */
  async sendToServer(surveyData) {
    try {
      const response = await fetch(`${config.API_BASE_URL}${API_ENDPOINTS.TALLY_WEBHOOK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending survey data to server:', error);
      throw new Error('Failed to send survey data to server');
    }
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
      console.error('Error getting survey stats:', error);
      throw new Error('Failed to get survey statistics');
    }
  }
}

const tallyWebhookService = new TallyWebhookService();

export default tallyWebhookService;
