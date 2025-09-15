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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hapticClick = useHapticClick();
  const inputRef = useRef(null);
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false);
  const answersRef = useRef({});
  const [numberFieldValid, setNumberFieldValid] = useState(false);

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
    const initialViewportHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
      
      const keyboardThreshold = 150;
      const isKeyboardVisible = initialViewportHeight - currentViewportHeight > keyboardThreshold;
      
      setIsKeyboardOpen(isKeyboardVisible);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    const handleFocusIn = (e) => {
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

    const handleOrientationChange = () => {
      setTimeout(() => {
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
        setIsKeyboardOpen(isKeyboardVisible);
      }, 500);
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

  const handleAnswerChange = (questionId, value) => {
    const currentQuestion = formDetails?.questions?.find(q => q.id === questionId);
    const questionType = currentQuestion ? getQuestionType(currentQuestion) : 'unknown';
    
    if (questionType === 'number') {
      return;
    }
    
    hapticClick();
    
    answersRef.current = {
      ...answersRef.current,
      [questionId]: value
    };
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < formDetails.questions.length - 1) {
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      
      setNumberFieldValid(false);
      
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setAnswers(prev => ({ ...prev, ...answersRef.current }));
      
      setNumberFieldValid(false);
      
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    try {
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

  const NumberInput = ({ questionId, placeholder, className }) => {
    const [value, setValue] = useState(answersRef.current[questionId] || "");
    const inputRef = useRef(null);
  
    useEffect(() => {
      const existingValue = answersRef.current[questionId] || "";
      setValue(existingValue);
  
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [questionId]);
  
    const handleChange = (e) => {
      const inputValue = e.target.value;
  
      setValue(inputValue);
  
      answersRef.current = {
        ...answersRef.current,
        [questionId]: inputValue
      };
  
      setNumberFieldValid(inputValue !== "");
    };
  
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleChange}
          className={`w-full p-4 border-2 border-gray-200 rounded-xl 
            focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] 
            transition-all duration-200 text-center text-lg font-medium 
            bg-white focus:scale-105 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="numeric"
          enterKeyHint="done"
          step="1"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r 
          from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none 
          opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
      </div>
    );
  };
  
  

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
      'отметьте все'
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

  const QuestionComponent = ({ question }) => {
    const questionType = getQuestionType(question);
    
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
        </div>
        <div className="max-w-md mx-auto px-2">
          {renderQuestionInput()}
        </div>
      </div>
    );
  };

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

        <div className="relative z-10 w-full">
        <div className="bg-white pb-32 rounded-t-3xl p-8 text-center shadow-2xl transform transition-all duration-500 scale-100">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

           <h2 className="text-2xl font-bold text-[#5E5AF6] mb-4">
             {t.congratulations}
           </h2>

           <p className="text-gray-600 text-base leading-relaxed mb-8">
             {t.surveyCompleted}
           </p>

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

  const getModalHeight = () => {
    const currentQuestion = formDetails.questions[currentQuestionIndex];
    const questionType = getQuestionType(currentQuestion);
    
    let baseHeight = 272;
    
    baseHeight += 60;
    
    if (questionType === 'choice' || questionType === 'multichoice') {
      const optionsCount = currentQuestion.options?.length || 0;
      if (optionsCount > 0) {
        const optionsHeight = optionsCount * 56 + (optionsCount - 1) * 12;
        baseHeight += optionsHeight;
      }
    } else {
      baseHeight += 80;
    }

    baseHeight += 48;
    
    const maxHeight = window.innerHeight * 0.75;
    const minHeight = 360;
    
    return Math.max(minHeight, Math.min(baseHeight, maxHeight));
  };

  const modalHeight = getModalHeight();

  const currentQuestionForLift = formDetails?.questions?.[currentQuestionIndex];
  const questionTypeForLift = currentQuestionForLift ? getQuestionType(currentQuestionForLift) : 'unknown';
  
  const shouldLiftSurvey = isKeyboardOpen && questionTypeForLift !== 'number';

  return (
    <div className={`bg-white border-b border-px border-gray-200 rounded-t-3xl overflow-hidden flex flex-col relative z-10 transition-all duration-500 ease-in-out ${
      shouldLiftSurvey ? 'transform -translate-y-32' : ''
    }`} style={{ height: `${modalHeight}px` }}>
      <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] p-4 sm:p-6 relative overflow-hidden flex-shrink-0">
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

      <div className="bg-gray-100 h-1">
        <div 
          className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] h-1 transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / formDetails.questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50 custom-scrollbar">
        <QuestionComponent question={currentQuestion} />
      </div>

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
