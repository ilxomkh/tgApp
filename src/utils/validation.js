/**
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidUzbekPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length !== 12) return false;
  
  if (!digits.startsWith('998')) return false;
  
  const operatorCodes = ['33', '88', '90', '91', '93', '94', '95', '97', '99'];
  const operatorCode = digits.slice(3, 5);
  
  return operatorCodes.includes(operatorCode);
};

/**
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneE164 = (phone) => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('998') && digits.length === 12) {
    return `+${digits}`;
  }
  
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits}`;
  }
  
  return phone;
};

/**
 * @param {string} otp
 * @returns {boolean}
 */
export const isValidOtp = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * @param {string} otp
 * @returns {string}
 */
export const cleanOtp = (otp) => {
  return otp.replace(/\D/g, '').slice(0, 6);
};

/**
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @param {string} value
 * @param {number} minLength
 * @returns {boolean}
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * @param {string} date
 * @returns {boolean}
 */
export const isValidBirthDate = (date) => {
  if (!date) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  return age >= 13 && age <= 120;
};

/**
 * @param {string} name
 * @returns {boolean}
 */
export const isValidFullName = (name) => {
  if (!name) return false;
  
  if (name.length < 2 || name.length > 100) return false;
  
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
  return nameRegex.test(name);
};

/**
 * @param {string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('ru-RU');
  } catch (error) {
    return date;
  }
};

/**
 * @param {string} dateString
 * @returns {string}
 */
export const parseDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/**
 * @param {string} cardNumber
 * @returns {boolean}
 */
export const isValidCardNumber = (cardNumber) => {
  if (!cardNumber) return false;

  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  const testPrefixes = ['5614', '8600', '6262', '9860'];
  const isTestCard = testPrefixes.some(prefix => cleanNumber.startsWith(prefix));
  
  if (isTestCard) {
    return cleanNumber.length >= 13 && cleanNumber.length <= 19;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * @param {string} cardNumber
 * @returns {string}
 */
export const getCardType = (cardNumber) => {
  if (!cardNumber) return 'unknown';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7][2-9][0-9]/.test(cleanNumber)) return 'mastercard';
  
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  
  if (/^6(?:011|5)/.test(cleanNumber) || /^622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[0-1][0-9]|92[0-5])/.test(cleanNumber)) return 'discover';
  
  if (/^62/.test(cleanNumber)) return 'unionpay';
  
  return 'unknown';
};

/**
 * @param {string} cardNumber
 * @returns {string}
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  if (cleanNumber.length < 4) return cleanNumber;
  
  const firstFour = cleanNumber.slice(0, 4);
  const lastFour = cleanNumber.slice(-4);
  const middle = '*'.repeat(cleanNumber.length - 8);
  
  return `${firstFour} ${middle} ${lastFour}`;
};

/**
 * @param {string} cardNumber
 * @returns {string}
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  const groups = [];
  for (let i = 0; i < cleanNumber.length; i += 4) {
    groups.push(cleanNumber.slice(i, i + 4));
  }
  
  return groups.join(' ');
};
