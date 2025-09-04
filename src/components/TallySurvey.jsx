import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import tallyWebhookService from '../services/tallyWebhook.js';
import { useSurvey } from '../hooks/useSurvey.js';

const TallySurvey = ({ surveyId, onComplete, onClose }) => {
  const { language } = useLanguage();
  const { getSurvey, submitSurvey, loading, error } = useSurvey();
  const [survey, setSurvey] = useState(null);
  const [formUrl, setFormUrl] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const surveyData = await getSurvey(surveyId);
        setSurvey(surveyData);
        setFormUrl(surveyData.formUrl);
      } catch (err) {
        console.error('Error loading survey:', err);
      }
    };

    loadSurvey();
  }, [surveyId, getSurvey]);

  const handleFormSubmit = async (answers) => {
    try {
      const result = await submitSurvey(surveyId, answers);
      setIsFormSubmitted(true);
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error('Error submitting survey:', err);
    }
  };

  const handleFormMessage = (event) => {
    // Обработка сообщений от iframe с Tally формы
    if (event.origin !== 'https://tally.so') {
      return;
    }

    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'form-submitted') {
        // Форма была отправлена
        handleFormSubmit(data.answers || {});
      }
    } catch (err) {
      console.error('Error parsing form message:', err);
    }
  };

  useEffect(() => {
    // Добавляем слушатель сообщений от iframe
    window.addEventListener('message', handleFormMessage);
    
    return () => {
      window.removeEventListener('message', handleFormMessage);
    };
  }, []);

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
          {language === 'ru' ? 'Ошибка загрузки опроса' : 'So\'rovni yuklashda xatolik'}
        </p>
      </div>
    );
  }

  if (isFormSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <p className="text-green-800 font-medium">
          {language === 'ru' 
            ? 'Спасибо! Ваш ответ отправлен.' 
            : 'Rahmat! Javobingiz yuborildi.'
          }
        </p>
      </div>
    );
  }

  if (!survey || !formUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h2 className="text-white text-lg font-semibold text-center">
          {survey.title}
        </h2>
      </div>

      {/* Форма Tally */}
      <div className="relative">
        <iframe
          src={formUrl}
          className="w-full min-h-[500px] border-0"
          title={survey.title}
          allow="camera; microphone; geolocation"
        />
        
        {/* Оверлей для обработки кликов вне формы */}
        <div className="absolute inset-0 pointer-events-none"></div>
      </div>

      {/* Кнопка закрытия */}
      {onClose && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {language === 'ru' ? 'Закрыть' : 'Yopish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TallySurvey;
