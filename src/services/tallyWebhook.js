import config from '../config.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../types/api.js';

/**
 * Сервис для работы с Tally webhook
 */
class TallyWebhookService {
  constructor() {
    this.webhookUrl = config.TALLY.WEBHOOK_URL;
    this.formIds = config.TALLY.FORM_IDS;
    this.webhookSecret = config.TALLY.WEBHOOK_SECRET;
  }

  /**
   * Верификация webhook от Tally
   * @param {string} signature - Подпись от Tally
   * @param {string} payload - Тело запроса
   * @returns {boolean} - Валидность подписи
   */
  verifyWebhookSignature(signature, payload) {
    if (!this.webhookSecret) {
      // Если секрет не настроен, пропускаем верификацию
      return true;
    }

    // Здесь должна быть логика верификации подписи
    // Tally может использовать HMAC-SHA256 или другой алгоритм
    // Пока что возвращаем true для демонстрации
    return true;
  }

  /**
   * Обработка входящего webhook от Tally
   * @param {Object} webhookData - Данные webhook
   * @returns {Object} - Обработанные данные
   */
  processWebhook(webhookData) {
    try {
      // Проверяем структуру данных
      if (!webhookData || !webhookData.payload) {
        throw new Error('Invalid webhook data structure');
      }

      const { payload } = webhookData;
      
      // Определяем язык на основе названия формы
      let language = 'ru'; // по умолчанию
      if (payload.formName && payload.formName.includes('Uz')) {
        language = 'uz';
      }

      // Преобразуем ответы в удобный формат
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
   * Обработка ответов на вопросы
   * @param {Object} answers - Сырые ответы от Tally
   * @returns {Object} - Обработанные ответы
   */
  processAnswers(answers) {
    const processed = {};

    if (!answers || typeof answers !== 'object') {
      return processed;
    }

    // Обрабатываем каждый ответ
    Object.keys(answers).forEach(fieldId => {
      const answer = answers[fieldId];
      
      if (answer && answer.value !== undefined) {
        // Определяем тип вопроса по ID поля
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
   * Определение типа вопроса по ID поля
   * @param {string} fieldId - ID поля
   * @returns {string} - Тип вопроса
   */
  getQuestionType(fieldId) {
    // Маппинг ID полей на типы вопросов
    const fieldTypeMap = {
      'id': 'text',
      'gender': 'choice', // Укажите свой пол
      'age': 'number', // Сколько вам лет
    };

    return fieldTypeMap[fieldId] || 'text';
  }

  /**
   * Получение URL формы Tally для определенного языка
   * @param {string} language - Язык (ru/uz)
   * @param {string} formId - ID формы (опционально)
   * @returns {string} - URL формы
   */
  getFormUrl(language = 'ru', formId = null) {
    const defaultFormId = this.formIds[language] || this.formIds.ru;
    const targetFormId = formId || defaultFormId;
    return `https://tally.so/forms/${targetFormId}`;
  }

  /**
   * Получение списка доступных форм для языка
   * @param {string} language - Язык (ru/uz)
   * @returns {Array} - Массив доступных форм
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
   * Получение URL для редактирования формы
   * @param {string} language - Язык (ru/uz)
   * @returns {string} - URL для редактирования
   */
  getEditFormUrl(language = 'ru') {
    const formId = this.formIds[language] || this.formIds.ru;
    return `https://tally.so/forms/${formId}/edit`;
  }

  /**
   * Отправка данных на наш сервер для обработки через Tilda webhook
   * @param {Object} surveyData - Данные опроса
   * @returns {Promise<Object>} - Результат обработки
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
   * Получение статистики ответов
   * @param {string} language - Язык (ru/uz)
   * @returns {Promise<Object>} - Статистика
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

// Создаем экземпляр сервиса
const tallyWebhookService = new TallyWebhookService();

export default tallyWebhookService;
