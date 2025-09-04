// Константы для сообщений об ошибках и уведомлений
export const MESSAGES = {
  ru: {
    // Ошибки валидации
    INVALID_PHONE: 'Неверный формат номера телефона',
    INVALID_OTP: 'Неверный формат кода',
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_NAME: 'Неверный формат имени',
    INVALID_BIRTH_DATE: 'Неверная дата рождения',
    PHONE_REQUIRED: 'Номер телефона обязателен',
    OTP_REQUIRED: 'Код обязателен',
    
    // Ошибки API
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
    TIMEOUT_ERROR: 'Превышено время ожидания. Попробуйте еще раз.',
    SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
    TOO_MANY_ATTEMPTS: 'Слишком много попыток. Попробуйте позже.',
    INVALID_CREDENTIALS: 'Неверные данные для входа.',
    OTP_EXPIRED: 'Код истек. Запросите новый код.',
    
    // Успешные сообщения
    OTP_SENT: 'Код отправлен на ваш номер телефона',
    LOGIN_SUCCESS: 'Успешная авторизация',
    UPDATE_SUCCESS: 'Профиль успешно обновлен',
    UPDATE_FAILED: 'Ошибка обновления профиля',
    
    // Информационные сообщения
    LOADING: 'Загрузка...',
    SENDING: 'Отправка...',
    VERIFYING: 'Проверка...',
    
    // Кнопки
    SEND_CODE: 'Отправить код',
    VERIFY_CODE: 'Подтвердить код',
    RESEND_CODE: 'Отправить код повторно',
    BACK: 'Назад',
    
    // Подсказки
    PHONE_HINT: 'Введите номер телефона,\nна него придет проверочный SMS-код',
    OTP_HINT: 'Введите код, отправленный на номер',
    RESEND_HINT: 'Не получили код?',
  },
  
  uz: {
    // Ошибки валидации
    INVALID_PHONE: 'Telefon raqami noto\'g\'ri formatda',
    INVALID_OTP: 'Kod noto\'g\'ri formatda',
    INVALID_EMAIL: 'Email noto\'g\'ri formatda',
    INVALID_NAME: 'Ism noto\'g\'ri formatda',
    INVALID_BIRTH_DATE: 'Tug\'ilgan sana noto\'g\'ri',
    PHONE_REQUIRED: 'Telefon raqami majburiy',
    OTP_REQUIRED: 'Kod majburiy',
    
    // Ошибки API
    NETWORK_ERROR: 'Tarmoq xatosi. Internet aloqasini tekshiring.',
    TIMEOUT_ERROR: 'Kutish vaqti oshdi. Qaytadan urinib ko\'ring.',
    SERVER_ERROR: 'Server xatosi. Keyinroq urinib ko\'ring.',
    TOO_MANY_ATTEMPTS: 'Juda ko\'p urinishlar. Keyinroq urinib ko\'ring.',
    INVALID_CREDENTIALS: 'Noto\'g\'ri kirish ma\'lumotlari.',
    OTP_EXPIRED: 'Kod muddati tugadi. Yangi kod so\'rang.',
    
    // Успешные сообщения
    OTP_SENT: 'Kod sizning telefon raqamingizga yuborildi',
    LOGIN_SUCCESS: 'Muvaffaqiyatli avtorizatsiya',
    UPDATE_SUCCESS: 'Profil muvaffaqiyatli yangilandi',
    UPDATE_FAILED: 'Profilni yangilashda xatolik',
    
    // Информационные сообщения
    LOADING: 'Yuklanmoqda...',
    SENDING: 'Yuborilmoqda...',
    VERIFYING: 'Tekshirilmoqda...',
    
    // Кнопки
    SEND_CODE: 'Kod yuborish',
    VERIFY_CODE: 'Kodni tasdiqlash',
    RESEND_CODE: 'Kodni qayta yuborish',
    BACK: 'Orqaga',
    
    // Подсказки
    PHONE_HINT: 'Telefon raqamini kiriting,\nunga tekshiruv SMS kodi keladi',
    OTP_HINT: 'Ushbu raqamga yuborilgan kodni kiriting',
    RESEND_HINT: 'Kod kelmadimi?',
  }
};

// Функция для получения сообщения на нужном языке
export const getMessage = (key, language = 'ru') => {
  return MESSAGES[language]?.[key] || MESSAGES.ru[key] || key;
};

// Функция для получения сообщения об ошибке API
export const getApiErrorMessage = (error, language = 'ru') => {
  if (!error) return '';
  
  // Если ошибка уже переведена
  if (typeof error === 'string') {
    return error;
  }
  
  // Если это объект с сообщением
  if (error.message) {
    return error.message;
  }
  
  // Если это HTTP статус
  if (typeof error === 'number') {
    switch (error) {
      case 400:
        return getMessage('INVALID_CREDENTIALS', language);
      case 401:
        return getMessage('INVALID_CREDENTIALS', language);
      case 429:
        return getMessage('TOO_MANY_ATTEMPTS', language);
      case 500:
        return getMessage('SERVER_ERROR', language);
      default:
        return getMessage('NETWORK_ERROR', language);
    }
  }
  
  return getMessage('NETWORK_ERROR', language);
};

export default MESSAGES;
