import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();

  const handleStart = () => {
    navigate('/onboarding');
  };

  const handleLanguageSelect = () => {
    openLanguageModal();
  };

  const welcomeText = {
    uz: {
      title: 'Pro Survey',
      subtitle: 'Siz kerakli so\'rovnomalarda ishtirok etib pul topishingiz mumkin. "PROSURVEY" MChJ rasmiy Telegram boti.',
      buttonText: 'Botdan foydalanish uchun bosing',
      startButton: 'Старт',
      languageButton: 'Tilni o\'zgartirish'
    },
    ru: {
      title: 'Pro Survey',
      subtitle: 'Вы можете заработать деньги, участвуя в необходимых опросах. Официальный Telegram бот ООО "PROSURVEY".',
      buttonText: 'Чтобы использовать бота, нажмите сюда',
      startButton: 'Старт',
      languageButton: 'Изменить язык'
    }
  };

  const currentText = welcomeText[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-sm">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">{currentText.title}</h1>
          <p className="text-lg opacity-90 leading-relaxed mb-6">
            {currentText.subtitle}
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm opacity-90">
              {currentText.buttonText}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 active:scale-95 text-lg w-full max-w-xs"
          >
            {currentText.startButton}
          </button>
          
          <button
            onClick={handleLanguageSelect}
            className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 text-base w-full max-w-xs border border-white/30"
          >
            {currentText.languageButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
