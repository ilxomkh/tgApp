// tg-app/src/components/Main/index.jsx
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';        // NEW
import { HomeIcon, UsersIcon, TicketIcon, UserIcon } from './icons';
import BottomNav from './BottomNav';
import HomeTab from './tabs/HomeTab';
import InviteTab from './tabs/InviteTab';
import LotteryTab from './tabs/LotteryTab';
import ProfileTab from './tabs/ProfileTab/ProfileTab';

const MainScreen = () => {
  const { language } = useLanguage();
  const { user } = useAuth();                                 // NEW
  const [activeTab, setActiveTab] = useState('home');

  const t = useMemo(() => ({
    uz: {
      // --- уже было ---
      balance: "Sizning balansingiz",
      withdraw: "Kartaga chiqarish",
      survey: "So'rovnomani o'tish",
      themeIntro: "Mavzu: Tanishtiruv",
      themeShop: "Mavzu: Internet do'konlar",
      themeBank: "Mavzu: Banklar",
      g12k: "Kafolatli 12 000 so'm",
      g10k_l1m: "Kafolatli 10 000 so'm va lotereya 1 000 000 so'm",
      l3m: "Lotereya 3 000 000 so'm",
      inviteTitle: "Har bir taklif qilingan do'st uchun 10 000 so'm oling",
      whatToDo: "Nima qilish kerak?",
      inv1: "Do'stingizni referal havola orqali taklif qiling.",
      inv2: "Taklif qilingan kishi kamida 3 ta so'rovnomadan o'tib “Faol” bo'lsin.",
      inv3: "Olingan pullarni kartaga chiqaring.",
      more: "Batafsil ma'lumot",
      stats: "Statistika:",
      invited: "Taklif qilinganlar soni",
      activeInv: "Faol taklif qilinganlar soni",
      waitSum: "Kutilayotgan summa",
      earned: "Olingan pul",
      inviteFriend: "Do'stni taklif qilish",
      lotThemeShop: "So'rovnoma mavzusi: Internet do'kon",
      lotThemeBank: "So'rovnoma mavzusi: Banklar",
      lotDate: "So'rovnoma sanasi",
      lotSum: "Lotereya summasi",
      yt: "YouTube'dan video",
      nameNA: "Ism kiritilmagan",
      notSet: "Kiritilmagan",
      profile: "Profil",
      personal: "Shaxsiy ma'lumotlar",
      bonusBalance: "Bonus balans",
      refCode: "Referral kodi",
      changeLang: "Tilni o'zgartirish",
      home: "Asosiy",
      invite: "Do'stni taklif qilish",
      lottery: "Lotereya natijalari",
      tabProfile: "Profil",
      sum: "so'm",

      // --- NEW для Invite/Profile ---
      // InviteTab / тосты / копирование
      copyLink: "Havolani nusxalash",
      copied: "Havola nusxalandi",
      copyFail: "Nusxalab bo‘lmadi",
      sharedOk: "Yuborildi",
      shareText: "Qatnashing va birga daromad qilaylik!",
      close: "Yopish",

      // ProfileTab – тексты и формы
      user: "Foydalanuvchi",
      phoneNA: "Telefon raqami ko‘rsatilmagan",
      personalData: "Shaxsiy ma'lumotlar",
      projectInfo: "Loyiha haqida",
      publicOffer: "Ochiq oferta",
      support: "Qo‘llab-quvvatlash",
      orderSurvey: "So‘rovnoma buyurtma qilish",
      save: "Saqlash",
      saved: "Saqlandi",
      fillRequired: "Majburiy maydonlarni to‘ldiring",
      requestSent: "So‘rov yuborildi",
      choose: "Tanlash",
      name: "Ism",
      enterName: "Ismingizni kiriting",
      phone: "Telefon raqam",
      birthdate: "Tug‘ilgan sana",
      email: "Email",
      fullname: "F.I.O",
      orgName: "Tashkilot nomi",
      orgPosition: "Lavozim",
      supportHint: "Savollar bo‘lsa — Telegram’ga yozing.",
      openTelegram: "Telegram’ni ochish",
      projectInfoLong:
        "Loyiha ishtirokchilari uchun qisqacha yo‘riqnoma, maqsadlar va datalar siyosati.",
      publicOfferLong:
        "Xizmatdan foydalanish shartlari, foydalanuvchi huquq va majburiyatlari, ma'lumotlarni qayta ishlash tartibi.",
      supportTelegramUrl: "https://t.me/",
      changeLangNote: "Tilni o'zgartirish uchun ilovani qayta ishga tushiring",
      sendRequest: "So'rov yuborish"
    },
    ru: {
      // --- уже было ---
      balance: "Ваш баланс",
      withdraw: "Вывод на карту",
      survey: "Пройти опрос",
      themeIntro: "Тема: Знакомство",
      themeShop: "Тема: Интернет магазины",
      themeBank: "Тема: Банки",
      g12k: "Гарантированный 12 000 сум",
      g10k_l1m: "Гарантированный 10 000 сум и розыгрыш 1 000 000 сум",
      l3m: "Розыгрыш 3 000 000 сум",
      inviteTitle: "Получите 10 000 сум за каждого приглашённого",
      whatToDo: "Что надо сделать?",
      inv1: "Пригласите друга по реферальной ссылке.",
      inv2: "Приглашённый должен пройти минимум 3 опроса и стать «Актив».",
      inv3: "Выведите заработанные деньги на карту.",
      more: "Узнать подробнее",
      stats: "Статистика:",
      invited: "Кол-во приглашённых",
      activeInv: "Кол-во Актив приглашённых",
      waitSum: "Сумма в ожидании",
      earned: "Заработано",
      inviteFriend: "Пригласить друга",
      lotThemeShop: "Тема опроса: Интернет магазин",
      lotThemeBank: "Тема опроса: Банки",
      lotDate: "Дата опроса",
      lotSum: "Сумма розыгрыша",
      yt: "Видео с YouTube",
      nameNA: "Имя не указано",
      notSet: "Не указано",
      profile: "Профиль",
      personal: "Личные данные",
      bonusBalance: "Бонусный баланс",
      refCode: "Реферальный код",
      changeLang: "Изменить язык",
      home: "Главная",
      invite: "Пригласить друга",
      lottery: "Итоги розыгрыша",
      tabProfile: "Профиль",
      sum: "сум",

      // --- NEW для Invite/Profile ---
      copyLink: "Скопировать ссылку",
      copied: "Ссылка скопирована",
      copyFail: "Не удалось скопировать",
      sharedOk: "Отправлено",
      shareText: "Присоединяйся и зарабатывай вместе со мной!",
      close: "Закрыть",

      user: "Пользователь",
      phoneNA: "Номер не указан",
      personalData: "Личные данные",
      projectInfo: "Информация о проекте",
      publicOffer: "Публичная оферта",
      support: "Служба поддержки",
      orderSurvey: "Заказать опрос",
      save: "Сохранить",
      saved: "Сохранено",
      fillRequired: "Заполните обязательные поля",
      requestSent: "Заявка отправлена",
      choose: "Выбрать",
      name: "Имя",
      enterName: "Укажите имя",
      phone: "Номер телефона",
      birthdate: "Дата рождения",
      email: "Email",
      fullname: "ФИО",
      orgName: "Название организации",
      orgPosition: "Должность",
      supportHint: "Если возникли вопросы — напишите нам в Telegram.",
      openTelegram: "Открыть Telegram",
      projectInfoLong:
        "Подробное описание проекта, цели, условия участия и политика обработки данных.",
      publicOfferLong:
        "Текст публичной оферты: условия сервиса, права и обязанности, обработка персональных данных.",
      supportTelegramUrl: "https://t.me/",
      changeLangNote: "Перезапустите приложение для изменения языка",
      sendRequest: "Отправить заявку"
    }
  }[language]), [language]);

  const tabs = [
    { id: 'home', label: t.home, icon: HomeIcon },
    { id: 'invite', label: t.invite, icon: UsersIcon },
    { id: 'lottery', label: t.lottery, icon: TicketIcon },
    { id: 'profile', label: t.tabProfile, icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* делаем адаптивный отступ под BottomNav */}
      <div className="p-6 pb-[calc(88px+env(safe-area-inset-bottom))]">
        {activeTab === 'home' && <HomeTab t={t} />}
        {/* Если ваш InviteTab использует ВНУТРЕННИЕ переводы по locale: */}
        <>{activeTab === 'invite' && <InviteTab locale={language} refCode={user?.referralCode} />}</>
        {/* Если InviteTab всё ещё ожидает t — верните: <InviteTab t={t} /> */}

        {activeTab === 'lottery' && <LotteryTab t={t} />}
        <>{activeTab === 'profile' && <ProfileTab t={t} />}</>
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default MainScreen;
