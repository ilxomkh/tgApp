/**
 * Утилиты для отладки контроля доступа
 */

import { getDeviceInfo, isAccessAllowed, getUserPhoneNumber } from './deviceValidation';

/**
 * Выводит подробную информацию об устройстве и доступе в консоль
 */
export const debugAccessControl = () => {
  const deviceInfo = getDeviceInfo();
  const userPhone = getUserPhoneNumber();
  const accessAllowed = isAccessAllowed();

  console.group('🔍 Access Control Debug Info');
  console.log('📱 Device Info:', {
    userAgent: deviceInfo.userAgent,
    isMobile: deviceInfo.isMobile,
    isLocalhost: deviceInfo.isLocalhost,
    screenSize: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
    hasTouch: deviceInfo.hasTouch
  });
  
  console.log('👤 User Info:', {
    phoneNumber: userPhone,
    hasUser: !!userPhone
  });
  
  console.log('🚪 Access Status:', {
    accessAllowed: accessAllowed,
    reason: accessAllowed ? 'Access granted' : 'Access denied'
  });
  
  console.log('📋 Access Rules:', {
    localhost: deviceInfo.isLocalhost,
    mobile: deviceInfo.isMobile,
    allowedPhone: userPhone === '+998336832000'
  });
  
  console.groupEnd();
  
  return {
    deviceInfo,
    userPhone,
    accessAllowed
  };
};

/**
 * Проверяет доступ и возвращает детальную информацию
 * @returns {Object}
 */
export const checkAccessDetailed = () => {
  const deviceInfo = getDeviceInfo();
  const userPhone = getUserPhoneNumber();
  const accessAllowed = isAccessAllowed();

  const reasons = [];
  
  if (deviceInfo.isLocalhost) {
    reasons.push('localhost access');
  }
  
  if (deviceInfo.isMobile) {
    reasons.push('mobile device');
  }
  
  if (userPhone === '+998336832000') {
    reasons.push('allowed phone number');
  }

  return {
    accessAllowed,
    reasons,
    deviceInfo,
    userPhone,
    message: accessAllowed 
      ? `Access granted: ${reasons.join(', ')}`
      : 'Access denied: not mobile device and not allowed user'
  };
};

/**
 * Добавляет глобальные функции для отладки в window объект
 */
export const addDebugToWindow = () => {
  if (typeof window !== 'undefined') {
    window.debugAccess = debugAccessControl;
    window.checkAccess = checkAccessDetailed;
    
    console.log('🔧 Debug functions added to window:');
    console.log('- window.debugAccess() - show detailed access info');
    console.log('- window.checkAccess() - check access with reasons');
  }
};

// Автоматически добавляем функции отладки в development режиме
if (import.meta.env.DEV) {
  addDebugToWindow();
}
