import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ProSVG from '../assets/Pro.svg';
import WaveOverlay from './WaveOverlay';

const CloseConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText, cancelText }) => {
  const { language } = useLanguage();
  
  const defaultTexts = {
    ru: {
      title: "Закрыть приложение?",
      message: "Вы действительно хотите закрыть приложение?",
      confirm: "Да, закрыть",
      cancel: "Отмена"
    },
    uz: {
      title: "Ilovani yopish?",
      message: "Haqiqatan ham ilovani yopmoqchimisiz?",
      confirm: "Ha, yopish",
      cancel: "Bekor qilish"
    }
  };

  const t = {
    title: title || defaultTexts[language]?.title || defaultTexts.ru.title,
    message: message || defaultTexts[language]?.message || defaultTexts.ru.message,
    confirm: confirmText || defaultTexts[language]?.confirm || defaultTexts.ru.confirm,
    cancel: cancelText || defaultTexts[language]?.cancel || defaultTexts.ru.cancel
  };

  if (!isOpen) return null;

  return (
    <>
      <img src={ProSVG} className='absolute w-[250px] top-1/4 right-1/2 left-1/2 -translate-x-1/2 z-999'/>
      <div className="fixed inset-0 z-50 flex items-end justify-end">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]" />
        <WaveOverlay />
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] opacity-0" />
        <div className="relative z-10 w-full">
          <div className="bg-white rounded-t-3xl p-10 text-center shadow-2xl transform transition-all duration-500 scale-100 flex flex-col justify-center" style={{ height: '45vh' }}>
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="text-red-600"
              >
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-[#5E5AF6] mb-6">
              {t.title}
            </h2>
            
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {t.message}
            </p>
            
            <div className="flex w-full gap-4 mb-6">
              <button
                onClick={onCancel}
                className="flex-1 w-full h-12 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-[0.99] transition-all duration-200 text-base"
              >
                {t.cancel}
              </button>
              
              <button
                onClick={onConfirm}
                className="flex-1 w-full h-12 px-6 rounded-xl bg-red-500 text-white shadow-lg active:scale-[0.99] transition-all duration-200 hover:shadow-xl text-base"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CloseConfirmationModal;
