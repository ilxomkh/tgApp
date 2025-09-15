import api from './api.js';
import config from '../config.js';

class TallyApiService {
  constructor() {
    this.apiBaseUrl = config.API_BASE_URL;
  }

  /**
   * @returns {Promise<Array>}
   */
  async getForms() {
    try {
      const result = await api.getTallyForms();
      
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
   * @param {string} formId
   * @returns {Promise<Object>}
   */
  async getFormById(formId) {
    try {
      const result = await api.getTallyFormById(formId);
      return result;
    } catch (error) {
      console.error(`Error getting Tally form ${formId}:`, error);
      throw new Error(`Failed to get Tally form ${formId} from server`);
    }
  }

  /**
   * @param {string} formId
   * @returns {Promise<Object>}
   */
  async getFormDetails(formId) {
    try {
      const formDetails = await this.getFormById(formId);
      
      return {
        formId: formDetails.formId,
        title: formDetails.title,
        questions: formDetails.questions || [],
        totalQuestions: formDetails.questions ? formDetails.questions.length : 0,
        requiredQuestions: formDetails.questions ? formDetails.questions.filter(q => q.required).length : 0
      };
    } catch (error) {
      console.error(`Error getting form details for ${formId}:`, error);
      
      return this.getFallbackFormDetails(formId);
    }
  }

  /**
   * @param {string} formId
   * @returns {Object}
   */
  getFallbackFormDetails(formId) {
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
   * @param {string} language
   * @returns {Array}
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
   * @param {string} formId
   * @returns {Promise<Array>}
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
   * @param {string} formId
   * @param {string} action
   * @returns {Promise<Object>}
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
   * @param {string} language
   * @returns {Promise<Array>}
   */
  async getAvailableForms(language = 'ru') {
    if (!config.TALLY.SERVER_API.ENABLED) {
      return this.getFallbackForms(language);
    }

    try {
      const serverForms = await this.getForms();
      
      if (serverForms && serverForms.length > 0) {
        const filteredForms = serverForms.filter(form => {
          if (form.language) {
            return form.language === language;
          }
          return true;
        });

        return filteredForms.map(form => {
          const detectedLanguage = form.name && form.name.toLowerCase().includes('uz') ? 'uz' : 'ru';
          
          return {
            id: form.id,
            formId: form.id,
            title: form.name || 'Опрос',
            description: `Статус: ${form.status}, Ответов: ${form.numberOfSubmissions}`,
            type: 'registration',
            url: `https://tally.so/forms/${form.id}`,
            language: detectedLanguage,
            prizeInfo: {
              basePrize: 20000,
              additionalPrize: 5000,
              lotteryAmount: 3000000,
              lotteryEligible: true
            },
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

    return this.getFallbackForms(language);
  }

  /**
   * @param {string} language
   * @returns {Array}
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
   * @param {string} language
   * @param {string} formId
   * @returns {string}
   */
  getFormUrl(language = 'ru', formId = null) {
    const formIds = config.TALLY.FORM_IDS;
    const defaultFormId = formIds[language] || formIds.ru;
    const targetFormId = formId || defaultFormId;
    return `https://tally.so/forms/${targetFormId}`;
  }

  /**
   * @returns {Promise<Object>}
   */
  async getFormIdMapping() {
    try {
      const serverForms = await this.getForms();
      const mapping = {};
      
      serverForms.forEach(form => {
        const realId = form.id || form.formId;
        if (form.title && form.title.toLowerCase().includes('регистрация')) {
          mapping['registration'] = realId;
        }
        mapping[realId] = realId;
      });
      
      return mapping;
    } catch (error) {
      console.warn('Failed to get form ID mapping from server:', error);
      return {
        'registration': config.TALLY.FORM_IDS.ru || '3xqyg9'
      };
    }
  }

  /**
   * @returns {Promise<boolean>}
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

const tallyApiService = new TallyApiService();

export default tallyApiService;
