import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import trackingService from '../services/trackingService.js';

/**
 * Хук для автоматического трекинга действий пользователя
 * @param {Object} options - опции трекинга
 * @param {boolean} options.trackPageViews - трекать просмотры страниц
 * @param {boolean} options.trackTimeOnPage - трекать время на странице
 * @param {string} options.pageName - название страницы (если не указано, берется из location)
 */
export const useTracking = (options = {}) => {
  const {
    trackPageViews = true,
    trackTimeOnPage = true,
    pageName = null
  } = options;

  const location = useLocation();
  const pageStartTime = useRef(null);
  const previousLocation = useRef(null);

  // Трекинг просмотров страниц
  useEffect(() => {
    if (!trackPageViews) return;

    const currentPage = pageName || location.pathname;
    const previousPage = previousLocation.current;

    // Трекаем переход на новую страницу
    if (previousPage && previousPage !== currentPage) {
      trackingService.trackNavigation(previousPage, currentPage);
    }

    // Трекаем просмотр страницы
    trackingService.track('page_view', {
      page_name: currentPage,
      page_title: document.title,
      referrer: previousPage
    });

    previousLocation.current = currentPage;
  }, [location.pathname, trackPageViews, pageName]);

  // Трекинг времени на странице
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const currentPage = pageName || location.pathname;
    pageStartTime.current = Date.now();

    // Функция для трекинга времени при уходе со страницы
    const trackTimeOnPageExit = () => {
      if (pageStartTime.current) {
        const timeSpent = Date.now() - pageStartTime.current;
        trackingService.trackTimeOnPage(currentPage, timeSpent);
      }
    };

    // Трекаем время при уходе со страницы
    return () => {
      trackTimeOnPageExit();
    };
  }, [location.pathname, trackTimeOnPage, pageName]);

  // Трекаем время при закрытии/обновлении страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pageStartTime.current && trackTimeOnPage) {
        const currentPage = pageName || location.pathname;
        const timeSpent = Date.now() - pageStartTime.current;
        trackingService.trackTimeOnPage(currentPage, timeSpent, true); // immediate = true
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname, trackTimeOnPage, pageName]);

  // Функции для ручного трекинга
  const trackAction = useCallback((actionName, context = {}) => {
    trackingService.track(actionName, context);
  }, []);

  const trackButtonClick = useCallback((buttonName, location, additionalContext = {}) => {
    trackingService.trackButtonClick(buttonName, location, additionalContext);
  }, []);

  const trackModalOpen = useCallback((modalName, context = {}) => {
    trackingService.trackModalOpen(modalName, context);
  }, []);

  const trackModalClose = useCallback((modalName, closeMethod = 'unknown') => {
    trackingService.trackModalClose(modalName, closeMethod);
  }, []);

  const trackFormSubmit = useCallback((formName, formData = {}, success = true) => {
    trackingService.trackFormSubmit(formName, formData, success);
  }, []);

  const trackError = useCallback((errorType, errorMessage, context = {}) => {
    trackingService.trackError(errorType, errorMessage, context);
  }, []);

  const trackSurveyAction = useCallback((action, surveyId, context = {}) => {
    trackingService.trackSurveyAction(action, surveyId, context);
  }, []);

  const trackProfileAction = useCallback((action, context = {}) => {
    trackingService.trackProfileAction(action, context);
  }, []);

  const trackReferralAction = useCallback((action, context = {}) => {
    trackingService.trackReferralAction(action, context);
  }, []);

  const trackPaymentAction = useCallback((action, context = {}) => {
    trackingService.trackPaymentAction(action, context);
  }, []);

  return {
    trackAction,
    trackButtonClick,
    trackModalOpen,
    trackModalClose,
    trackFormSubmit,
    trackError,
    trackSurveyAction,
    trackProfileAction,
    trackReferralAction,
    trackPaymentAction
  };
};

/**
 * Хук для трекинга кликов по кнопкам
 * @param {string} buttonName - название кнопки
 * @param {string} location - где находится кнопка
 * @param {Object} additionalContext - дополнительный контекст
 */
export const useButtonTracking = (buttonName, location, additionalContext = {}) => {
  const { trackButtonClick } = useTracking();

  const handleClick = useCallback((event) => {
    trackButtonClick(buttonName, location, {
      ...additionalContext,
      element_type: event.target.tagName,
      element_class: event.target.className
    });
  }, [trackButtonClick, buttonName, location, additionalContext]);

  return handleClick;
};

/**
 * Хук для трекинга модальных окон
 * @param {string} modalName - название модального окна
 */
export const useModalTracking = (modalName) => {
  const { trackModalOpen, trackModalClose } = useTracking();

  const handleOpen = useCallback((context = {}) => {
    trackModalOpen(modalName, context);
  }, [trackModalOpen, modalName]);

  const handleClose = useCallback((closeMethod = 'button') => {
    trackModalClose(modalName, closeMethod);
  }, [trackModalClose, modalName]);

  return {
    handleOpen,
    handleClose
  };
};

/**
 * Хук для трекинга форм
 * @param {string} formName - название формы
 */
export const useFormTracking = (formName) => {
  const { trackFormSubmit } = useTracking();

  const handleSubmit = useCallback((formData = {}, success = true) => {
    // Удаляем чувствительные данные перед отправкой
    const sanitizedData = { ...formData };
    delete sanitizedData.password;
    delete sanitizedData.otp;
    delete sanitizedData.token;
    delete sanitizedData.card_number;

    trackFormSubmit(formName, sanitizedData, success);
  }, [trackFormSubmit, formName]);

  return handleSubmit;
};

/**
 * Хук для трекинга ошибок
 */
export const useErrorTracking = () => {
  const { trackError } = useTracking();

  const trackErrorAction = useCallback((errorType, errorMessage, context = {}) => {
    trackError(errorType, errorMessage, {
      ...context,
      stack_trace: new Error().stack
    });
  }, [trackError]);

  return trackErrorAction;
};

export default useTracking;
