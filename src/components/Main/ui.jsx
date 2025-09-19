import React from 'react';
import ProSVG from '../../assets/Pro.svg';
import WaveOverlay from '../WaveOverlay';
import { useHapticClick } from '../../utils/hapticFeedback';
import { getMessage } from '../../constants/messages';

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

export const CTAButton = ({ children, onClick, className = '' }) => {
  const hapticOnClick = useHapticClick(onClick, 'medium');
  
  return (
    <button
      onClick={hapticOnClick}
      className={`w-full h-12 rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition ${className}`}
    >
      {children}
    </button>
  );
};

export const SoftButton = ({ children, onClick, className = '' }) => {
  const hapticOnClick = useHapticClick(onClick, 'light');
  
  return (
    <button
      onClick={hapticOnClick}
      className={`px-4 py-2 rounded-lg font-medium active:scale-[0.99] transition ${className}`}
    >
      {children}
    </button>
  );
};

export const StatPill = ({ label, value, className = '' }) => (
  <div className={`bg-white rounded-xl border border-[#ECECFA] p-4 ${className}`}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

export const SuccessModal = ({ isOpen, onClose, surveyResult, t, language = 'ru' }) => {
  if (!isOpen) return null;

  return (
    <>
    <img src={ProSVG} className='absolute w-[250px] top-1/4 right-1/2 left-1/2 -translate-x-1/2 z-999'/>
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]" />
      <WaveOverlay />
      <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] opacity-0" />
      <div className="relative z-10 w-full">
        <div className="bg-white rounded-t-3xl p-4 text-center shadow-2xl transform transition-all duration-500 scale-100 flex flex-col justify-center" style={{ height: '45vh' }}>
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#5E5AF6] mb-6">
            {t?.congratulations || "Поздравляем!"}
          </h2>

          <p className="text-gray-500 text-lg leading-relaxed">
            {surveyResult?.message || "Опрос успешно завершен!"}
          </p>

          <div className="mb-6">
            <p className="text-gray-500 text-lg text-center">
              {getMessage('PRIZE_MESSAGE', language)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 mt-10 rounded-xl bg-gradient-to-r from-[#6A4CFF] to-[#7A5CFF] text-white font-semibold shadow-lg active:scale-[0.99] transition-all duration-200 hover:shadow-xl"
          >
            {t?.close || "Закрыть"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
