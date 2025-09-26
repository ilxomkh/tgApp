import { useState, useEffect } from 'react';
import { isAccessAllowed, getDeviceInfo } from '../utils/deviceValidation';
import trackingService from '../services/trackingService';

/**
 * Хук для контроля доступа к приложению
 * @returns {Object} состояние доступа и информация об устройстве
 */
export const useAccessControl = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const checkAccess = () => {
      try {
        const allowed = isAccessAllowed();
        const info = getDeviceInfo();
        
        setIsAllowed(allowed);
        setDeviceInfo(info);
        setIsChecking(false);

        // Трекинг попытки доступа
        trackingService.track('access_control_check', {
          is_allowed: allowed,
          is_mobile: info.isMobile,
          is_localhost: info.isLocalhost,
          user_phone: info.userPhone,
          screen_width: info.screenWidth,
          screen_height: info.screenHeight,
          user_agent: info.userAgent
        });

        if (!allowed) {
          // Трекинг отказа в доступе
          trackingService.track('access_denied', {
            reason: !info.isMobile ? 'not_mobile_device' : 'unauthorized_user',
            user_phone: info.userPhone,
            device_type: info.isMobile ? 'mobile' : 'desktop'
          });
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setIsAllowed(false);
        setIsChecking(false);
      }
    };

    // Проверяем доступ сразу
    checkAccess();

    // Проверяем доступ при изменении размера окна
    const handleResize = () => {
      checkAccess();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isAllowed,
    isChecking,
    deviceInfo
  };
};

export default useAccessControl;
