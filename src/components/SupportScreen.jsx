import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "./header";

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

  const openTelegram = () => {
    window.open('https://t.me/prosurvey_support', '_blank');
  };

  return (
    <div className="">
      <Header />
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-6 py-2 overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
          {t.title}
        </h2>

        {/* Контент */}
        <div className="space-y-6 text-gray-800">
          {/* Заголовок */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.supportTitle}
            </h3>
          </div>

          {/* Telegram */}
          <div>
            <h4 className="text-base font-semibold text-[#5E5AF6] mb-2">
              {t.telegram}
            </h4>
            <p className="text-base leading-relaxed mb-3">
              {t.telegramText}
            </p>
            <button
              onClick={openTelegram}
              className="bg-[#5E5AF6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#4A46E8] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.04 15.51l-.38 5.34c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.93-.9l3.49-16.37h.01c.31-1.45-.52-2.02-1.46-1.67L1.24 10.1c-1.41.55-1.39 1.35-.24 1.7l5.32 1.66L19.6 6.88c.73-.48 1.4-.22.85.26" />
              </svg>
              Telegram
            </button>
          </div>

          {/* Email */}
          <div>
            <h4 className="text-base font-semibold text-[#5E5AF6] mb-2">
              {t.email}
            </h4>
            <p className="text-base leading-relaxed">
              {t.emailText}
            </p>
          </div>

          {/* Время работы */}
          <div>
            <h4 className="text-base font-semibold text-[#5E5AF6] mb-2">
              {t.workingHours}
            </h4>
            <p className="text-base leading-relaxed mb-1">
              {t.hours}
            </p>
            <p className="text-base leading-relaxed">
              {t.weekend}
            </p>
          </div>

          {/* Время ответа */}
          <div>
            <h4 className="text-base font-semibold text-[#5E5AF6] mb-2">
              {t.responseTime}
            </h4>
            <p className="text-base leading-relaxed mb-1">
              {t.responseText}
            </p>
            <p className="text-base leading-relaxed">
              {t.responseText2}
            </p>
          </div>

          {/* Примечание */}
          <div className="text-center">
            <p className="text-[10px] font-extralight text-gray-600 leading-relaxed">
              {t.note}
            </p>
          </div>
        </div>

        {/* Кнопка "Назад" */}
        <div className="rounded-2xl bg-[#EDEAFF] p-2 mt-6">
          <button
            onClick={() => navigate('/main?tab=profile')}
            className="w-full h-[48px] rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportScreen;
