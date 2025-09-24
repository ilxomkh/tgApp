import React, { useState } from 'react';
import { SuccessModal } from './ui';
import WaveOverlay from '../WaveOverlay';
import ProSVG from '../../assets/Pro.svg';
import TallySurvey from '../TallySurvey';
import BottomNav from './BottomNav';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import CloseConfirmationModal from '../CloseConfirmationModal.jsx';
import { isCustomInputOption, getCustomInputPlaceholder } from '../../utils/customInputDetection.js';
import { useKeyboard } from '../../hooks/useKeyboard.js';

const SurveyModal = ({ isOpen, onClose, survey, onComplete, t }) => {
  const { language } = useLanguage();
  const { isKeyboardOpen } = useKeyboard();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyResult, setSurveyResult] = useState(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [activeCustomInput, setActiveCustomInput] = useState(null);

  const texts = {
    ru: {
      questionCounter: 'Вопрос',
      of: 'из',
      questionLoading: 'Вопрос загружается...',
      back: 'Назад',
      next: 'Далее',
      finish: 'Завершить',
      home: 'Главная',
      invite: 'Пригласить',
      lottery: 'Итоги',
      profile: 'Профиль',
      exitTitle: 'Выйти из опроса?',
      exitMessage: 'Вы действительно хотите выйти из опроса? Ваши ответы не будут сохранены.',
      exitConfirm: 'Да, выйти',
      exitCancel: 'Отмена'
    },
    uz: {
      questionCounter: 'Savol',
      of: 'dan',
      questionLoading: 'Savol yuklanmoqda...',
      back: 'Orqaga',
      next: 'Keyingi',
      finish: 'Yakunlash',
      home: 'Asosiy',
      invite: 'Taklif qilish',
      lottery: 'Natijalar',
      profile: 'Profil',
      exitTitle: 'So\'rovnomani tark etish?',
      exitMessage: 'Haqiqatan ham so\'rovnomani tark etmoqchimisiz? Javoblaringiz saqlanmaydi.',
      exitConfirm: 'Ha, chiqish',
      exitCancel: 'Bekor qilish'
    }
  };

  const localizedTexts = texts[language] || texts.ru;

  if (!isOpen || !survey) return null;

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
      'daromadingiz manbalari',
      'manbalari qanday',
      'daromad',
      'manbalari',
      'shaxsiy daromadingiz',
      'qanday manbalar',
      'ijtimoiy tarmoqlardan',
      'qaysi ijtimoiy',
      'ijtimoiy tarmoqlar',
      'tarmoqlardan foydalanasiz',
      'bo\'sh vaqtingizni',
      'qanday o\'tkazasiz',
      'bo\'sh vaqt',
      'vaqtingizni qanday',
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

  const handleAnswer = (questionId, answer, isMultiple = false, optionIndex = null) => {
    if (!isMultiple && isCustomInputOption(answer)) {
      setActiveCustomInput({
        questionId,
        optionIndex,
        value: ''
      });
      return;
    }

    if (isMultiple) {
      if (isCustomInputOption(answer)) {
        setActiveCustomInput({
          questionId,
          optionIndex,
          value: ''
        });
      } else {
        setAnswers(prev => {
          const currentValues = Array.isArray(prev[questionId]) ? prev[questionId] : [];
          const newValues = currentValues.includes(answer)
            ? currentValues.filter(v => v !== answer)
            : [...currentValues, answer];
          return {
            ...prev,
            [questionId]: newValues
          };
        });
      }
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const handleCustomInputChange = (value) => {
    if (activeCustomInput) {
      setActiveCustomInput(prev => ({
        ...prev,
        value
      }));
    }
  };

  const handleCustomInputBlur = () => {
    if (activeCustomInput) {
      const question = survey.questions.find(q => q.id === activeCustomInput.questionId);
      const questionType = question ? getQuestionType(question) : 'unknown';
      const finalValue = activeCustomInput.value.trim();
      
      if (finalValue) {
        if (questionType === 'multichoice') {
          const currentValues = Array.isArray(answers[activeCustomInput.questionId]) ? answers[activeCustomInput.questionId] : [];
          
          const filteredValues = currentValues.filter(v => v !== question.options[activeCustomInput.optionIndex].value);
          const newValues = [...filteredValues, finalValue];
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: newValues
          }));
        } else {
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: finalValue
          }));
        }
      }
      
      setActiveCustomInput(null);
    }
  };

  const saveCustomInputIfActive = () => {
    if (activeCustomInput) {
      const question = survey.questions.find(q => q.id === activeCustomInput.questionId);
      const questionType = question ? getQuestionType(question) : 'unknown';
      const finalValue = activeCustomInput.value.trim();
      
      if (finalValue) {
        if (questionType === 'multichoice') {
          const currentValues = Array.isArray(answers[activeCustomInput.questionId]) ? answers[activeCustomInput.questionId] : [];
          
          const filteredValues = currentValues.filter(v => v !== question.options[activeCustomInput.optionIndex].value);
          const newValues = [...filteredValues, finalValue];
          
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: newValues
          }));
        } else {
          setAnswers(prev => ({
            ...prev,
            [activeCustomInput.questionId]: finalValue
          }));
        }
      }
      
      setActiveCustomInput(null);
    }
  };

  const handleNext = () => {
    saveCustomInputIfActive();
    
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeSurvey();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeSurvey = async () => {
    try {
      saveCustomInputIfActive();
      
      const result = await onComplete(survey.id, answers);
      setSurveyResult(result);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing survey:', error);
    }
  };

  const closeModal = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setSurveyResult(null);
    
    // Закрываем модальное окно сразу, так как список уже обновлен
    onClose();
  };

  const handleCloseClick = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    closeModal();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const question = survey.questions[currentQuestion];
  const isLastQuestion = currentQuestion === survey.questions.length - 1;
  const questionType = getQuestionType(question);
  const isMultipleChoice = questionType === 'multichoice';
  const canProceed = isMultipleChoice 
    ? Array.isArray(answers[question?.id]) && answers[question?.id].length > 0
    : answers[question?.id];

  if (survey?.type === 'tally') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] flex flex-col">
        <div className="absolute inset-0">
          <WaveOverlay />
        </div>
        
        <div className="flex justify-center pt-20 pb-4 relative z-10">
          <img src={ProSVG} alt="Pro" className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"/>
        </div>
        
        <div className="flex justify-center items-end flex-1 relative z-10">
          <div className="w-full max-w-lg">
            <TallySurvey
              surveyId={survey.id}
              onComplete={(result) => {
                setSurveyResult(result);
                setIsCompleted(true);
              }}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && surveyResult) {
    return (
      <SuccessModal
        isOpen={true}
        onClose={closeModal}
        surveyResult={surveyResult}
        t={t}
        language={language}
      />
    );
  }

  return (
    <>
    <img src={ProSVG} className='absolute w-[250px] top-1/5 right-1/2 left-1/2 -translate-x-1/2 z-999'/>
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]" />
      <WaveOverlay />
      <div className="relative z-10 w-full">
        <div className={`bg-white rounded-t-3xl p-8 shadow-2xl ${
          isKeyboardOpen ? 'pb-32' : ''
        }`}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {localizedTexts.questionCounter} {currentQuestion + 1} {localizedTexts.of} {survey.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / survey.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#6A4CFF] to-[#7A5CFF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / survey.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {question?.text || localizedTexts.questionLoading}
          </h3>

          <div className="space-y-3 mb-8">
            {question?.options?.map((option, index) => {
              const isCustomOption = isCustomInputOption(option.value);
              const isActiveCustomInput = activeCustomInput?.questionId === question.id && activeCustomInput?.optionIndex === index;
              const isSelected = isMultipleChoice 
                ? Array.isArray(answers[question.id]) && (
                    answers[question.id].includes(option.value) ||
                    (isCustomOption && activeCustomInput?.questionId === question.id && activeCustomInput?.value.trim())
                  )
                : answers[question.id] === option.value;
              
              return (
                <div key={index}>
                  {isActiveCustomInput ? (
                    <input
                      type="text"
                      value={activeCustomInput.value}
                      onChange={(e) => handleCustomInputChange(e.target.value)}
                      onBlur={handleCustomInputBlur}
                      placeholder={getCustomInputPlaceholder(option.value, language)}
                      className="w-full px-4 py-3 border-2 border-[#6A4CFF] rounded-xl focus:outline-none focus:border-[#6A4CFF] text-gray-800 placeholder-gray-400"
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  ) : (
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#6A4CFF] bg-[#6A4CFF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type={isMultipleChoice ? "checkbox" : "radio"}
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleAnswer(question.id, option.value, isMultipleChoice, index)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 mr-3 flex items-center justify-center ${
                        isMultipleChoice ? 'rounded' : 'rounded-full'
                      } ${
                        isSelected
                          ? 'border-[#6A4CFF]'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className={`w-3 h-3 bg-[#6A4CFF] ${
                            isMultipleChoice ? 'rounded' : 'rounded-full'
                          }`} />
                        )}
                      </div>
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={currentQuestion === 0 ? handleCloseClick : handlePrevious}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentQuestion === 0
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {currentQuestion === 0 ? localizedTexts.exitConfirm : localizedTexts.back}
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-[#6A4CFF] to-[#7A5CFF] text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? localizedTexts.finish : localizedTexts.next}
            </button>
          </div>
        </div>
        </div>
      </div>

      <CloseConfirmationModal
        isOpen={showExitConfirmation}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        title={localizedTexts.exitTitle}
        message={localizedTexts.exitMessage}
        confirmText={localizedTexts.exitConfirm}
        cancelText={localizedTexts.exitCancel}
      />
    </>
  );
};

export default SurveyModal;
