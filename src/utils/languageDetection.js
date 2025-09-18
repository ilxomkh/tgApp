/**
 * @param {string} formName
 * @returns {string}
 */
export const detectFormLanguage = (formName) => {
  if (!formName || typeof formName !== 'string') {
    return 'ru';
  }

  const name = formName.trim();
  
  const hasCyrillic = /[а-яё]/i.test(name);
  
  const hasLatin = /[a-z]/i.test(name);
  
  if (hasCyrillic) {
    return 'ru';
  }
  
  if (hasLatin && !hasCyrillic) {
    return 'uz';
  }
  
  return 'ru';
};

/**
 * @param {Array} forms
 * @param {string} userLanguage
 * @returns {Array}
 */
export const filterFormsByLanguage = (forms, userLanguage) => {
  if (!Array.isArray(forms) || !userLanguage) {
    return forms || [];
  }

  return forms.filter(form => {
    const formLanguage = detectFormLanguage(form.name);
    return formLanguage === userLanguage;
  });
};

/**
 * @param {string} text
 * @returns {boolean}
 */
export const hasCyrillic = (text) => {
  return /[а-яё]/i.test(text);
};

/**
 * @param {string} text
 * @returns {boolean}
 */
export const hasOnlyLatin = (text) => {
  return /^[a-z\s]+$/i.test(text);
};
