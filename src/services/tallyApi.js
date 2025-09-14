import api from './api.js';
import config from '../config.js';

/**
 * Сервис для работы с Tally API через сервер
 * Использует API ключи вместо прямого обращения к Tally
 */
class TallyApiService {
  constructor() {
    this.apiBaseUrl = config.API_BASE_URL;
  }

  /**
   * Получение списка всех форм Tally через сервер
   * @returns {Promise<Array>} - Массив форм
   */
  async getForms() {
    try {
      const result = await api.getTallyForms();
      
      // Проверяем структуру ответа - теперь ожидаем { items: [...] }
      if (result && result.items && Array.isArray(result.items)) {
        return result.items;
      } else if (Array.isArray(result)) {
        return result;
      } else {
        console.warn('Unexpected API response structure:', result);
        return [];
      }
    } catch (error) {
      console.error('Error getting Tally forms:', error);
      throw new Error('Failed to get Tally forms from server');
    }
  }

  /**
   * Получение конкретной формы по ID через сервер
   * @param {string} formId - ID формы (реальный ID формы Tally, например '3xqyg9')
   * @returns {Promise<Object>} - Данные формы с вопросами
   */
  async getFormById(formId) {
    try {
      // Используем реальный ID формы Tally, а не наш внутренний ID
      const result = await api.getTallyFormById(formId);
      return result;
    } catch (error) {
      console.error(`Error getting Tally form ${formId}:`, error);
      throw new Error(`Failed to get Tally form ${formId} from server`);
    }
  }

  /**
   * Получение детальной информации о форме с вопросами
   * @param {string} formId - ID формы
   * @returns {Promise<Object>} - Детальная информация о форме
   */
  async getFormDetails(formId) {
    try {
      const formDetails = await this.getFormById(formId);
      
      // Преобразуем ответ в удобный формат
      return {
        formId: formDetails.formId,
        title: formDetails.title,
        questions: formDetails.questions || [],
        // Дополнительная информация
        totalQuestions: formDetails.questions ? formDetails.questions.length : 0,
        requiredQuestions: formDetails.questions ? formDetails.questions.filter(q => q.required).length : 0
      };
    } catch (error) {
      console.error(`Error getting form details for ${formId}:`, error);
      
      // Fallback: возвращаем базовую структуру формы
      return this.getFallbackFormDetails(formId);
    }
  }

  /**
   * Fallback метод для получения детальной информации о форме
   * @param {string} formId - ID формы
   * @returns {Object} - Базовая информация о форме
   */
  getFallbackFormDetails(formId) {
    // Определяем язык по ID формы
    const isUzbekForm = formId.includes('uz') || formId === 'wbp8L6';
    const language = isUzbekForm ? 'uz' : 'ru';
    
    
    return {
      formId: formId,
      title: language === 'ru' ? 'Registration Pro Survey Ru' : 'Registration Pro Survey Uz',
      questions: this.getFallbackQuestions(language),
      totalQuestions: 5,
      requiredQuestions: 3
    };
  }

  /**
   * Получение fallback вопросов для формы
   * @param {string} language - Язык (ru/uz)
   * @returns {Array} - Массив вопросов
   */
  getFallbackQuestions(language) {
    if (language === 'uz') {
      return [
        {
          id: 'gender',
          text: 'Jinsingizni ko\'rsating',
          type: 'choice',
          required: true,
          options: ['Erkak', 'Ayol']
        },
        {
          id: 'age',
          text: 'Yoshingizni kiriting',
          type: 'number',
          required: true
        },
        {
          id: 'social_networks',
          text: 'Qaysi ijtimoiy tarmoqlardan foydalanasiz?',
          type: 'multichoice',
          required: true,
          options: ['Telegram', 'Instagram', 'Facebook', 'TikTok']
        },
        {
          id: 'banking_services',
          text: 'Qaysi bank yoki to\'lov xizmatlaridan foydalanasiz?',
          type: 'multichoice',
          required: true,
          options: ['Payme', 'Click', 'Uzum Bank', 'Humo']
        },
        {
          id: 'interests',
          text: 'Qiziqishlaringiz nima?',
          type: 'text',
          required: false,
          options: ['Texnologiya', 'San\'at', 'Sport', 'Musiqa']
        }
      ];
    } else {
      return [
        {
          id: 'gender',
          text: 'Укажите свой пол',
          type: 'choice',
          required: true,
          options: ['Мужской', 'Женский']
        },
        {
          id: 'age',
          text: 'Сколько вам лет?',
          type: 'number',
          required: true
        },
        {
          id: 'social_networks',
          text: 'Какие соц. сети вы используете?',
          type: 'multichoice',
          required: true,
          options: ['Telegram', 'Instagram', 'Facebook', 'TikTok']
        },
        {
          id: 'banking_services',
          text: 'Какие банковские или платежные сервисы вы используете?',
          type: 'multichoice',
          required: true,
          options: ['Payme', 'Click', 'Uzum Bank', 'Humo']
        },
        {
          id: 'interests',
          text: 'Что вас интересует?',
          type: 'text',
          required: false,
          options: ['Технологии', 'Искусство', 'Спорт', 'Музыка']
        }
      ];
    }
  }

  /**
   * Получение ответов на форму через сервер
   * @param {string} formId - ID формы
   * @returns {Promise<Array>} - Массив ответов
   */
  async getFormResponses(formId) {
    try {
      const result = await api.getTallyFormResponses(formId);
      return result;
    } catch (error) {
      console.error(`Error getting responses for form ${formId}:`, error);
      throw new Error(`Failed to get responses for form ${formId} from server`);
    }
  }

