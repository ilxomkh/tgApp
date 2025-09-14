import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import tallyApiService from '../services/tallyApi.js';
import { useSurvey } from '../hooks/useSurvey.js';
import { useHapticClick } from '../utils/hapticFeedback';
import { SuccessModal } from './Main/ui.jsx';

const TallySurvey = ({ surveyId, onComplete, onClose }) => {
  const { language } = useLanguage();
  const { submitSurvey, loading: submitLoading, error: submitError } = useSurvey();
  const [survey, setSurvey] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Собственное состояние загрузки для данных опроса
  const [error, setError] = useState(null);
  const hapticClick = useHapticClick();
  const inputRef = useRef(null);
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false);
  const answersRef = useRef({}); // Ref для хранения ответов без перерендеринга
  const [numberFieldValid, setNumberFieldValid] = useState(false); // Состояние валидности для полей типа number

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const loadSurvey = async () => {
      try {
        // Получаем детальную информацию о форме через новый API
        const details = await tallyApiService.getFormDetails(surveyId);
        
        setFormDetails(details);
        
        // Создаем объект опроса для совместимости
        const surveyData = {
          id: surveyId,
          title: details.title,
          type: 'tally',
          formId: details.formId,
          questions: details.questions
        };
        
        setSurvey(surveyData);
      } catch (err) {
        console.error('❌ Ошибка при загрузке опроса:', err);
        setError(err.message);
        
        // Fallback: создаем базовую структуру опроса
        const fallbackDetails = tallyApiService.getFallbackFormDetails(surveyId);
        
        setFormDetails(fallbackDetails);
        
        const surveyData = {
          id: surveyId,
          title: fallbackDetails.title,
          type: 'tally',
          formId: fallbackDetails.formId,
          questions: fallbackDetails.questions
        };
        
        setSurvey(surveyData);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId]);

  // Отслеживание состояния клавиатуры на мобильных устройствах
  useEffect(() => {
    // Сохраняем изначальную высоту viewport
    const initialViewportHeight = window.innerHeight;
    
    const handleResize = () => {
      // Определяем, открыта ли клавиатура по изменению высоты viewport
      const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
      
      // Если высота уменьшилась более чем на 150px, считаем что клавиатура открыта
      const keyboardThreshold = 150;
      const isKeyboardVisible = initialViewportHeight - currentViewportHeight > keyboardThreshold;
      
      setIsKeyboardOpen(isKeyboardVisible);
    };

    // Слушаем изменения размера viewport
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // Полностью отключаем обработку фокуса для полей number
    const handleFocusIn = (e) => {
      // Игнорируем все события фокуса для полей number
      if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        return;
      }
      
      if (e.target.tagName === 'INPUT' && e.target.type !== 'number') {
        
        setTimeout(() => {
          const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
          const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
          
          setIsKeyboardOpen(isKeyboardVisible);
        }, 100);
      }
    };

    // Дополнительная обработка для iOS Safari
    const handleOrientationChange = () => {
      setTimeout(() => {
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
        setIsKeyboardOpen(isKeyboardVisible);
      }, 500); // Задержка для корректного определения после поворота
    };

    document.addEventListener('focusin', handleFocusIn);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Эффект для восстановления фокуса после перерендеринга
  useEffect(() => {
    if (shouldMaintainFocus && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setShouldMaintainFocus(false);
        }
      }, 0);
    }
  }, [answers, shouldMaintainFocus]);

  // Эффект для инициализации состояния валидности при смене вопроса
  useEffect(() => {
    if (formDetails && formDetails.questions) {
      const currentQuestion = formDetails.questions[currentQuestionIndex];
      const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
      
      if (questionType === 'number') {
        // Проверяем, есть ли уже значение в ref
        const existingValue = answersRef.current[currentQuestion.id];
        const isValid = existingValue !== null && existingValue !== undefined && existingValue !== '';
        setNumberFieldValid(isValid);
      } else {
        // Сбрасываем состояние для не-числовых полей
        setNumberFieldValid(false);
      }
    }
  }, [currentQuestionIndex, formDetails]);

  // Специальный эффект для предотвращения потери фокуса на полях number
  useEffect(() => {
    const currentQuestion = formDetails?.questions?.[currentQuestionIndex];
    const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
    
    if (questionType === 'number') {
      
      // Находим все поля number на странице
      const numberInputs = document.querySelectorAll('input[type="number"]');
      
      numberInputs.forEach(input => {
        // Добавляем дополнительную защиту от потери фокуса
        const handleFocusProtection = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Принудительно сохраняем фокус немедленно - с проверкой
          if (e.target && typeof e.target.focus === 'function') {
            e.target.focus();
          }
          
          // Дополнительная защита через setTimeout
          setTimeout(() => {
            if (e.target && typeof e.target.focus === 'function' && document.activeElement !== e.target) {
              e.target.focus();
            }
          }, 0);
        };
        
        // Добавляем обработчик на несколько событий
        input.addEventListener('blur', handleFocusProtection);
        input.addEventListener('focusout', handleFocusProtection);
        
        // Cleanup функция
        return () => {
          input.removeEventListener('blur', handleFocusProtection);
          input.removeEventListener('focusout', handleFocusProtection);
        };
      });
    }
  }, [currentQuestionIndex, formDetails]);

  const handleAnswerChange = (questionId, value) => {
    // Проверяем тип текущего вопроса
    const currentQuestion = formDetails?.questions?.find(q => q.id === questionId);
    const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
    
    // Для полей типа number НЕ обрабатываем через этот метод
    if (questionType === 'number') {
      return;
    }
    
    hapticClick();
    
    // Обновляем ref для всех типов вопросов
    answersRef.current = {
      ...answersRef.current,
      [questionId]: value
    };
    
    // Для других типов вопросов вызываем setState как обычно
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Функция для проверки валидности ответа на текущий вопрос
  const isCurrentQuestionValid = () => {
    if (!formDetails || !formDetails.questions) return false;
    
    const currentQuestion = formDetails.questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const questionType = getQuestionType(currentQuestion);
    
    // Для полей типа number используем состояние валидности
    if (questionType === 'number') {
      return numberFieldValid;
    }
    
    // Для других типов используем обычную логику
    const answer = answers[currentQuestion.id];
    
    // Если вопрос не обязательный, всегда валиден
    if (!currentQuestion.required) return true;
    
    // Проверяем в зависимости от определенного типа вопроса
    switch (questionType) {
      case 'choice':
        return answer && answer.trim() !== '';
      case 'multichoice':
        return Array.isArray(answer) && answer.length > 0;
      case 'text':
        // Для текстовых вопросов проверяем есть ли опции
        if (currentQuestion.options && currentQuestion.options.length > 0) {
          return answer && answer.trim() !== '';
        }
        return answer && answer.trim() !== '';
      case 'number':
        return answer !== null && answer !== undefined && answer !== '';
      default:
        return answer && answer.trim() !== '';
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < formDetails.questions.length - 1) {
      // Синхронизируем данные из ref в state перед переходом
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      
      // Сбрасываем состояние валидности для полей типа number
      setNumberFieldValid(false);
      
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Синхронизируем данные из ref в state перед переходом
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      
      // Сбрасываем состояние валидности для полей типа number
      setNumberFieldValid(false);
      
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Используем formId из formDetails для отправки
      const formId = formDetails.formId;
      
      // Получаем актуальные данные из DOM для полей типа number
      const currentQuestionForSubmit = formDetails.questions[currentQuestionIndex];
      const questionTypeForSubmit = getQuestionType(currentQuestionForSubmit);
      
      let finalAnswers = { ...answers, ...answersRef.current };
      
      // Если текущий вопрос типа number, получаем актуальное значение из ref
      if (questionTypeForSubmit === 'number') {
        const numberValue = answersRef.current[currentQuestionForSubmit.id];
        if (numberValue !== undefined) {
          finalAnswers[currentQuestionForSubmit.id] = numberValue;
        }
      }
      
      // Подготавливаем данные для отправки
      const submitData = {
        formId,
        answers: finalAnswers,
        language,
        submittedAt: new Date().toISOString(),
        userId: null, // Будет добавлен на сервере если пользователь авторизован
      };

      // Отправляем ответы через useSurvey hook
      const result = await submitSurvey(formId, finalAnswers);
      setIsFormSubmitted(true);
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error('❌ Ошибка при отправке опроса:', err);
      console.error('❌ JSON данных которые не удалось отправить:');
      console.error(JSON.stringify({
        formId: formDetails?.formId,
        answers: finalAnswers,
        language: language,
        submittedAt: new Date().toISOString()
      }, null, 2));
    }
  };

  // Кастомный компонент радиокнопки
  const CustomRadio = ({ checked, onChange, value, label }) => (
    <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-[#7C65FF] hover:bg-[#7C65FF]/5 transition-all duration-200 group active:scale-95">
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          value={value}
          className="sr-only"
        />
        <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
          checked 
            ? 'border-[#7C65FF] bg-[#7C65FF] scale-110' 
            : 'border-gray-300 group-hover:border-[#7C65FF]'
        }`}>
          {checked && (
            <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          )}
        </div>
      </div>
      <span className={`font-medium transition-colors ${
        checked ? 'text-[#7C65FF]' : 'text-gray-700 group-hover:text-[#7C65FF]'
      }`}>
        {label}
      </span>
    </label>
  );

  // Кастомный компонент чекбокса
  const CustomCheckbox = ({ checked, onChange, value, label }) => (
    <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-[#7C65FF] hover:bg-[#7C65FF]/5 transition-all duration-200 group active:scale-95">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          value={value}
          className="sr-only"
        />
        <div className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
          checked 
            ? 'border-[#7C65FF] bg-[#7C65FF] scale-110' 
            : 'border-gray-300 group-hover:border-[#7C65FF]'
        }`}>
          {checked && (
            <svg className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className={`font-medium transition-colors ${
        checked ? 'text-[#7C65FF]' : 'text-gray-700 group-hover:text-[#7C65FF]'
      }`}>
        {label}
      </span>
    </label>
  );

  // Полностью статичный компонент для полей number - БЕЗ React lifecycle
  const NumberInput = ({ questionId, placeholder, className }) => {
    const numberInputRef = useRef(null);
    
    // Дополнительный useEffect для инициализации после первого рендера
    useEffect(() => {
      const input = numberInputRef.current;
      if (input) {
        // Убеждаемся что обработчики установлены
        input.focus();
      }
    }, [questionId]);
    
    // Используем useLayoutEffect для синхронной настройки
    useLayoutEffect(() => {
      const input = numberInputRef.current;
      if (!input) return;
      
      
      // Нативный обработчик ввода
      const handleNativeInput = (e) => {
        const inputValue = e.target.value;
        
        // Обновляем только ref
        answersRef.current = {
          ...answersRef.current,
          [questionId]: inputValue
        };
        
        // Обновляем состояние валидности
        const isValid = inputValue !== null && inputValue !== undefined && inputValue !== '';
        setNumberFieldValid(isValid);
      };
      
      // Нативный обработчик фокуса
      const handleNativeFocus = (e) => {
        // Ничего не делаем, позволяем естественному поведению
      };
      
      // Нативный обработчик потери фокуса - ПОЛНОСТЬЮ БЛОКИРУЕМ
      const handleNativeBlur = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Немедленно возвращаем фокус - с проверкой
        if (e.target && typeof e.target.focus === 'function') {
          e.target.focus();
        }
        
        // Дополнительная защита
        setTimeout(() => {
          if (e.target && typeof e.target.focus === 'function' && document.activeElement !== e.target) {
            e.target.focus();
          }
        }, 0);
      };
      
      // Добавляем нативные обработчики
      input.addEventListener('input', handleNativeInput);
      input.addEventListener('focus', handleNativeFocus);
      input.addEventListener('blur', handleNativeBlur);
      input.addEventListener('focusout', handleNativeBlur);
      input.addEventListener('focusin', handleNativeFocus);
      
      return () => {
        input.removeEventListener('input', handleNativeInput);
        input.removeEventListener('focus', handleNativeFocus);
        input.removeEventListener('blur', handleNativeBlur);
        input.removeEventListener('focusout', handleNativeBlur);
        input.removeEventListener('focusin', handleNativeFocus);
      };
    }, [questionId]);
    
    return (
      <div className="relative">
        <input
          ref={numberInputRef}
          type="number"
          defaultValue=""
          className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] transition-all duration-200 text-center text-lg font-medium bg-white focus:scale-105 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="numeric"
          enterKeyHint="done"
          pattern="[0-9]*"
          step="1"
          style={{
            WebkitUserSelect: 'text',
            userSelect: 'text',
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
      </div>
    );
  };

  // Кастомный компонент инпута для не-number полей
  const CustomInput = ({ type, value, onChange, placeholder, className = "", onKeyPress }) => {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value || ''}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] transition-all duration-200 text-center text-lg font-medium bg-white focus:scale-105 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="text"
          enterKeyHint="next"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
      </div>
    );
  };

  // Локализованные тексты
  const texts = {
    ru: {
      questionCounter: 'Вопрос',
      of: 'из',
      requiredField: 'Этот вопрос обязателен для заполнения',
      keyboardHint: '💡 Опросник поднят для удобства ввода',
      enterNumber: 'Введите число',
      enterAnswer: 'Введите ответ',
      back: '← Назад',
      next: 'Далее →',
      finish: '✓ Завершить',
      submitting: 'Отправка...',
      thankYou: 'Спасибо! Ваш ответ отправлен.',
      loadingError: 'Ошибка загрузки опроса',
      surveyError: 'Ошибка при отправке опроса',
      congratulations: 'Поздравляем!',
      surveyCompleted: 'Опрос успешно завершен!',
      close: 'Закрыть'
    },
    uz: {
      questionCounter: 'Savol',
      of: 'dan',
      requiredField: 'Bu savol to\'ldirish majburiy',
      keyboardHint: '💡 So\'rovnoma kiritish uchun ko\'tarildi',
      enterNumber: 'Raqam kiriting',
      enterAnswer: 'Javob kiriting',
      back: '← Orqaga',
      next: 'Keyingi →',
      finish: '✓ Yakunlash',
      submitting: 'Yuborilmoqda...',
      thankYou: 'Rahmat! Javobingiz yuborildi.',
      loadingError: 'So\'rovni yuklashda xatolik',
      surveyError: 'So\'rovni yuborishda xatolik',
      congratulations: 'Tabriklaymiz!',
      surveyCompleted: 'So\'rovnoma muvaffaqiyatli yakunlandi!',
      close: 'Yopish'
    }
  };

  const t = texts[language] || texts.ru;

  // Обработчик нажатия Enter для инпутов
  const handleKeyPress = (e) => {
    // Для полей типа number НЕ обрабатываем Enter - позволяем стандартное поведение
    if (e.target.type === 'number') {
      return;
    }
    
    // Для других полей предотвращаем стандартное поведение Enter
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Функция для определения типа вопроса с дополнительной логикой
  const getQuestionType = (question) => {
    const type = question.type?.toLowerCase();
    
    // Если тип явно указан как множественный выбор
    if (['multichoice', 'multiple_choice', 'checkbox'].includes(type)) {
      return 'multichoice';
    }
    
    // Если тип явно указан как одиночный выбор
    if (['choice', 'single_choice', 'radio'].includes(type)) {
      return 'choice';
    }
    
    // Дополнительная логика для определения типа по тексту вопроса
    const questionText = question.text?.toLowerCase() || '';
    const multipleChoiceKeywords = [
      'можно выбрать несколько',
      'выберите несколько',
      'отметьте все подходящие',
      'можно отметить несколько',
      'несколько вариантов',
      'все подходящие',
      'отметьте все'
    ];
    
    // Проверяем есть ли ключевые слова для множественного выбора
    const isMultipleChoice = multipleChoiceKeywords.some(keyword => 
      questionText.includes(keyword)
    );
    
    if (isMultipleChoice) {
      return 'multichoice';
    }
    
    // Если есть опции и тип не определен, считаем одиночным выбором
    if (question.options && question.options.length > 0) {
      return 'choice';
    }
    
    return type || 'text';
  };

  // Компонент для отображения вопроса
  const QuestionComponent = ({ question }) => {
    const questionType = getQuestionType(question);
    
    // Для полей типа number используем данные из ref, для остальных - из state
    const currentAnswer = questionType === 'number' 
      ? answersRef.current[question.id] 
      : answers[question.id];

    const renderQuestionInput = () => {
      switch (questionType) {
        case 'choice':
          return (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <CustomRadio
                  key={index}
                    checked={currentAnswer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  value={option}
                  label={option}
                  />
              ))}
            </div>
          );

        case 'multichoice':
          return (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <CustomCheckbox
                  key={index}
                    checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleAnswerChange(question.id, newValues);
                    }}
                  value={option}
                  label={option}
                  />
              ))}
            </div>
          );

        case 'number':
          return (
            <NumberInput
              questionId={question.id}
              placeholder={t.enterNumber}
              className="focus:outline-none focus:ring-0 focus:border-[#7C65FF]"
            />
          );

        case 'text':
          // Если у текстового вопроса есть опции, показываем их как радиокнопки
          if (question.options && question.options.length > 0) {
          return (
            <div className="space-y-3">
                {question.options.map((option, index) => (
                  <CustomRadio
                    key={index}
                    checked={currentAnswer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    value={option}
                    label={option}
                  />
              ))}
            </div>
            );
          }
          // Если опций нет, показываем текстовый инпут
          return (
            <CustomInput
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.enterAnswer}
            />
          );

        default:
          return (
            <CustomInput
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.enterAnswer}
            />
          );
      }
    };

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-relaxed px-2">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {question.required && !isCurrentQuestionAnswered && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {t.requiredField}
            </p>
          )}
          {isKeyboardOpen && (question.type === 'number' || (question.type === 'text' && (!question.options || question.options.length === 0))) && (
            <p className="text-xs text-blue-500 mt-2">
              {t.keyboardHint}
            </p>
          )}
        </div>
        <div className="max-w-md mx-auto px-2">
          {renderQuestionInput()}
        </div>
      </div>
    );
  };

  // Компонент скелетона для загрузки
  const SkeletonLoader = () => {
    return (
      <div className={`bg-white border-b border-px border-gray-200 rounded-t-3xl overflow-hidden flex flex-col relative z-10 transition-all duration-500 ease-in-out`} style={{ height: '400px' }}>
        {/* Скелетон заголовка */}
        <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] p-4 sm:p-6 relative overflow-hidden flex-shrink-0">
          <div className="w-full">
            <div className="h-6 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded-lg w-1/3 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Скелетон прогресс-бара */}
        <div className="bg-gray-100 h-1">
          <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] h-1 w-1/4 animate-pulse"></div>
        </div>

        {/* Скелетон контента */}
        <div className="flex-1 p-4 sm:p-6 bg-gray-50">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse"></div>
            </div>
            <div className="max-w-md mx-auto px-2">
              <div className="space-y-3">
                {/* Скелетон опций */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div className="h-5 bg-gray-200 rounded-lg flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Скелетон навигации */}
        <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex-shrink-0 pb-20">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="p-3 rounded-full bg-gray-200 animate-pulse w-12 h-12"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
            <div className="p-3 rounded-full bg-gray-200 animate-pulse w-12 h-12"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          {t.loadingError}
        </p>
      </div>
    );
  }

  if (isFormSubmitted) {
    return (

        <div className="relative z-10 w-full">
        <div className="bg-white pb-32 rounded-t-3xl p-8 text-center shadow-2xl transform transition-all duration-500 scale-100">
          {/* Иконка успеха */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

           {/* Заголовок */}
           <h2 className="text-2xl font-bold text-[#5E5AF6] mb-4">
             {t.congratulations}
           </h2>

           {/* Сообщение */}
           <p className="text-gray-600 text-base leading-relaxed mb-8">
             {t.surveyCompleted}
           </p>

           {/* Кнопка закрытия */}
           <button
             onClick={onClose}
             className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6A4CFF] to-[#7A5CFF] text-white font-semibold shadow-lg active:scale-[0.99] transition-all duration-200 hover:shadow-xl"
           >
             {t.close}
           </button>
        </div>
      </div>

    );
  }

  if (!survey || !formDetails) {
    return null;
  }

  const currentQuestion = formDetails.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === formDetails.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isCurrentQuestionAnswered = isCurrentQuestionValid();

  // Вычисляем динамическую высоту на основе количества опций
  const getModalHeight = () => {
    const currentQuestion = formDetails.questions[currentQuestionIndex];
    const questionType = getQuestionType(currentQuestion);
    
    // Базовая высота для заголовка (80px) + прогресс-бар (12px) + навигация (100px) + отступ для BottomNav (80px)
    let baseHeight = 272;
    
    // Высота для текста вопроса (примерно 60px)
    baseHeight += 60;
    
    if (questionType === 'choice' || questionType === 'multichoice') {
      const optionsCount = currentQuestion.options?.length || 0;
      if (optionsCount > 0) {
        // Высота каждой опции: 56px (padding + border) + отступы между опциями: 12px
        const optionsHeight = optionsCount * 56 + (optionsCount - 1) * 12;
        baseHeight += optionsHeight;
      }
    } else {
      // Для текстовых полей фиксированная высота
      baseHeight += 80;
    }
    
    // Добавляем отступы контента (24px сверху и снизу)
    baseHeight += 48;
    
    // Ограничиваем максимальную высоту
    const maxHeight = window.innerHeight * 0.75;
    const minHeight = 360; // Минимальная высота с учетом отступа для BottomNav
    
    return Math.max(minHeight, Math.min(baseHeight, maxHeight));
  };

  const modalHeight = getModalHeight();

  // Определяем, нужно ли поднимать опросник
  const currentQuestionForLift = formDetails?.questions?.[currentQuestionIndex];
  const questionTypeForLift = currentQuestionForLift ? getQuestionType(currentQuestionForLift) : 'unknown';
  
  // Для полей типа number НЕ поднимаем опросник, чтобы избежать потери фокуса
  const shouldLiftSurvey = isKeyboardOpen && questionTypeForLift !== 'number';

  return (
    <div className={`bg-white border-b border-px border-gray-200 rounded-t-3xl overflow-hidden flex flex-col relative z-10 transition-all duration-500 ease-in-out ${
      shouldLiftSurvey ? 'transform -translate-y-32' : ''
    }`} style={{ height: `${modalHeight}px` }}>
      {/* Заголовок - адаптивный */}
      <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] p-4 sm:p-6 relative overflow-hidden flex-shrink-0">
        {/* Декоративные элементы */}
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-16 top-6 w-40 h-40 rounded-full bg-white/10" />
        
        <div className="w-full">
          <h2 className="text-white text-lg sm:text-xl font-bold text-center relative z-10">
            {survey.title}
          </h2>
          <div className="text-white/90 text-xs sm:text-sm text-center mt-1 sm:mt-2 relative z-10">
            {t.questionCounter} {currentQuestionIndex + 1} {t.of} {formDetails.questions.length}
          </div>
        </div>
      </div>

      {/* Прогресс бар - тонкий */}
      <div className="bg-gray-100 h-1">
        <div 
          className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] h-1 transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / formDetails.questions.length) * 100}%` }}
        />
      </div>

      {/* Контент вопроса - адаптивный с кастомным скроллбаром */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50 custom-scrollbar">
        <QuestionComponent question={currentQuestion} />
      </div>

      {/* Навигация - адаптивная */}
      <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex-shrink-0 pb-25">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <button
            onClick={isFirstQuestion ? onClose : handlePreviousQuestion}
            className={`p-3 rounded-full font-semibold transition-all duration-200 text-sm sm:text-base flex items-center justify-center ${
              isFirstQuestion 
                ? 'bg-red-100 hover:bg-red-200 text-red-600 active:scale-95' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            {currentQuestionIndex + 1} / {formDetails.questions.length}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleFormSubmit}
              disabled={submitLoading || !isCurrentQuestionAnswered}
              className={`p-3 font-semibold rounded-full transition-all duration-200 active:scale-95 text-sm sm:text-base flex items-center justify-center ${
                submitLoading || !isCurrentQuestionAnswered
                ? 'bg-[#8888FC] text-white/80 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#5538F9] to-[#7C65FF] hover:from-[#4A2FE8] hover:to-[#6B4FFF] text-white'
              }`}
            >
              {submitLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!isCurrentQuestionAnswered}
              className={`p-3 font-semibold rounded-full transition-all duration-200 active:scale-95 text-sm sm:text-base flex items-center justify-center ${
                !isCurrentQuestionAnswered
                  ? 'bg-[#8888FC] text-white/80 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#5538F9] to-[#7C65FF] hover:from-[#4A2FE8] hover:to-[#6B4FFF] text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TallySurvey;
