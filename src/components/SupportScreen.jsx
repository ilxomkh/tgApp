import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import BottomNav from "./Main/BottomNav";
import { useTelegramBackButton } from "../hooks/useTelegramBackButton";

const SupportScreen = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // ---------- Переводы ----------
  const translations = {
    ru: {
      title: "Служба поддержки",
      back: "Назад",
      supportTitle: "Как получить поддержку?",
      telegram: "Telegram канал поддержки",
      telegramText: "Самый быстрый способ получить помощь - написать в наш Telegram канал. Наши специалисты ответят в течение 24 часов.",
      email: "Электронная почта",
      emailText: "Для официальных запросов и жалоб используйте email: support@prosurvey.uz",
      workingHours: "Время работы:",
      hours: "Понедельник - Пятница: 9:00 - 18:00",
      weekend: "Суббота - Воскресенье: 10:00 - 16:00",
      responseTime: "Время ответа:",
      responseText: "• Telegram: до 2 часов",
      responseText2: "• Email: до 24 часов",
      note: "Примечание: В выходные и праздничные дни время ответа может быть увеличено.",
    },
    uz: {
      title: "Qo'llab-quvvatlash xizmati",
      back: "Orqaga",
      supportTitle: "Qo'llab-quvvatlashni qanday olish mumkin?",
      telegram: "Qo'llab-quvvatlash Telegram kanali",
      telegramText: "Yordam olishning eng tezkor usuli - bizning Telegram kanalimizga yozish. Bizning mutaxassislar 24 soat ichida javob beradi.",
      email: "Elektron pochta",
      emailText: "Rasmiy so'rovlar va shikoyatlar uchun email ishlatish: support@prosurvey.uz",
      workingHours: "Ish vaqti:",
      hours: "Dushanba - Juma: 9:00 - 18:00",
      weekend: "Shanba - Yakshanba: 10:00 - 16:00",
      responseTime: "Javob berish vaqti:",
      responseText: "• Telegram: 2 soatgacha",
      responseText2: "• Email: 24 soatgacha",
      note: "Eslatma: Dam olish kunlari va bayramlarda javob berish vaqti ko'payishi mumkin.",
    },
  };
  const t = translations[language || "ru"];

  // BottomNav props
  const tabs = [
    { id: "home", label: language === "uz" ? "Asosiy" : "Главная" },
    { id: "invite", label: language === "uz" ? "Taklif qilish" : "Пригласить" },
    { id: "lottery", label: language === "uz" ? "Natijalar" : "Итоги" },
    { id: "profile", label: language === "uz" ? "Profil" : "Профиль" },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === "home") {
      navigate("/main");
    } else if (tabId === "invite") {
      navigate("/main?tab=invite");
    } else if (tabId === "lottery") {
      navigate("/main?tab=lottery");
    } else if (tabId === "profile") {
      navigate("/main?tab=profile");
    }
  };

  const openTelegram = () => {
    window.open('https://t.me/prosurvey_support', '_blank');
  };

  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Настраиваем кнопку "Назад" в Telegram Mini App
  useTelegramBackButton(handleBack, true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex flex-col">
      <Header />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 custom-scrollbar">
        {/* Заголовок страницы */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#5E5AF6] to-[#8888FC] flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#5E5AF6] mb-2">
            {t.title}
          </h2>
          <p className="text-gray-600">
            {t.supportTitle}
          </p>
        </div>

        {/* Карточки поддержки */}
        <div className="space-y-3">
          {/* Telegram карточка */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M9.04 15.51l-.38 5.34c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.93-.9l3.49-16.37h.01c.31-1.45-.52-2.02-1.46-1.67L1.24 10.1c-1.41.55-1.39 1.35-.24 1.7l5.32 1.66L19.6 6.88c.73-.48 1.4-.22.85.26" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.telegram}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {t.telegramText}
                </p>
                <button
                  onClick={openTelegram}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.04 15.51l-.38 5.34c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.93-.9l3.49-16.37h.01c.31-1.45-.52-2.02-1.46-1.67L1.24 10.1c-1.41.55-1.39 1.35-.24 1.7l5.32 1.66L19.6 6.88c.73-.48 1.4-.22.85.26" />
                  </svg>
                  Telegram
                </button>
              </div>
            </div>
          </div>

          {/* Email карточка */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.email}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {t.emailText}
                </p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <code className="text-[#5E5AF6] font-mono text-sm">support@prosurvey.uz</code>
                </div>
              </div>
            </div>
          </div>

          {/* Время работы карточка */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t.workingHours}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">{t.hours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700">{t.weekend}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Время ответа карточка */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t.responseTime}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">{t.responseText}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-700">{t.responseText2}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Примечание */}
        <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600 flex-shrink-0 mt-0.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
            <p className="text-sm text-blue-800 leading-relaxed">
              {t.note}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav tabs={tabs} activeTab="profile" onChange={handleTabChange} />
    </div>
  );
};

export default SupportScreen;
