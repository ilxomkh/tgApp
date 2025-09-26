/**
 * Утилиты для проверки устройства и ограничения доступа
 */

/**
 * Проверяет, является ли устройство мобильным
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  // Проверяем user agent
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Список мобильных устройств
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'opera mini', 'iemobile'
  ];
  
  // Проверяем наличие мобильных ключевых слов
  const hasMobileKeyword = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
  
  // Проверяем размер экрана (дополнительная проверка)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Проверяем touch события
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return hasMobileKeyword || (isSmallScreen && hasTouch);
};

/**
 * Проверяет, является ли текущий домен localhost
 * @returns {boolean}
 */
export const isLocalhost = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname === '0.0.0.0' ||
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         hostname.endsWith('.local');
};

/**
 * Получает номер телефона пользователя из localStorage
 * @returns {string|null}
 */
export const getUserPhoneNumber = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.phone_number || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user phone number:', error);
    return null;
  }
};

/**
 * Список разрешенных номеров телефонов для доступа с любого устройства
 */
const ALLOWED_PHONE_NUMBERS = [
  '+998336832000',
  '+998998514993',
  // Добавьте другие номера по необходимости
];

/**
 * Проверяет, разрешен ли доступ с текущего устройства
 * @returns {boolean}
 */
export const isAccessAllowed = () => {
  // Разрешаем доступ с localhost
  if (isLocalhost()) {
    return true;
  }
  
  // Проверяем, является ли устройство мобильным
  if (isMobileDevice()) {
    return true;
  }
  
  // Проверяем, есть ли у пользователя разрешенный номер телефона
  const userPhone = getUserPhoneNumber();
  if (userPhone && ALLOWED_PHONE_NUMBERS.includes(userPhone)) {
    return true;
  }
  
  return false;
};

/**
 * Получает информацию об устройстве для отладки
 * @returns {Object}
 */
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    isMobile: isMobileDevice(),
    isLocalhost: isLocalhost(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    userPhone: getUserPhoneNumber(),
    isAccessAllowed: isAccessAllowed()
  };
};

/**
 * Компонент для отображения сообщения об ограничении доступа
 */
export const AccessDeniedMessage = () => {
  return {
    title: 'Доступ ограничен',
    message: 'Это приложение предназначено для использования на мобильных устройствах. Пожалуйста, откройте приложение на телефоне или планшете.',
    titleUz: 'Kirish cheklangan',
    messageUz: 'Bu ilova mobil qurilmalarda foydalanish uchun mo\'ljallangan. Iltimos, ilovani telefon yoki planshetdan oching.'
  };
};
