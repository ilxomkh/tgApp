import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import HomeTab from './tabs/HomeTab';
import InviteTab from './tabs/InviteTab';
import LotteryTab from './tabs/LotteryTab';
import ProfileTab from './tabs/ProfileTab/ProfileTab';
import Header from '../header';
import { useKeyboard } from '../../hooks/useKeyboard';

const MainScreen = () => {
  const { language } = useLanguage();
  const { user, refreshUserProfile, resetToOnboarding } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const { isKeyboardOpen } = useKeyboard();

  // Проверяем URL параметры для показа профиля
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
      if (tabParam === 'profile') {
        setShowProfile(true);
      } else {
        setShowProfile(false);
      }
    }
  }, [location.search]);

  // Загружаем актуальные данные пользователя при монтировании
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        await refreshUserProfile();
      }
    };

    loadUserProfile();
  }, []); // Убираем зависимости, чтобы избежать бесконечного цикла

  const t = useMemo(() => ({
    ru: {
      balance: "Мой баланс:",
      withdraw: "Вывести",
      survey: "Пройти опрос",
      themeIntro: "Тема: Знакомство",
      themeShop: "Тема: Интернет магазины",
      themeBank: "Тема: Банки",
      g12k: "Сумма приза: 12 000 сум",
      g10k_l1m: "Гарантированный 10 000 сум и розыгрыш 1 000 000 сум",
      l3m: "Участие в розыгрыше на 3 000 000 сум",
      congratulations: "Поздравляем!",
      close: "Закрыть",
      inviteTitle: "Получите 10 000 сум за каждого приглашённого",
      home: "Главная",
      invite: "Пригласить",
      lottery: "Итоги",
      profile: "Профиль",
      sum: "сум",
      noSurveys: "Нет доступных опросов",
      // Новые переводы для LotteryTab
      lotThemeIntro: "Тема: Знакомство",
      lotThemeShop: "Тема: Интернет магазины",
      lotDate: "Дата проведения",
      lotSum: "Сумма розыгрыша",
      videoPlaceholder: "Здесь будет видео",
      loadingLottery: "Загрузка лотерей...",
      errorLoadingLottery: "Ошибка загрузки лотерей",
      noLotteriesFound: "Лотереи не найдены",
      completed: "Завершена",
      browserNotSupportVideo: "Ваш браузер не поддерживает видео",
      resetToOnboarding: "Выйти",
    },
    uz: {
      balance: "Mening balansim:",
      withdraw: "Chiqarish",
      survey: "So'rovdan o'tish",
      themeIntro: "Mavzu: Tanishuv",
      themeShop: "Mavzu: Internet do'konlar",
      themeBank: "Mavzu: Banklar",
      g12k: "Yutuq summasi: 12 000 so'm",
      g10k_l1m: "Kafolatlangan 10 000 so'm va 1 000 000 so'm lotereya",
      l3m: "3 000 000 so'm lotereyaga qo'shilish",
      congratulations: "Tabriklaymiz!",
      close: "Yopish",
      inviteTitle: "Har bir do'st uchun 10 000 so'm",
      home: "Asosiy",
      invite: "Taklif qilish",
      lottery: "Natijalar",
      profile: "Profil",
      sum: "so'm",
      noSurveys: "Mavjud so'rovlar yo'q",
      // Новые переводы для LotteryTab
      lotThemeIntro: "Mavzu: Tanishuv",
      lotThemeShop: "Mavzu: Internet do'konlar",
      lotDate: "O'tkazilgan sana",
      lotSum: "Lotereya summası",
      videoPlaceholder: "Bu yerda video bo'ladi",
      loadingLottery: "Lotereyalar yuklanmoqda...",
      errorLoadingLottery: "Lotereyalarni yuklashda xatolik",
      noLotteriesFound: "Lotereyalar topilmadi",
      completed: "Tugallangan",
      browserNotSupportVideo: "Sizning brauzeringiz videoni qo'llab-quvvatlamaydi",
      resetToOnboarding: "Chiqish",
    }
  }[language]), [language]);

  const tabs = [
    { id: 'home', label: t.home },
    { id: 'invite', label: t.invite },
    { id: 'lottery', label: t.lottery },
    { id: 'profile', label: t.profile }
  ];

  const openProfile = () => {
    setShowProfile(true);
    setActiveTab('profile');
  };

  const closeProfile = () => {
    setShowProfile(false);
    setActiveTab('home');
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'profile') {
      setShowProfile(true);
      setActiveTab('profile');
    } else {
      setShowProfile(false);
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      <Header />
      {/* Отступ под нижнюю навигацию - адаптируется к клавиатуре */}
      <div className={`p-4 ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        {showProfile ? (
          <ProfileTab t={t} onClose={closeProfile} onResetToOnboarding={resetToOnboarding} />
        ) : (
          <>
            {activeTab === 'home' && <HomeTab t={t} onOpenProfile={openProfile} user={user} />}
            {activeTab === 'invite' && <InviteTab locale={language} user={user} />}
            {activeTab === 'lottery' && <LotteryTab t={t} />}
          </>
        )}
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
};

export default MainScreen;
