import React from 'react';

export const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-[#ECECFA] shadow-[0_8px_28px_rgba(40,40,80,0.08)] ${className}`}>
    {children}
  </div>
);

export const GradientCard = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-5 text-white bg-gradient-to-br from-[#6A4CFF] to-[#5B7CFF] shadow-[0_20px_44px_rgba(90,80,230,0.35)] ${className}`}>
    {children}
  </div>
);

export const CTAButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full h-12 rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition ${className}`}
  >
    {children}
  </button>
);

export const SoftButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium active:scale-[0.99] transition ${className}`}
  >
    {children}
  </button>
);

export const StatPill = ({ label, value, className = '' }) => (
  <div className={`bg-white rounded-xl border border-[#ECECFA] p-4 ${className}`}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

export const SuccessModal = ({ isOpen, onClose, surveyResult, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Фон с градиентом как в onboarding */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]" />
      
      {/* WaveOverlay для анимации */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] opacity-80" />
      </div>

      {/* Модальное окно */}
      <div className="relative z-10 mx-4 w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 scale-100">
          {/* Иконка успеха */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Заголовок */}
          <h2 className="text-2xl font-bold text-[#5E5AF6] mb-4">
            {t?.congratulations || "Поздравляем!"}
          </h2>

          {/* Сообщение */}
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {surveyResult?.message || "Опрос успешно завершен!"}
          </p>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6A4CFF] to-[#7A5CFF] text-white font-semibold shadow-lg active:scale-[0.99] transition-all duration-200 hover:shadow-xl"
          >
            {t?.close || "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  );
};
