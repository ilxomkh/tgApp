// Утилита для определения вариантов ответов, которые требуют пользовательский ввод

export const CUSTOM_INPUT_PATTERNS = [
  // Узбекские варианты
  'Boshqa (o\'z variantingizni yozing)',
  'Boshqa (o\'z variantingizni yozing)',
  'Boshqa',
  'o\'z variantingizni yozing',
  'o\'z javobingizni yozing',
  'Boshqa javob',
  
  // Русские варианты
  'Другое (напишите свой вариант)',
  'Другое',
  'напишите свой вариант',
  'напишите свой ответ',
  'Другой ответ',
  'Свой вариант',
  
  // Английские варианты (на случай)
  'Other (write your own)',
  'Other',
  'write your own',
  'write your answer',
  'Custom answer',
  'Your own answer'
];

/**
 * Проверяет, является ли вариант ответа пользовательским вводом
 * @param {string} option - Вариант ответа
 * @returns {boolean} - true если это пользовательский ввод
 */
export const isCustomInputOption = (option) => {
  if (!option || typeof option !== 'string') return false;
  
  const normalizedOption = option.trim().toLowerCase();
  
  return CUSTOM_INPUT_PATTERNS.some(pattern => 
    normalizedOption.includes(pattern.toLowerCase())
  );
};

/**
 * Получает текст плейсхолдера для пользовательского ввода
 * @param {string} option - Вариант ответа
 * @param {string} language - Язык интерфейса
 * @returns {string} - Текст плейсхолдера
 */
export const getCustomInputPlaceholder = (option, language = 'uz') => {
  const placeholders = {
    uz: 'Javobingizni yozing...',
    ru: 'Напишите ваш ответ...',
    en: 'Write your answer...'
  };
  
  return placeholders[language] || placeholders.uz;
};

/**
 * Получает заголовок для пользовательского ввода
 * @param {string} option - Вариант ответа
 * @param {string} language - Язык интерфейса
 * @returns {string} - Заголовок
 */
export const getCustomInputTitle = (option, language = 'uz') => {
  const titles = {
    uz: 'Sizning javobingiz',
    ru: 'Ваш ответ',
    en: 'Your answer'
  };
  
  return titles[language] || titles.uz;
};
