import config from '../config.js';
import { API_ENDPOINTS } from '../types/api.js';

/**
 * Сервис для работы с Tilda webhook
 */
class TildaWebhookService {
  constructor() {
    this.webhookUrl = `${config.API_BASE_URL}${API_ENDPOINTS.TALLY_WEBHOOK}`;
  }

  /**
   * Обработка входящего webhook от Tilda
   * @param {Object} webhookData - Данные webhook от Tilda
   * @returns {Promise<Object>} - Результат обработки
   */
  async processWebhook(webhookData) {
    try {
      console.log('Processing Tilda webhook:', webhookData);

      // Отправляем данные на наш сервер
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
        console.error('Tilda webhook error:', response.status, errorText);
        throw new Error(`Webhook processing failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Tilda webhook processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Error processing Tilda webhook:', error);
      throw error;
    }
  }

  /**
   * Получение URL формы Tilda для определенного языка
   * @param {string} language - Язык (ru/uz)
   * @returns {string} - URL формы
   */
  getFormUrl(language = 'ru') {
    // Используем ID формы из конфигурации
    const formId = config.TALLY.FORM_IDS[language] || config.TALLY.FORM_IDS.ru;
    return `https://tally.so/forms/${formId}`;
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

  /**
   * Проверка доступности webhook endpoint
   * @returns {Promise<boolean>} - Доступность endpoint
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
      console.error('Webhook health check failed:', error);
      return false;
    }
  }
}

// Создаем экземпляр сервиса
const tildaWebhookService = new TildaWebhookService();

export default tildaWebhookService;
