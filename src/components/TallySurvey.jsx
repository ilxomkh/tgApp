import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import tallyApiService from '../services/tallyApi.js';
import { useSurvey } from '../hooks/useSurvey.js';
import { useHapticClick } from '../utils/hapticFeedback';

const TallySurvey = ({ surveyId, onComplete, onClose }) => {
  const { language } = useLanguage();
  const { submitSurvey, loading, error } = useSurvey();
  const [survey, setSurvey] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const hapticClick = useHapticClick();

  useEffect(() => {
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

    // Также слушаем события фокуса на инпутах
    const handleFocusIn = (e) => {
      if (e.target.tagName === 'INPUT') {
        // Небольшая задержка для корректного определения высоты клавиатуры
        setTimeout(() => {
          const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
          const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
          setIsKeyboardOpen(isKeyboardVisible);
        }, 100);
      }
    };

    const handleFocusOut = () => {
      // Небольшая задержка перед закрытием клавиатуры
      setTimeout(() => {
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
        setIsKeyboardOpen(isKeyboardVisible);
      }, 100);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Дополнительная обработка для iOS Safari
    const handleOrientationChange = () => {
      setTimeout(() => {
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        const isKeyboardVisible = currentViewportHeight < window.innerHeight * 0.75;
        setIsKeyboardOpen(isKeyboardVisible);
      }, 500); // Задержка для корректного определения после поворота
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleAnswerChange = (questionId, value) => {
    hapticClick();
    
    const question = formDetails?.questions?.find(q => q.id === questionId);
    const questionType = question ? getQuestionType(question) : 'unknown';
    
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
    
    const answer = answers[currentQuestion.id];
    const questionType = getQuestionType(currentQuestion);
    
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
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Используем formId из formDetails для отправки
      const formId = formDetails.formId;
      
      // Подготавливаем данные для отправки
      const submitData = {
        formId,
        answers,
        language,
        submittedAt: new Date().toISOString(),
        userId: null, // Будет добавлен на сервере если пользователь авторизован
      };

      // Отправляем ответы через useSurvey hook
      const result = await submitSurvey(formId, answers);
      setIsFormSubmitted(true);
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error('❌ Ошибка при отправке опроса:', err);
      console.error('❌ JSON данных которые не удалось отправить:');
      console.error(JSON.stringify({
        formId: formDetails?.formId,
        answers: answers,
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

  // Кастомный компонент инпута
  const CustomInput = ({ type, value, onChange, placeholder, className = "", onKeyPress }) => (
    <div className="relative">
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C65FF] focus:border-[#7C65FF] transition-all duration-200 text-center text-lg font-medium bg-white focus:scale-105 ${className}`}
        placeholder={placeholder}
        autoComplete="off"
        inputMode={type === 'number' ? 'numeric' : 'text'}
        enterKeyHint="done"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
    </div>
  );

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
      surveyError: 'Ошибка при отправке опроса'
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
      surveyError: 'So\'rovni yuborishda xatolik'
    }
  };

  const t = texts[language] || texts.ru;

  // Обработчик нажатия Enter для инпутов
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Убираем фокус с инпута, что закроет клавиатуру
      e.target.blur();
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
    const currentAnswer = answers[question.id];
    const questionType = getQuestionType(question);

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
            <CustomInput
              type="number"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.enterNumber}
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
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-relaxed">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {question.required && !isCurrentQuestionAnswered && (
            <p className="text-sm text-red-500 mt-1">
              {t.requiredField}
            </p>
          )}
          {isKeyboardOpen && (question.type === 'number' || (question.type === 'text' && (!question.options || question.options.length === 0))) && (
            <p className="text-xs text-blue-500 mt-2">
              {t.keyboardHint}
            </p>
          )}
        </div>
        <div className="max-w-md mx-auto">
          {renderQuestionInput()}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <p className="text-green-800 font-medium">
          {t.thankYou}
        </p>
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

  return (
    <div className={`bg-white border-b border-px border-gray-200 max-h-[60vh] rounded-t-3xl overflow-hidden flex-1 flex flex-col relative z-10 transition-all duration-300 ease-in-out ${
      isKeyboardOpen ? 'transform -translate-y-32 max-h-[80vh]' : ''
    }`}>
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] p-6 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-16 top-6 w-40 h-40 rounded-full bg-white/10" />
        
        <h2 className="text-white text-xl font-bold text-center relative z-10">
          {survey.title}
        </h2>
        <div className="text-white/90 text-sm text-center mt-2 relative z-10">
          {t.questionCounter} {currentQuestionIndex + 1} {t.of} {formDetails.questions.length}
        </div>
      </div>

      {/* Прогресс бар */}
      <div className="bg-gray-100 h-3">
        <div 
          className="bg-gradient-to-r from-[#5538F9] to-[#7C65FF] h-3 transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / formDetails.questions.length) * 100}%` }}
        />
      </div>

      {/* Контент вопроса */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <QuestionComponent question={currentQuestion} />
      </div>

      {/* Навигация */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={isFirstQuestion}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              isFirstQuestion 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95'
            }`}
          >
              {t.back}
          </button>

          <div className="text-sm text-gray-500 font-medium">
            {currentQuestionIndex + 1} / {formDetails.questions.length}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleFormSubmit}
              disabled={loading || !isCurrentQuestionAnswered}
              className={`px-8 py-3 font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                loading || !isCurrentQuestionAnswered
                ? 'bg-[#8888FC] text-white/80 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#5538F9] to-[#7C65FF] hover:from-[#4A2FE8] hover:to-[#6B4FFF] text-white'
              }`}
            >
              {loading ? t.submitting : t.finish}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!isCurrentQuestionAnswered}
              className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                !isCurrentQuestionAnswered
                  ? 'bg-[#8888FC] text-white/80 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#5538F9] to-[#7C65FF] hover:from-[#4A2FE8] hover:to-[#6B4FFF] text-white'
              }`}
            >
              {t.next}
            </button>
          )}
        </div>

        {/* Кнопка закрытия убрана - теперь используется BottomNav */}
      </div>
    </div>
  );
};

export default TallySurvey;
