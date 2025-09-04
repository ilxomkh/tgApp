import React, { useState } from 'react';
import { SuccessModal } from './ui';
import WaveOverlay from '../WaveOverlay';
import ProSVG from '../../assets/Pro.svg';
import TallySurvey from '../TallySurvey';

const SurveyModal = ({ isOpen, onClose, survey, onComplete, t }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyResult, setSurveyResult] = useState(null);

  if (!isOpen || !survey) return null;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Опрос завершен
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
      // Здесь будет вызов API для отправки ответов
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
    onClose();
  };

  const question = survey.questions[currentQuestion];
  const isLastQuestion = currentQuestion === survey.questions.length - 1;
  const canProceed = answers[question?.id];

  // Если это Tally форма, показываем специальный компонент
  if (survey?.type === 'tally') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
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
    );
  }

  if (isCompleted && surveyResult) {
    return (
      <SuccessModal
        isOpen={true}
        onClose={closeModal}
        surveyResult={surveyResult}
        t={t}
      />
    );
  }

  return (
    <>
    <img src={ProSVG} className='absolute w-[250px] top-1/4 right-1/2 left-1/2 -translate-x-1/2 z-999'/>
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]" />
      <WaveOverlay />
      {/* Модальное окно */}
      <div className="relative z-10 w-full">
        <div className="bg-white rounded-t-3xl p-8 shadow-2xl">
          {/* Прогресс */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Вопрос {currentQuestion + 1} из {survey.questions.length}
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

          {/* Вопрос */}
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {question?.text || "Вопрос загружается..."}
          </h3>

          {/* Варианты ответов */}
          <div className="space-y-3 mb-8">
            {question?.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[question.id] === option.value
                    ? 'border-[#6A4CFF] bg-[#6A4CFF]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[question.id] === option.value
                    ? 'border-[#6A4CFF]'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === option.value && (
                    <div className="w-3 h-3 rounded-full bg-[#6A4CFF]" />
                  )}
                </div>
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>

          {/* Кнопки навигации */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Назад
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
              {isLastQuestion ? 'Завершить' : 'Далее'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SurveyModal;
