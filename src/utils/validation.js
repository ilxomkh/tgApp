/**
 * Валидация номера телефона Узбекистана
 * @param {string} phone - Номер телефона
 * @returns {boolean} - Валидность номера
 */
export const isValidUzbekPhone = (phone) => {
  // Убираем все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  
  // Проверяем что это узбекский номер (998 + 9 цифр)
  if (digits.length !== 12) return false;
  
  // Проверяем код страны
  if (!digits.startsWith('998')) return false;
  
  // Проверяем что номер начинается с правильных кодов операторов
  const operatorCodes = ['33', '88', '90', '91', '93', '94', '95', '97', '99'];
  const operatorCode = digits.slice(3, 5);
  
  return operatorCodes.includes(operatorCode);
};

/**
 * Форматирование номера телефона в E.164 формат
 * @param {string} phone - Номер телефона
 * @returns {string} - Отформатированный номер
 */
export const formatPhoneE164 = (phone) => {
  const digits = phone.replace(/\D/g, '');
  
  // Если номер уже в формате E.164
  if (digits.startsWith('998') && digits.length === 12) {
    return `+${digits}`;
  }
  
  // Если номер без кода страны (9 цифр)
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  
  // Если номер с кодом страны но без +
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits}`;
  }
  
  return phone; // Возвращаем как есть если не можем отформатировать
};

/**
 * Валидация OTP кода
 * @param {string} otp - OTP код
 * @returns {boolean} - Валидность кода
 */
export const isValidOtp = (otp) => {
  // OTP должен быть 6-значным числом
  return /^\d{6}$/.test(otp);
};

/**
 * Очистка OTP кода от нецифровых символов
 * @param {string} otp - OTP код
 * @returns {string} - Очищенный код
 */
export const cleanOtp = (otp) => {
  return otp.replace(/\D/g, '').slice(0, 6);
};

/**
 * Валидация email адреса
 * @param {string} email - Email адрес
 * @returns {boolean} - Валидность email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Проверка минимальной длины строки
 * @param {string} value - Значение для проверки
 * @param {number} minLength - Минимальная длина
 * @returns {boolean} - Результат проверки
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Проверка максимальной длины строки
 * @param {string} value - Значение для проверки
 * @param {number} maxLength - Максимальная длина
 * @returns {boolean} - Результат проверки
 */
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Валидация даты рождения
 * @param {string} date - Дата в формате YYYY-MM-DD
 * @returns {boolean} - Валидность даты
 */
export const isValidBirthDate = (date) => {
  if (!date) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Проверяем что возраст от 13 до 120 лет
  return age >= 13 && age <= 120;
};

/**
 * Валидация полного имени
 * @param {string} name - Полное имя
 * @returns {boolean} - Валидность имени
 */
export const isValidFullName = (name) => {
  if (!name) return false;
  
  // Имя должно содержать минимум 2 символа и максимум 100
  if (name.length < 2 || name.length > 100) return false;
  
  // Имя должно содержать только буквы, пробелы и дефисы
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
  return nameRegex.test(name);
};

/**
 * Форматирование даты для отображения
 * @param {string} date - Дата в формате YYYY-MM-DD
 * @returns {string} - Отформатированная дата
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
 * Парсинг даты из строки
 * @param {string} dateString - Строка с датой
 * @returns {string} - Дата в формате YYYY-MM-DD
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
 * Валидация номера карты (алгоритм Луна)
 * @param {string} cardNumber - Номер карты
 * @returns {boolean} - Валидность номера карты
 */
export const isValidCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  
  // Убираем все пробелы и дефисы
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  // Проверяем что это только цифры и длина от 13 до 19
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  // Алгоритм Луна
  let sum = 0;
  let isEven = false;
  
  // Идем справа налево
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
 * Определение типа карты по номеру
 * @param {string} cardNumber - Номер карты
 * @returns {string} - Тип карты (visa, mastercard, etc.)
 */
export const getCardType = (cardNumber) => {
  if (!cardNumber) return 'unknown';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  // Visa: начинается с 4
  if (/^4/.test(cleanNumber)) return 'visa';
  
  // Mastercard: начинается с 51-55 или 2221-2720
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7][2-9][0-9]/.test(cleanNumber)) return 'mastercard';
  
  // American Express: начинается с 34 или 37
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  
  // Discover: начинается с 6011, 622126-622925, 644-649, 65
  if (/^6(?:011|5)/.test(cleanNumber) || /^622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[0-1][0-9]|92[0-5])/.test(cleanNumber)) return 'discover';
  
  // UnionPay: начинается с 62
  if (/^62/.test(cleanNumber)) return 'unionpay';
  
  return 'unknown';
};

/**
 * Маскирование номера карты
 * @param {string} cardNumber - Номер карты
 * @returns {string} - Маскированный номер
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  if (cleanNumber.length < 4) return cleanNumber;
  
  // Показываем первые 4 и последние 4 цифры
  const firstFour = cleanNumber.slice(0, 4);
  const lastFour = cleanNumber.slice(-4);
  const middle = '*'.repeat(cleanNumber.length - 8);
  
  return `${firstFour} ${middle} ${lastFour}`;
};

/**
 * Форматирование номера карты для отображения
 * @param {string} cardNumber - Номер карты
 * @returns {string} - Отформатированный номер
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  // Группируем по 4 цифры
  const groups = [];
  for (let i = 0; i < cleanNumber.length; i += 4) {
    groups.push(cleanNumber.slice(i, i + 4));
  }
  
  return groups.join(' ');
};
