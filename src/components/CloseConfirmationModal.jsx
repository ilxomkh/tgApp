import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
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
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {t.message}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              {t.cancel}
            </button>
            
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 active:scale-95 transition-all duration-200"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseConfirmationModal;
