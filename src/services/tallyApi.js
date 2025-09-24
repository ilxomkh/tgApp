import api from './api.js';
import config from '../config.js';
import { detectFormLanguage, filterFormsByLanguage } from '../utils/languageDetection.js';
import { isSurveyCompleted } from '../utils/completedSurveys.js';
import { shouldHideSurveyDueToGroup } from '../utils/surveyGroups.js';

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
    // Возвращаем пустые данные - никаких мок данных
    console.warn(`getFallbackFormDetails called for ${formId} - returning empty data (no mock data)`);
    return {
      formId: formId,
      title: 'Опрос недоступен',
      questions: [],
      totalQuestions: 0,
      requiredQuestions: 0
    };
  }

  /**
   * @param {string} language
   * @returns {Array}
   */
  getFallbackQuestions(language) {
    // Возвращаем пустой массив - никаких мок данных
    console.warn('getFallbackQuestions called - returning empty array (no mock data)');
    return [];
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
      console.warn('Server API is disabled, returning empty array');
      return [];
    }

    try {
      const serverForms = await this.getForms();
      
      if (serverForms && serverForms.length > 0) {
        const filteredForms = filterFormsByLanguage(serverForms, language);

        // Проверяем статус каждого опроса и фильтруем пройденные
        const availableForms = [];
        
        console.log(`🔍 Проверяем ${filteredForms.length} опросов на предмет завершения...`);
        
        for (const form of filteredForms) {
          console.log(`🔍 Проверяем опрос ${form.id} (${form.name})`);
          
          // Сначала проверяем локальное хранилище
          if (isSurveyCompleted(form.id)) {
            console.log(`📝 Опрос ${form.id} уже пройден (локальное хранилище)`);
            continue;
          }
          
          // Затем проверяем статус на сервере
          console.log(`🔍 Проверяем статус опроса ${form.id} на сервере...`);
          const isCompleted = await this.checkSurveyStatus(form.id);
          if (isCompleted) {
            console.log(`📝 Опрос ${form.id} уже пройден (сервер) - исключаем из списка`);
            continue;
          }
          
          // Проверяем группировку опросов
          if (shouldHideSurveyDueToGroup(form.id)) {
            console.log(`📝 Опрос ${form.id} скрыт из-за группировки (другой опрос из группы уже пройден)`);
            continue;
          }
          
          console.log(`✅ Опрос ${form.id} доступен - добавляем в список`);
          
          const detectedLanguage = detectFormLanguage(form.name);
          const titlePrefix = detectedLanguage === 'ru' ? 'Тема: ' : 'Mavzu: ';
          
          availableForms.push({
            id: form.id,
            formId: form.id,
            title: `${titlePrefix}${form.name || 'Опрос'}`,
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
          });
        }
        
        console.log(`📊 Результат: из ${filteredForms.length} опросов доступно ${availableForms.length}`);
        return availableForms;
      }
      
      // Если нет форм с сервера, возвращаем пустой массив
      console.warn('No forms received from server');
      return [];
    } catch (error) {
      console.warn('Failed to get forms from server:', error);
      return [];
    }
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

  /**
   * Проверяет статус опроса - пройден ли он уже
   * @param {string} formId - ID опроса
   * @returns {Promise<boolean>} true если опрос уже пройден
   */
  async checkSurveyStatus(formId) {
    try {
      // Делаем прямой запрос к API для проверки статуса
      const response = await api.getTallyFormById(formId);
      console.log(`✅ Опрос ${formId} доступен через API`);
      return false; // Если получили данные, значит опрос доступен
    } catch (error) {
      console.log(`🔍 Проверка статуса опроса ${formId}:`, error.message);
      
      // Проверяем конкретные типы ошибок
      if (error.message && error.message.includes('Вы уже прошли этот опрос')) {
        console.log(`📝 Опрос ${formId} уже пройден - исключаем из списка`);
        return true; // Опрос уже пройден
      }
      
      // Для ошибок аутентификации НЕ скрываем опрос
      if (error.message && (
        error.message.includes('Откройте приложение внутри Telegram') ||
        error.message.includes('Личность пользователя не определена') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('401')
      )) {
        console.log(`⚠️ Ошибка аутентификации для опроса ${formId} - НЕ скрываем опрос`);
        return false; // Не скрываем опрос при ошибках аутентификации
      }
      
      // Для других ошибок (500, сетевые ошибки) тоже не скрываем
      console.log(`⚠️ Ошибка при проверке опроса ${formId}: ${error.message} - НЕ скрываем опрос`);
      return false; // Не скрываем опрос при других ошибках
    }
  }
}

const tallyApiService = new TallyApiService();

export default tallyApiService;
