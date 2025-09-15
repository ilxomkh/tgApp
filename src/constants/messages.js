export const MESSAGES = {
  ru: {
    INVALID_PHONE: 'Неверный формат номера телефона',
    INVALID_OTP: 'Неверный формат кода',
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_NAME: 'Неверный формат имени',
    INVALID_BIRTH_DATE: 'Неверная дата рождения',
    PHONE_REQUIRED: 'Номер телефона обязателен',
    OTP_REQUIRED: 'Код обязателен',
    
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
    TIMEOUT_ERROR: 'Превышено время ожидания. Попробуйте еще раз.',
    SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
    TOO_MANY_ATTEMPTS: 'Слишком много попыток. Попробуйте позже.',
    INVALID_CREDENTIALS: 'Неверные данные для входа.',
    OTP_EXPIRED: 'Код истек. Запросите новый код.',
    WRONG_PHONE_NUMBER: 'Неверный номер телефона. Проверьте правильность ввода.',
    
    OTP_SENT: 'Код отправлен на ваш номер телефона',
    LOGIN_SUCCESS: 'Успешная авторизация',
    UPDATE_SUCCESS: 'Профиль успешно обновлен',
    UPDATE_FAILED: 'Ошибка обновления профиля',
    
    LOADING: 'Загрузка...',
    SENDING: 'Отправка...',
    VERIFYING: 'Проверка...',
    
    SEND_CODE: 'Отправить код',
    VERIFY_CODE: 'Подтвердить код',
    RESEND_CODE: 'Отправить код повторно',
    BACK: 'Назад',
    
    PHONE_HINT: 'Введите номер телефона,\nна него придет проверочный SMS-код',
    OTP_HINT: 'Введите код, отправленный на номер',
    RESEND_HINT: 'Не получили код?',
    WRONG_NUMBER_HINT: 'Вы неправильно ввели номер?',
    BACK_TO_PHONE: 'Нажмите сюда!',
    
    LOGOUT_CONFIRMATION_TITLE: 'Подтверждение выхода',
    LOGOUT_CONFIRMATION_MESSAGE: 'Вы уверены, что хотите выйти из аккаунта?',
    LOGOUT_CONFIRM: 'Да, выйти',
    LOGOUT_CANCEL: 'Отмена',
  },
  
  uz: {
    INVALID_PHONE: 'Telefon raqami noto\'g\'ri formatda',
    INVALID_OTP: 'Kod noto\'g\'ri formatda',
    INVALID_EMAIL: 'Email noto\'g\'ri formatda',
    INVALID_NAME: 'Ism noto\'g\'ri formatda',
    INVALID_BIRTH_DATE: 'Tug\'ilgan sana noto\'g\'ri',
    PHONE_REQUIRED: 'Telefon raqami majburiy',
    OTP_REQUIRED: 'Kod majburiy',
    
    NETWORK_ERROR: 'Tarmoq xatosi. Internet aloqasini tekshiring.',
    TIMEOUT_ERROR: 'Kutish vaqti oshdi. Qaytadan urinib ko\'ring.',
    SERVER_ERROR: 'Server xatosi. Keyinroq urinib ko\'ring.',
    TOO_MANY_ATTEMPTS: 'Juda ko\'p urinishlar. Keyinroq urinib ko\'ring.',
    INVALID_CREDENTIALS: 'Noto\'g\'ri kirish ma\'lumotlari.',
    OTP_EXPIRED: 'Kod muddati tugadi. Yangi kod so\'rang.',
    WRONG_PHONE_NUMBER: 'Noto\'g\'ri telefon raqami. Kiritishni tekshiring.',
    
    OTP_SENT: 'Kod sizning telefon raqamingizga yuborildi',
    LOGIN_SUCCESS: 'Muvaffaqiyatli avtorizatsiya',
    UPDATE_SUCCESS: 'Profil muvaffaqiyatli yangilandi',
    UPDATE_FAILED: 'Profilni yangilashda xatolik',
    
    LOADING: 'Yuklanmoqda...',
    SENDING: 'Yuborilmoqda...',
    VERIFYING: 'Tekshirilmoqda...',
    
    SEND_CODE: 'Kod yuborish',
    VERIFY_CODE: 'Kodni tasdiqlash',
    RESEND_CODE: 'Kodni qayta yuborish',
    BACK: 'Orqaga',
    
    PHONE_HINT: 'Telefon raqamini kiriting,\nunga tekshiruv SMS kodi keladi',
    OTP_HINT: 'Ushbu raqamga yuborilgan kodni kiriting',
    RESEND_HINT: 'Kod kelmadimi?',
    WRONG_NUMBER_HINT: 'Telefon raqamini noto\'g\'ri kiritdingizmi?',
    BACK_TO_PHONE: 'Bu yerga bosing!',
    
    LOGOUT_CONFIRMATION_TITLE: 'Chiqishni tasdiqlash',
    LOGOUT_CONFIRMATION_MESSAGE: 'Hisobingizdan chiqishni xohlaysizmi?',
    LOGOUT_CONFIRM: 'Ha, chiqish',
    LOGOUT_CANCEL: 'Bekor qilish',
  }
};

export const getMessage = (key, language = 'ru') => {
  return MESSAGES[language]?.[key] || MESSAGES.ru[key] || key;
};

export const getApiErrorMessage = (error, language = 'ru') => {
  if (!error) return '';
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
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
