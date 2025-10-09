export const CUSTOM_INPUT_PATTERNS = [
  'Boshqa (o\'z variantingizni yozing)',
  'Boshqa (o\'z variantingizni yozing)',
  'Boshqa',
  'o\'z variantingizni yozing',
  'o\'z javobingizni yozing',
  'Boshqa javob',
  
  'Другое (напишите свой вариант)',
  'Другое',
  'напишите свой вариант',
  'напишите свой ответ',
  'Другой ответ',
  'Свой вариант',
  
  'Other (write your own)',
  'Other',
  'write your own',
  'write your answer',
  'Custom answer',
  'Your own answer'
];

/**
 * @param {string} option
 * @returns {boolean}
 */
export const isCustomInputOption = (option) => {
  if (!option || typeof option !== 'string') return false;
  
  const normalizedOption = option.trim().toLowerCase();
  
  return CUSTOM_INPUT_PATTERNS.some(pattern => 
    normalizedOption.includes(pattern.toLowerCase())
  );
};

/**
 * @param {string} option
 * @param {string} language
 * @returns {string}
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
 * @param {string} option
 * @param {string} language
 * @returns {string}
 */
export const getCustomInputTitle = (option, language = 'uz') => {
  const titles = {
    uz: 'Sizning javobingiz',
    ru: 'Ваш ответ',
    en: 'Your answer'
  };
  
  return titles[language] || titles.uz;
};