  /**
   * Синхронизация данных с Tally через сервер
   * @param {string} formId - ID формы для синхронизации
   * @param {string} action - Действие синхронизации
   * @returns {Promise<Object>} - Результат синхронизации
   */
  async syncData(formId, action = 'sync') {
    try {
      const syncData = {
        formId,
        action
      };
      const result = await api.syncTallyData(syncData);
      return result;
    } catch (error) {
      console.error(`Error syncing data for form ${formId}:`, error);
      throw new Error(`Failed to sync data for form ${formId}`);
    }
  }

  /**
   * Получение доступных форм для языка с fallback на локальную конфигурацию
   * @param {string} language - Язык (ru/uz)
   * @returns {Promise<Array>} - Массив доступных форм
   */
  async getAvailableForms(language = 'ru') {
    // Проверяем, включен ли серверный API
    if (!config.TALLY.SERVER_API.ENABLED) {
      return this.getFallbackForms(language);
    }

    try {
      // Сначала пытаемся получить формы через сервер
      const serverForms = await this.getForms();
      
      if (serverForms && serverForms.length > 0) {
        // Фильтруем формы по языку, если сервер поддерживает это
        const filteredForms = serverForms.filter(form => {
          // Если форма имеет поле language, фильтруем по нему
          if (form.language) {
            return form.language === language;
          }
          // Если сервер не поддерживает фильтрацию по языку,
          // возвращаем все формы
          return true;
        });

        return filteredForms.map(form => {
          // Определяем язык по названию формы
          const detectedLanguage = form.name && form.name.toLowerCase().includes('uz') ? 'uz' : 'ru';
          
          return {
            id: form.id, // используем ID с сервера
            formId: form.id, // реальный ID формы Tally
            title: form.name || 'Опрос',
            description: `Статус: ${form.status}, Ответов: ${form.numberOfSubmissions}`,
            type: 'registration',
            url: `https://tally.so/forms/${form.id}`,
            language: detectedLanguage,
            // Информация о призах на основе языка
            prizeInfo: {
              basePrize: 20000,
              additionalPrize: 5000,
              lotteryAmount: 3000000,
              lotteryEligible: true
            },
            // Дополнительная информация с сервера
            serverInfo: {
              status: form.status,
              numberOfSubmissions: form.numberOfSubmissions,
              createdAt: form.createdAt,
              updatedAt: form.updatedAt,
              isClosed: form.isClosed
            }
          };
        });
      }
    } catch (error) {
      console.warn('Failed to get forms from server, using fallback:', error);
    }

    // Fallback: используем локальную конфигурацию
    return this.getFallbackForms(language);
  }

  /**
   * Fallback метод для получения форм из локальной конфигурации
   * @param {string} language - Язык (ru/uz)
   * @returns {Array} - Массив форм из конфигурации
   */
  getFallbackForms(language = 'ru') {
    const formIds = config.TALLY.FORM_IDS;
    
    return [
      {
        id: 'registration',
        formId: formIds[language] || formIds.ru,
        title: language === 'ru' ? 'Тема: Регистрация' : 'Mavzu: Ro\'yxatdan o\'tish',
        description: language === 'ru' 
          ? 'Базовый опрос для регистрации пользователей' 
          : 'Foydalanuvchilarni ro\'yxatdan o\'tkazish uchun asosiy so\'rov',
        type: 'registration',
        url: `https://tally.so/forms/${formIds[language] || formIds.ru}`,
        language,
        prizeInfo: {
          basePrize: 20000,
          additionalPrize: 5000,
          lotteryAmount: 3000000,
          lotteryEligible: true
        }
      }
    ];
  }

  /**
   * Получение URL формы для определенного языка
   * @param {string} language - Язык (ru/uz)
   * @param {string} formId - ID формы (опционально)
   * @returns {string} - URL формы
   */
  getFormUrl(language = 'ru', formId = null) {
    const formIds = config.TALLY.FORM_IDS;
    const defaultFormId = formIds[language] || formIds.ru;
    const targetFormId = formId || defaultFormId;
    return `https://tally.so/forms/${targetFormId}`;
  }

  /**
   * Получение реальных ID форм с сервера для маппинга
   * @returns {Promise<Object>} - Объект с маппингом внутренних ID на реальные ID Tally
   */
  async getFormIdMapping() {
    try {
      const serverForms = await this.getForms();
      const mapping = {};
      
      serverForms.forEach(form => {
        const realId = form.id || form.formId;
        // Создаем маппинг для разных типов форм
        if (form.title && form.title.toLowerCase().includes('регистрация')) {
          mapping['registration'] = realId;
        }
        // Можно добавить другие маппинги по названию или другим критериям
        mapping[realId] = realId; // Прямой маппинг для реальных ID
      });
      
      return mapping;
    } catch (error) {
      console.warn('Failed to get form ID mapping from server:', error);
      // Возвращаем fallback маппинг из конфигурации
      return {
        'registration': config.TALLY.FORM_IDS.ru || '3xqyg9'
      };
    }
  }

  /**
   * Проверка доступности серверного API
   * @returns {Promise<boolean>} - Доступен ли серверный API
   */
  async isServerApiAvailable() {
    try {
      await this.getForms();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Создаем экземпляр сервиса
const tallyApiService = new TallyApiService();

export default tallyApiService;
