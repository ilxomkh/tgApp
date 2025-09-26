import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AccessDeniedMessage } from '../utils/deviceValidation';
import ProSVG from '../assets/Pro.svg';

const AccessDeniedScreen = () => {
  const { language } = useLanguage();
  const messages = AccessDeniedMessage();
  
  const t = language === 'uz' ? {
    title: messages.titleUz,
    message: messages.messageUz
  } : {
    title: messages.title,
    message: messages.message
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7C65FF] to-[#5538F9] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Логотип */}
        <div className="mb-8">
          <img
            src={ProSVG}
            alt="Pro Survey"
            className="w-32 h-32 mx-auto"
          />
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-white mb-4">
          {t.title}
        </h1>

        {/* Сообщение */}
        <p className="text-white/80 text-lg leading-relaxed mb-8">
          {t.message}
        </p>

        {/* Иконка устройства */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-white/60 text-sm">
          <p>
            {language === 'uz' 
              ? 'Ilova faqat mobil qurilmalarda ishlaydi'
              : 'Приложение работает только на мобильных устройствах'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedScreen;
