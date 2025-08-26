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

const MainScreen = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);

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
      // Новые переводы для LotteryTab
      lotThemeIntro: "Тема: Знакомство",
      lotThemeShop: "Тема: Интернет магазины",
      lotDate: "Дата проведения",
      lotSum: "Сумма розыгрыша",
      videoPlaceholder: "Здесь будет видео",
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
      // Новые переводы для LotteryTab
      lotThemeIntro: "Mavzu: Tanishuv",
      lotThemeShop: "Mavzu: Internet do'konlar",
      lotDate: "O'tkazilgan sana",
      lotSum: "Lotereya summası",
      videoPlaceholder: "Bu yerda video bo'ladi",
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
      {/* Отступ под нижнюю навигацию */}
      <div className="p-4 pb-[calc(90px+env(safe-area-inset-bottom))]">
        {showProfile ? (
          <ProfileTab t={t} onClose={closeProfile} />
        ) : (
          <>
            {activeTab === 'home' && <HomeTab t={t} onOpenProfile={openProfile} />}
            {activeTab === 'invite' && <InviteTab locale={language} refCode={user?.referralCode} />}
            {activeTab === 'lottery' && <LotteryTab t={t} />}
          </>
        )}
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
};

export default MainScreen;
