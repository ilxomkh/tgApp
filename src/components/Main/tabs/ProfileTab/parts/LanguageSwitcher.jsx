import React from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';

const LanguageSwitcher = ({ onClose }) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          {language === 'uz' ? 'O\'zingizga qulay bo\'lgan tilni tanlang:' : 'Выберите удобный для вас язык:'}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleLanguageChange('uz')}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
            language === 'uz'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇺🇿</span>
              <div className="text-left">
                <div className="font-semibold">O'zbek tili</div>
                <div className="text-sm opacity-75">Узбекский язык</div>
              </div>
            </div>
            {language === 'uz' && (
              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>

        <button
          onClick={() => handleLanguageChange('ru')}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
            language === 'ru'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇷🇺</span>
              <div className="text-left">
                <div className="font-semibold">Русский язык</div>
                <div className="text-sm opacity-75">Rus tili</div>
              </div>
            </div>
            {language === 'ru' && (
              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          {language === 'uz' 
            ? 'Til o\'zgarishi darhol amalga oshiriladi'
            : 'Изменение языка происходит мгновенно'
          }
        </p>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
