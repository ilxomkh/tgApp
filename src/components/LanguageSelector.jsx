import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(language || 'uz');

  // Тексты на двух языках
  const texts = {
    uz: {
      title: "O'zingizga qulay bo'lgan tilni tanlang",
      subtitle: "Выберите удобный для вас язык",
      uzbek: "O'zbek tili",
      russian: "Русский язык",
      continue: "Davom etish"
    },
    ru: {
      title: "Выберите удобный для вас язык",
      subtitle: "O'zingizga qulay bo'lgan tilni tanlang",
      uzbek: "O'zbek tili",
      russian: "Русский язык",
      continue: "Продолжить"
    }
  };

  const currentTexts = texts[selected];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSelected(language || 'uz');
    } else {
      setIsVisible(false);
    }
  }, [isOpen, language]);

  const confirm = () => {
    setLanguage(selected);
    onClose();
    navigate('/onboarding');
  };

  const closeSoft = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 250);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-200 z-40 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeSoft}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-full max-w-[440px]">
          <div className="relative rounded-t-[28px] overflow-hidden shadow-2xl">
            {/* Верхний градиентный кап – как на макете */}
            {/* Тело модалки */}
            <div className="bg-[#F4F1FF] p-5 sm:p-6">
              {/* Заголовок: две строки */}
              <div className="text-center mb-4">
                <p className="text-[15px] leading-5 text-[#111827] font-medium">
                  {currentTexts.title}
                </p>
                <p className="text-[14px] leading-5 text-[#6B7280]">
                  {currentTexts.subtitle}
                </p>
              </div>

              {/* Языковые карточки */}
              <div className="space-y-3 mb-5">
                {/* Uzbek */}
                <button
                  type="button"
                  onClick={() => setSelected('uz')}
                  className={[
                    'w-full text-left',
                    'bg-white rounded-2xl',
                    'border',
                    selected === 'uz' ? 'border-[#7C5CFF]' : 'border-white',
                    'shadow-[0_2px_8px_rgba(16,24,40,0.06)]',
                    'px-4 py-4',
                    'transition-all'
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-6 text-[#111827]">
                      {currentTexts.uzbek}
                    </span>
                    <span className="text-[18px]" aria-hidden>🇺🇿</span>
                  </div>
                </button>

                {/* Russian */}
                <button
                  type="button"
                  onClick={() => setSelected('ru')}
                  className={[
                    'w-full text-left',
                    'bg-white rounded-2xl',
                    'border',
                    selected === 'ru' ? 'border-[#7C5CFF]' : 'border-white',
                    'shadow-[0_2px_8px_rgba(16,24,40,0.06)]',
                    'px-4 py-4',
                    'transition-all'
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-6 text-[#111827]">
                      {currentTexts.russian}
                    </span>
                    <span className="text-[18px]" aria-hidden>🇷🇺</span>
                  </div>
                </button>
              </div>

              {/* Кнопка "Продолжить" как на скрине */}
              <button
                type="button"
                onClick={confirm}
                className="w-full h-12 rounded-xl text-white text-[16px] font-medium
                           bg-gradient-to-r from-[#7C5CFF] via-[#7A5AF8] to-[#6D28D9]
                           shadow-[0_6px_18px_rgba(124,92,255,0.35)]
                           active:scale-[0.99] transition"
              >
                {currentTexts.continue}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageSelector;
