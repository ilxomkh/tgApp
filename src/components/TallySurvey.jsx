import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import tallyApiService from '../services/tallyApi.js';
import { useSurvey } from '../hooks/useSurvey.js';
import { useHapticClick } from '../utils/hapticFeedback';
import { SuccessModal } from './Main/ui.jsx';
import CloseConfirmationModal from './CloseConfirmationModal.jsx';
import { isCustomInputOption, getCustomInputPlaceholder } from '../utils/customInputDetection.js';
import { useKeyboard } from '../hooks/useKeyboard.js';

const TallySurvey = ({ surveyId, onComplete, onClose }) => {
  const { language } = useLanguage();
  const { refreshUserProfile } = useAuth();
  const { submitSurvey, loading: submitLoading, error: submitError } = useSurvey();
  const { isKeyboardOpen, scrollToActiveElement } = useKeyboard();
  const [survey, setSurvey] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hapticClick = useHapticClick();
  const inputRef = useRef(null);
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false);
  const answersRef = useRef({});
  const [numberFieldValid, setNumberFieldValid] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [activeCustomInput, setActiveCustomInput] = useState(null); // {questionId, optionIndex, value}

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const loadSurvey = async () => {
      try {
        const details = await tallyApiService.getFormDetails(surveyId);
        
        setFormDetails(details);
        
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

  useEffect(() => {
    if (formDetails && formDetails.questions) {
      const currentQuestion = formDetails.questions[currentQuestionIndex];
      const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
      
      if (questionType === 'number') {
        const existingValue = answersRef.current[currentQuestion.id];
        const isValid = existingValue !== null && existingValue !== undefined && existingValue !== '';
        setNumberFieldValid(isValid);
      } else {
        setNumberFieldValid(false);
      }
    }
  }, [currentQuestionIndex, formDetails]);

  useEffect(() => {
    const currentQuestion = formDetails?.questions?.[currentQuestionIndex];
    const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
    
    if (questionType === 'number') {
      
      const numberInputs = document.querySelectorAll('input[type="number"]');
      
      numberInputs.forEach(input => {
        const handleFocusProtection = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          if (e.target && typeof e.target.focus === 'function') {
            e.target.focus();
          }
          
          setTimeout(() => {
            if (e.target && typeof e.target.focus === 'function' && document.activeElement !== e.target) {
              e.target.focus();
            }
          }, 0);
        };
        
        input.addEventListener('blur', handleFocusProtection);
        input.addEventListener('focusout', handleFocusProtection);
        
        return () => {
          input.removeEventListener('blur', handleFocusProtection);
          input.removeEventListener('focusout', handleFocusProtection);
        };
      });
    }
  }, [currentQuestionIndex, formDetails]);

  const handleAnswerChange = useCallback((questionId, value, optionIndex = null) => {
    const currentQuestion = formDetails?.questions?.find(q => q.id === questionId);
    const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
    
    if (questionType === 'number') {
      return;
    }
    
    hapticClick();
    
    // Проверяем, является ли выбранный вариант пользовательским вводом
    if (isCustomInputOption(value)) {
      setActiveCustomInput({
        questionId,
        optionIndex,
        value: ''
      });
      // Прокручиваем к полю ввода после небольшой задержки
      setTimeout(() => {
        scrollToActiveElement(150);
      }, 100);
      return;
    }
    
    answersRef.current = {
      ...answersRef.current,
      [questionId]: value
    };
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, [formDetails, hapticClick]);

  const handleCustomInputChange = useCallback((value) => {
    if (activeCustomInput) {
      setActiveCustomInput(prev => ({
        ...prev,
        value
      }));
      
      // НЕ сохраняем промежуточные значения в финальные ответы
      // Сохранение произойдет только при потере фокуса (onBlur)
    }
  }, [activeCustomInput]);

  const handleCustomInputBlur = useCallback(() => {
    if (activeCustomInput) {
      const currentQuestion = formDetails?.questions?.find(q => q.id === activeCustomInput.questionId);
      const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
      const finalValue = activeCustomInput.value.trim();
      
      if (finalValue) {
        if (questionType === 'multichoice') {
          // Для multichoice сохраняем как массив
          const currentValues = Array.isArray(answers[activeCustomInput.questionId]) ? answers[activeCustomInput.questionId] : [];
          
          // Удаляем оригинальный вариант и добавляем пользовательский ввод
          const filteredValues = currentValues.filter(v => v !== currentQuestion.options[activeCustomInput.optionIndex]);
          const newValues = [...filteredValues, finalValue];
          
          answersRef.current = {
            ...answersRef.current,
            [activeCustomInput.questionId]: newValues
          };
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: newValues
          }));
        } else {
          // Для обычных вопросов сохраняем как строку
          answersRef.current = {
            ...answersRef.current,
            [activeCustomInput.questionId]: finalValue
          };
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: finalValue
          }));
        }
      }
      
      setActiveCustomInput(null);
    }
  }, [activeCustomInput, formDetails, answers]);

  const saveCustomInputIfActive = useCallback(() => {
    if (activeCustomInput) {
      const currentQuestion = formDetails?.questions?.find(q => q.id === activeCustomInput.questionId);
      const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
      const finalValue = activeCustomInput.value.trim();
      
      if (finalValue) {
        if (questionType === 'multichoice') {
          // Для multichoice сохраняем как массив
          const currentValues = Array.isArray(answers[activeCustomInput.questionId]) ? answers[activeCustomInput.questionId] : [];
          
          // Удаляем оригинальный вариант и добавляем пользовательский ввод
          const filteredValues = currentValues.filter(v => v !== currentQuestion.options[activeCustomInput.optionIndex]);
          const newValues = [...filteredValues, finalValue];
          
          answersRef.current = {
            ...answersRef.current,
            [activeCustomInput.questionId]: newValues
          };
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: newValues
          }));
        } else {
          // Для обычных вопросов сохраняем как строку
          answersRef.current = {
            ...answersRef.current,
            [activeCustomInput.questionId]: finalValue
          };
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: finalValue
          }));
        }
      }
      
      setActiveCustomInput(null);
    }
  }, [activeCustomInput, formDetails, answers]);

  const isCurrentQuestionValid = () => {
    if (!formDetails || !formDetails.questions) return false;
    
    const currentQuestion = formDetails.questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const questionType = getQuestionType(currentQuestion);
    
    if (questionType === 'number') {
      return numberFieldValid;
    }
    
    const answer = answers[currentQuestion.id];
    
    if (!currentQuestion.required) return true;
    
    switch (questionType) {
      case 'choice':
        return answer && answer.trim() !== '';
      case 'multichoice':
        return Array.isArray(answer) && answer.length > 0;
      case 'text':
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

  const getNextQuestionIndex = useCallback((currentIndex, answers) => {
    if (!formDetails?.questions || currentIndex >= formDetails.questions.length - 1) {
      return null; // Нет следующего вопроса
    }

    const currentQuestion = formDetails.questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id];

    console.log('🔍 Проверка логики скипа:', {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      currentAnswer,
      logic: currentQuestion.logic
    });

    // Проверяем логику завершения опроса (end_if)
    if (currentQuestion.logic && currentQuestion.logic.end_if) {
      const endConditions = Array.isArray(currentQuestion.logic.end_if) 
        ? currentQuestion.logic.end_if 
        : [currentQuestion.logic.end_if];
      
      console.log('🏁 Проверка логики завершения опроса:', endConditions);
      
      const shouldEnd = endConditions.includes(currentAnswer);
      console.log('🏁 Условие завершения:', { currentAnswer, endConditions, shouldEnd });
      
      if (shouldEnd) {
        console.log('🏁 Завершаем опрос!');
        // Возвращаем специальное значение для завершения опроса
        return 'END_SURVEY';
      }
    }

    // Проверяем логику скипа для текущего вопроса
    if (currentQuestion.logic && currentQuestion.logic.skip) {
      const skipCondition = currentQuestion.logic.skip;
      
      console.log('📋 Условие скипа:', skipCondition);
      
      // Проверяем условие скипа
      let shouldSkip = false;
      
      // Логика может быть массивом условий или одним объектом
      const conditions = Array.isArray(skipCondition) ? skipCondition : [skipCondition];
      
      for (const condition of conditions) {
        console.log('🔍 Проверяем условие:', condition);
        
        if (condition.answer !== undefined) {
          // Прямое сравнение ответа
          shouldSkip = currentAnswer === condition.answer;
          console.log('✅ Прямое сравнение:', { currentAnswer, skipAnswer: condition.answer, shouldSkip });
        } else if (condition.answers && Array.isArray(condition.answers)) {
          // Проверка на вхождение в массив ответов
          shouldSkip = condition.answers.includes(currentAnswer);
          console.log('✅ Проверка массива:', { currentAnswer, skipAnswers: condition.answers, shouldSkip });
        } else if (condition.condition) {
          // Более сложные условия (можно расширить)
          switch (condition.condition) {
            case 'equals':
              shouldSkip = currentAnswer === condition.value;
              break;
            case 'not_equals':
              shouldSkip = currentAnswer !== condition.value;
              break;
            case 'contains':
              shouldSkip = Array.isArray(currentAnswer) && currentAnswer.includes(condition.value);
              break;
            case 'not_contains':
              shouldSkip = !Array.isArray(currentAnswer) || !currentAnswer.includes(condition.value);
              break;
            default:
              shouldSkip = false;
          }
          console.log('✅ Условная проверка:', { condition: condition.condition, value: condition.value, shouldSkip });
        }
        
        // Если условие выполнено, выходим из цикла
        if (shouldSkip) break;
      }

      if (shouldSkip) {
        console.log('🚀 Выполняем скип!');
        
        // Используем первое условие для определения куда переходить
        const firstCondition = conditions[0];
        
        // Пропускаем указанное количество вопросов или переходим к конкретному вопросу
        if (firstCondition.skip_to || firstCondition.skipTo) {
          // Переходим к конкретному вопросу (поддерживаем оба формата)
          const targetQuestionId = firstCondition.skip_to || firstCondition.skipTo;
          const targetIndex = formDetails.questions.findIndex(q => q.id === targetQuestionId);
          console.log('🎯 Переход к вопросу:', targetQuestionId, 'индекс:', targetIndex);
          return targetIndex !== -1 ? targetIndex : currentIndex + 1;
        } else if (firstCondition.skipCount || firstCondition.skip_count) {
          // Пропускаем указанное количество вопросов (поддерживаем оба формата)
          const skipCount = firstCondition.skipCount || firstCondition.skip_count;
          const nextIndex = Math.min(currentIndex + skipCount + 1, formDetails.questions.length - 1);
          console.log('⏭️ Пропускаем вопросов:', skipCount, 'следующий индекс:', nextIndex);
          return nextIndex;
        } else {
          // Пропускаем один вопрос по умолчанию
          const nextIndex = Math.min(currentIndex + 2, formDetails.questions.length - 1);
          console.log('⏭️ Пропускаем 1 вопрос по умолчанию, следующий индекс:', nextIndex);
          return nextIndex;
        }
      } else {
        console.log('❌ Условие скипа не выполнено');
      }
    } else {
      console.log('ℹ️ Логика скипа отсутствует для вопроса:', currentQuestion.id);
    }

    // Обычный переход к следующему вопросу
    const nextIndex = currentIndex + 1;
    console.log('➡️ Обычный переход к следующему вопросу:', nextIndex);
    return nextIndex;
  }, [formDetails]);

  const handleNextQuestion = useCallback(() => {
    if (!formDetails?.questions) return;
    
    // Сохраняем активный пользовательский ввод перед переходом
    saveCustomInputIfActive();
    
    const allAnswers = { ...answers, ...answersRef.current };
    console.log('🔄 Переход к следующему вопросу:', {
      currentIndex: currentQuestionIndex,
      allAnswers,
      currentQuestion: formDetails.questions[currentQuestionIndex]
    });
    
    const nextIndex = getNextQuestionIndex(currentQuestionIndex, allAnswers);
    
    console.log('📍 Следующий индекс:', nextIndex);
    
    if (nextIndex === 'END_SURVEY') {
      console.log('🏁 Завершаем опрос по логике end_if');
      // Завершаем опрос и показываем SuccessModal
      handleFormSubmit();
      return;
    }
    
    if (nextIndex !== null && nextIndex < formDetails.questions.length) {
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      setNumberFieldValid(false);
      setCurrentQuestionIndex(nextIndex);
    }
  }, [currentQuestionIndex, formDetails, getNextQuestionIndex, answers, answersRef, saveCustomInputIfActive]);

  const getPreviousQuestionIndex = useCallback((currentIndex, answers) => {
    if (!formDetails?.questions || currentIndex <= 0) {
      return null; // Нет предыдущего вопроса
    }

    // Простая логика для кнопки "Назад" - переходим к предыдущему вопросу
    // В будущем можно добавить более сложную логику для отслеживания пропущенных вопросов
    return currentIndex - 1;
  }, [formDetails]);

  const handlePreviousQuestion = useCallback(() => {
    if (!formDetails?.questions) return;
    
    const prevIndex = getPreviousQuestionIndex(currentQuestionIndex, { ...answers, ...answersRef.current });
    
    if (prevIndex !== null && prevIndex >= 0) {
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      setNumberFieldValid(false);
      setCurrentQuestionIndex(prevIndex);
    }
  }, [currentQuestionIndex, formDetails, getPreviousQuestionIndex, answers]);

  const isLastQuestion = useCallback(() => {
    if (!formDetails?.questions) return false;
    
    const nextIndex = getNextQuestionIndex(currentQuestionIndex, { ...answers, ...answersRef.current });
    
    // Если следующий шаг - завершение опроса, то это последний вопрос
    if (nextIndex === 'END_SURVEY') {
      return true;
    }
    
    return nextIndex === null || nextIndex >= formDetails.questions.length;
  }, [currentQuestionIndex, formDetails, getNextQuestionIndex, answers, answersRef]);

  const handleFormSubmit = async () => {
    try {
      // Сохраняем активный пользовательский ввод перед отправкой
      saveCustomInputIfActive();
      
      const formId = formDetails.formId;
      
      const currentQuestionForSubmit = formDetails.questions[currentQuestionIndex];
      const questionTypeForSubmit = getQuestionType(currentQuestionForSubmit);
      
      let finalAnswers = { ...answers, ...answersRef.current };
      
      if (questionTypeForSubmit === 'number') {
        const numberValue = answersRef.current[currentQuestionForSubmit.id];
        if (numberValue !== undefined) {
          finalAnswers[currentQuestionForSubmit.id] = numberValue;
        }
      }
      
      const submitData = {
        formId,
        answers: finalAnswers,
        language,
        submittedAt: new Date().toISOString(),
        userId: null,
      };

      const result = await submitSurvey(formId, finalAnswers);
      setIsFormSubmitted(true);
      
      // Обновляем профиль пользователя после успешного завершения опроса
      await refreshUserProfile();
      
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

  const handleCloseClick = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onClose();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  // Обработка кнопки "Назад" Telegram
  useEffect(() => {
    const handleTelegramBack = () => {
      setShowExitConfirmation(true);
    };

    // Регистрируем обработчик для кнопки "Назад" Telegram
    if (window.setSurveyModalState) {
      window.setSurveyModalState({
        isSurveyModalOpen: true,
        closeSurveyModal: handleTelegramBack
      });
    }

    return () => {
      // Очищаем состояние при размонтировании
      if (window.setSurveyModalState) {
        window.setSurveyModalState({
          isSurveyModalOpen: false,
          closeSurveyModal: null
        });
      }
    };
  }, []);

  const CustomRadio = React.memo(({ checked, onChange, value, label }) => (
    <label className="flex items-center space-x-3 cursor-pointer px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-[#7C65FF] hover:bg-[#7C65FF]/5 transition-all duration-200 group active:scale-95">
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          value={value}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          checked 
            ? 'border-[#7C65FF] bg-[#7C65FF] scale-110' 
            : 'border-gray-300 group-hover:border-[#7C65FF]'
        }`}>
          {checked && (
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span className={`font-medium text-sm transition-colors ${
        checked ? 'text-[#7C65FF]' : 'text-gray-700 group-hover:text-[#7C65FF]'
      }`}>
        {label}
      </span>
    </label>
  ));

  const CustomCheckbox = React.memo(({ checked, onChange, value, label }) => (
    <label className="flex items-center space-x-3 cursor-pointer px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-[#7C65FF] hover:bg-[#7C65FF]/5 transition-all duration-200 group active:scale-95">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          value={value}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
          checked 
            ? 'border-[#7C65FF] bg-[#7C65FF] scale-110' 
            : 'border-gray-300 group-hover:border-[#7C65FF]'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className={`font-medium text-sm transition-colors ${
        checked ? 'text-[#7C65FF]' : 'text-gray-700 group-hover:text-[#7C65FF]'
      }`}>
        {label}
      </span>
    </label>
  ));

  const NumberInput = React.memo(({ questionId, placeholder, className }) => {
    const [value, setValue] = useState(answersRef.current[questionId] || "");
    const inputRef = useRef(null);
  
    useEffect(() => {
      const existingValue = answersRef.current[questionId] || "";
      setValue(existingValue);
  
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [questionId]);
  
    const handleChange = useCallback((e) => {
      const inputValue = e.target.value;
  
      setValue(inputValue);
  
      answersRef.current = {
        ...answersRef.current,
        [questionId]: inputValue
      };
  
      setNumberFieldValid(inputValue !== "");
    }, [questionId]);
  
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl 
            focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] 
            transition-all duration-200 text-center text-base font-medium 
            bg-white focus:scale-105 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="numeric"
          enterKeyHint="done"
          step="1"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r 
          from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none 
          opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
      </div>
    );
  });
  
  

  const CustomInput = React.memo(({ type, value, onChange, placeholder, className = "", onKeyPress }) => {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value || ''}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] transition-all duration-200 text-center text-base font-medium bg-white focus:scale-105 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="text"
          enterKeyHint="next"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
      </div>
    );
  });

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
      close: 'Закрыть',
      exitTitle: 'Выйти из опроса?',
      exitMessage: 'Вы действительно хотите выйти из опроса? Ваши ответы не будут сохранены.',
      exitConfirm: 'Да, выйти',
      exitCancel: 'Отмена'
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
      close: 'Yopish',
      exitTitle: 'So\'rovnomani tark etish?',
      exitMessage: 'Haqiqatan ham so\'rovnomani tark etmoqchimisiz? Javoblaringiz saqlanmaydi.',
      exitConfirm: 'Ha, chiqish',
      exitCancel: 'Bekor qilish'
    }
  };

  const t = texts[language] || texts.ru;

  const handleKeyPress = (e) => {
    if (e.target.type === 'number') {
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const getQuestionType = (question) => {
    const type = question.type?.toLowerCase();
    
    if (['multichoice', 'multiple_choice', 'checkbox'].includes(type)) {
      return 'multichoice';
    }
    
    if (['choice', 'single_choice', 'radio'].includes(type)) {
      return 'choice';
    }
    
    const questionText = question.text?.toLowerCase() || '';
    const multipleChoiceKeywords = [
      'можно выбрать несколько',
      'выберите несколько',
      'отметьте все подходящие',
      'можно отметить несколько',
      'несколько вариантов',
      'все подходящие',
      'отметьте все',
      'источники вашего личного дохода',
      'каковы источники',
      'источники дохода',
      'доходы от',
      'какие источники',
      'какие соц. сети',
      'социальные сети',
      'соц. сети',
      'как вы проводите',
      'свободное время',
      'какие платформы',
      'какие сервисы',
      'какие приложения',
      // Uzbek keywords for income sources
      'daromadingiz manbalari',
      'manbalari qanday',
      'daromad',
      'manbalari',
      'shaxsiy daromadingiz',
      'qanday manbalar',
      // Uzbek keywords for social networks
      'ijtimoiy tarmoqlardan',
      'qaysi ijtimoiy',
      'ijtimoiy tarmoqlar',
      'tarmoqlardan foydalanasiz',
      // Uzbek keywords for free time
      'bo\'sh vaqtingizni',
      'qanday o\'tkazasiz',
      'bo\'sh vaqt',
      'vaqtingizni qanday',
      // Uzbek keywords for banking and payment services
      'bank yoki to\'lov',
      'qaysi bank',
      'to\'lov xizmatlaridan',
      'bank xizmatlaridan',
      'xizmatlaridan foydalanasiz',
      'bank yoki',
      'to\'lov xizmatlari'
    ];
    
    const isMultipleChoice = multipleChoiceKeywords.some(keyword => 
      questionText.includes(keyword)
    );
    
    if (isMultipleChoice) {
      return 'multichoice';
    }
    
    if (question.options && question.options.length > 0) {
      return 'choice';
    }
    
    return type || 'text';
  };

  const QuestionComponent = React.memo(({ question }) => {
    const questionType = getQuestionType(question);
    
    const currentAnswer = questionType === 'number' 
      ? answersRef.current[question.id] 
      : answers[question.id];

    const renderQuestionInput = useCallback(() => {
      switch (questionType) {
        case 'choice':
          return (
            <div className="space-y-1">
              {question.options?.map((option, index) => {
                const isCustomOption = isCustomInputOption(option);
                const isActiveCustomInput = activeCustomInput?.questionId === question.id && activeCustomInput?.optionIndex === index;
                const isSelected = currentAnswer === option || (isCustomOption && activeCustomInput?.questionId === question.id);
                
                return (
                  <div key={index}>
                    {isActiveCustomInput ? (
                      <input
                        type="text"
                        value={activeCustomInput.value}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        onBlur={handleCustomInputBlur}
                        placeholder={getCustomInputPlaceholder(option, language)}
                        className="w-full px-4 py-3 border-2 border-[#6A4CFF] rounded-xl focus:outline-none focus:border-[#6A4CFF] text-gray-800 placeholder-gray-400"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    ) : (
                      <CustomRadio
                        checked={isSelected}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value, index)}
                        value={option}
                        label={option}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );

        case 'multichoice':
          return (
            <div className="space-y-1">
              {question.options?.map((option, index) => {
                const isCustomOption = isCustomInputOption(option);
                const isActiveCustomInput = activeCustomInput?.questionId === question.id && activeCustomInput?.optionIndex === index;
                const isChecked = Array.isArray(currentAnswer) && (
                  currentAnswer.includes(option) || 
                  (isCustomOption && activeCustomInput?.questionId === question.id && activeCustomInput?.value.trim())
                );
                
                return (
                  <div key={index}>
                    {isActiveCustomInput ? (
                      <input
                        type="text"
                        value={activeCustomInput.value}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        onBlur={handleCustomInputBlur}
                        placeholder={getCustomInputPlaceholder(option, language)}
                        className="w-full px-4 py-3 border-2 border-[#6A4CFF] rounded-xl focus:outline-none focus:border-[#6A4CFF] text-gray-800 placeholder-gray-400"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    ) : (
                      <CustomCheckbox
                        checked={isChecked}
                        onChange={(e) => {
                          if (isCustomOption && e.target.checked) {
                            // Для пользовательского варианта активируем inline ввод
                            setActiveCustomInput({
                              questionId: question.id,
                              optionIndex: index,
                              value: ''
                            });
                            // Прокручиваем к полю ввода после небольшой задержки
                            setTimeout(() => {
                              scrollToActiveElement(150);
                            }, 100);
                          } else {
                            // Для обычных вариантов работаем с массивом
                            const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
                            const newValues = e.target.checked
                              ? [...currentValues, option]
                              : currentValues.filter(v => v !== option);
                            handleAnswerChange(question.id, newValues);
                          }
                        }}
                        value={option}
                        label={option}
                      />
                    )}
                  </div>
                );
              })}
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
          if (question.options && question.options.length > 0) {
          return (
            <div className="space-y-1">
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
    }, [questionType, question, currentAnswer, handleAnswerChange, handleKeyPress, t, activeCustomInput, handleCustomInputChange, handleCustomInputBlur, language]);

    return (
      <div className="space-y-1 sm:space-y-1">
        {renderQuestionInput()}
      </div>
    );
  });

  const SkeletonLoader = () => {
    return (
      <div className={`bg-white border-b border-px border-gray-200 rounded-t-3xl overflow-hidden flex flex-col relative z-10 transition-all duration-500 ease-in-out`} style={{ height: '400px' }}>
        <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] p-4 sm:p-6 relative overflow-hidden flex-shrink-0">
          <div className="w-full">
            <div className="h-6 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded-lg w-1/3 mx-auto animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gray-100 h-1">
          <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] h-1 w-1/4 animate-pulse"></div>
        </div>

        <div className="flex-1 p-4 sm:p-6 bg-gray-50">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse"></div>
            </div>
            <div className="max-w-md mx-auto px-2">
              <div className="space-y-3">
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
      <SuccessModal
        isOpen={true}
        onClose={onClose}
        surveyResult={{
          message: t.surveyCompleted
        }}
        t={t}
        language={language}
      />
    );
  }

  if (!survey || !formDetails) {
    return null;
  }

  const currentQuestion = formDetails.questions[currentQuestionIndex];
  const isLastQuestionValue = isLastQuestion();
  const isFirstQuestion = currentQuestionIndex === 0;
  const isCurrentQuestionAnswered = isCurrentQuestionValid();

  const getModalHeight = () => {
    const currentQuestion = formDetails.questions[currentQuestionIndex];
    const questionType = getQuestionType(currentQuestion);
    
    let baseHeight = 400;
    
    baseHeight += 80;
    
    if (questionType === 'choice' || questionType === 'multichoice') {
      const optionsCount = currentQuestion.options?.length || 0;
      if (optionsCount > 0) {
        const optionsHeight = optionsCount * 64 + (optionsCount - 1) * 16;
        baseHeight += optionsHeight;
      }
    } else {
      baseHeight += 100;
    }

    baseHeight += 60;
    
    const maxHeight = window.innerHeight * 0.85;
    const minHeight = 500;
    
    return Math.max(minHeight, Math.min(baseHeight, maxHeight));
  };

  const modalHeight = getModalHeight();


  return (
    <>
      <div className="fixed inset-0 flex flex-col">
        <div className="bg-gradient-to-r from-[#5538F9] pt-28 to-[#7C65FF]  relative overflow-hidden flex-shrink-0 z-10 flex items-end justify-end">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -right-16 top-6 w-40 h-40 rounded-full bg-white/10" />
          
          <div className="w-full pb-2">
            <h2 className="text-white text-xl sm:text-2xl font-semibold text-center relative z-10">
              {survey.title}
            </h2>
          </div>
        </div>

        <div className="bg-gray-100 h-1 z-10">
          <div 
            className="bg-gradient-to-r from-[#2196F3] to-[#2196F3] h-1 transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / formDetails.questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-gray-50 py-4 px-4 sm:py-6 sm:px-6 flex-shrink-0 z-10">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-relaxed px-2">
              {currentQuestion.text}
            </h3>
          </div>
        </div>

        <div className={`flex-1 p-2 sm:p-6 pb-32 overflow-y-auto bg-gray-50 survey-answers-scroll z-10 transition-all duration-300 ease-out ${
          isKeyboardOpen ? 'transform -translate-y-32' : ''
        }`} style={{ 
          height: isKeyboardOpen ? `calc(100vh - 300px)` : `calc(100vh - 450px)`,
          maxHeight: isKeyboardOpen ? '60vh' : 'none'
        }}>
          <div className="max-w-md mx-auto px-2">
            <QuestionComponent question={currentQuestion} />
          </div>
        </div>

        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-6 px-4 sm:py-8 sm:px-6 z-20 transition-all duration-300 ${
          isKeyboardOpen ? 'transform translate-y-0' : ''
        }`}>
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <button
              onClick={isFirstQuestion ? handleCloseClick : handlePreviousQuestion}
              className={`p-4 rounded-full font-semibold transition-all duration-200 text-base flex items-center justify-center ${
                isFirstQuestion 
                  ? 'bg-red-100 hover:bg-red-200 text-red-600 active:scale-95' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-sm sm:text-base text-gray-500 font-medium">
              {currentQuestionIndex + 1} / {formDetails.questions.length}
            </div>

            {isLastQuestionValue ? (
              <button
                onClick={handleFormSubmit}
                disabled={submitLoading || !isCurrentQuestionAnswered}
                className={`p-4 font-semibold rounded-full transition-all duration-200 active:scale-95 text-base flex items-center justify-center ${
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
                className={`p-4 font-semibold rounded-full transition-all duration-200 active:scale-95 text-base flex items-center justify-center ${
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

      <CloseConfirmationModal
        isOpen={showExitConfirmation}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        title={t.exitTitle}
        message={t.exitMessage}
        confirmText={t.exitConfirm}
        cancelText={t.exitCancel}
      />
    </>
  );
};

export default TallySurvey;
