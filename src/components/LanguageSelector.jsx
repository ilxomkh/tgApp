import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    onClose();
    navigate('/onboarding');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-full bg-white rounded-t-3xl shadow-2xl p-6 pb-8 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Language selection prompt */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              O'zingizga qulay bo'lgan tilni tanlang: 🇺🇿
            </div>
            <div className="text-sm text-gray-600">
              Выберите удобный для вас язык: 🇷🇺
            </div>
          </div>

          {/* Language options */}
          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleLanguageSelect('uz')}
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
              onClick={() => handleLanguageSelect('ru')}
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

          {/* Continue button */}
          <button
            onClick={() => handleLanguageSelect(language)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200"
          >
            Davom etish - Продолжить
          </button>
        </div>
      </div>
    </>
  );
};

export default LanguageSelector;
