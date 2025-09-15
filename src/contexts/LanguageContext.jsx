import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  uz: {
    welcome: 'Xush kelibsiz!',
    start: 'Boshlash',
    selectLanguage: 'Tilni tanlang',
    onboarding: 'Xizmat haqida ma\'lumot',
    auth: 'Avtorizatsiya',
    phoneNumber: 'Telefon raqami',
    otp: 'SMS kod',
    privacy: 'Maxfiylik siyosati',
    accept: 'Qabul qilish',
    main: 'Asosiy',
    survey: 'So\'rovnoma',
    bonus: 'Bonus',
    lottery: 'Lotereya',
    referral: 'Referral dastur',
    profile: 'Profil',
    settings: 'Sozlamalar',
    changeLanguage: 'Tilni o\'zgartirish',
    about: 'Loyiha haqida',
    support: 'Qo\'llab-quvvatlash',
    logout: 'Chiqish',
  },
  ru: {
    welcome: 'Добро пожаловать!',
    start: 'Начать',
    selectLanguage: 'Выберите язык',
    onboarding: 'Информация о сервисе',
    auth: 'Авторизация',
    phoneNumber: 'Номер телефона',
    otp: 'SMS код',
    privacy: 'Политика конфиденциальности',
    accept: 'Принять',
    main: 'Главная',
    survey: 'Опросник',
    bonus: 'Бонус',
    lottery: 'Лотерея',
    referral: 'Реферальная программа',
    profile: 'Профиль',
    settings: 'Настройки',
    changeLanguage: 'Изменить язык',
    about: 'О проекте',
    support: 'Поддержка',
    logout: 'Выйти',
  },
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uz';
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    isLanguageModalOpen,
    openLanguageModal,
    closeLanguageModal
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
