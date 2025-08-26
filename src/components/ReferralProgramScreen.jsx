import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const ReferralProgramScreen = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // ---------- Переводы ----------
  const translations = {
    ru: {
      title: "Реферальная программа",
      back: "Назад",
      howMuchEarn: "Сколько я могу заработать от реферальной программы?",
      level1:
        "1-й уровень: 20% от комиссий, выплачиваемых вашими прямыми рефералами",
      level2:
        "2-й уровень: 2,5% от комиссий, выплачиваемых рефералами ваших рефералов",
      twoLevelProgram:
        "Реферальная программа имеет два уровня: заработок от прямых рефералов (Уровень 1) и рефералов ваших рефералов (Уровень 2).",
      whatActivities:
        "Какие действия учитываются для реферальных вознаграждений?",
      onlySell:
        'Только операции "Продажа" с токенами, которые котируются на DEX и проводятся через Blum Memepad',
      tradingCriteria:
        "Ваши рефералы торговали 27 декабря 2024 года или позже, что является датой начала Blum Trading Referral Program. Торговля осуществляется вашими прямыми рефералами и рефералами ваших рефералов.",
      additionalInfo: "Дополнительная информация",
      additionalInfoText:
        "Здесь может быть дополнительная информация о реферальной программе, которая поможет пользователям лучше понять, как работает система.",
      importantDetails: "Важные детали",
      importantDetailsText:
        "Обратите внимание на все условия и требования для участия в реферальной программе. Убедитесь, что вы понимаете все аспекты программы.",
    },
    uz: {
      title: "Referral dasturi",
      back: "Orqaga",
      howMuchEarn: "Referral dasturidan qancha daromad qilishim mumkin?",
      level1:
        "1-daraja: to'g'ridan-to'g'ri referral'lar tomonidan to'lanadigan komissiyalarning 20%",
      level2:
        "2-daraja: sizning referral'lar referral'lar tomonidan to'lanadigan komissiyalarning 2,5%",
      twoLevelProgram:
        "Referral dasturida ikkita daraja bor: to'g'ridan-to'g'ri referral'lardan daromad (1-daraja) va sizning referral'lar referral'laridan daromad (2-daraja).",
      whatActivities:
        "Referral mukofotlari uchun qanday faoliyatlar hisobga olinadi?",
      onlySell:
        "Faqat DEX-da ro'yxatdan o'tgan va Blum Memepad orqali amalga oshiriladigan tokenlar bilan \"Sotish\" operatsiyalari",
      tradingCriteria:
        "Sizning referral'lar 2024-yil 27-dekabrdan boshlab yoki undan keyin savdo qilgan, bu Blum Trading Referral Program boshlanish sanasi. Savdo sizning to'g'ridan-to'g'ri referral'lar va sizning referral'lar referral'lar tomonidan amalga oshiriladi.",
      additionalInfo: "Qo'shimcha ma'lumot",
      additionalInfoText:
        "Bu yerda referral dasturi haqida qo'shimcha ma'lumot bo'lishi mumkin, bu foydalanuvchilarga tizim qanday ishlashini yaxshiroq tushunishga yordam beradi.",
      importantDetails: "Muhim tafsilotlar",
      importantDetailsText:
        "Referral dasturida ishtirok etish uchun barcha shartlar va talablarni e'tibor bering. Dasturning barcha jihatlarini tushunganingizga ishonch hosil qiling.",
    },
  };
  const t = translations[language || "ru"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
          {t.title}
        </h2>

        {/* Контент */}
        <div className="space-y-6 text-gray-800">
          {/* Первый раздел */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.howMuchEarn}
            </h3>
            <p className="text-base leading-relaxed mb-3">
              {t.twoLevelProgram}
            </p>
            <p className="text-base leading-relaxed mb-2">{t.level1}</p>
            <p className="text-base leading-relaxed">{t.level2}</p>
          </div>

          {/* Второй раздел */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.whatActivities}
            </h3>
            <p className="text-base leading-relaxed mb-3">{t.onlySell}</p>
            <p className="text-base leading-relaxed">{t.tradingCriteria}</p>
          </div>

          {/* Повторение первого раздела */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.howMuchEarn}
            </h3>
            <p className="text-base leading-relaxed mb-3">
              {t.twoLevelProgram}
            </p>
            <p className="text-base leading-relaxed mb-2">{t.level1}</p>
            <p className="text-base leading-relaxed">{t.level2}</p>
          </div>

          {/* Повторение второго раздела */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.whatActivities}
            </h3>
            <p className="text-base leading-relaxed mb-3">{t.onlySell}</p>
            <p className="text-base leading-relaxed">{t.tradingCriteria}</p>
          </div>

          {/* Дополнительный контент для демонстрации скролла */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.additionalInfo}
            </h3>
            <p className="text-base leading-relaxed">{t.additionalInfoText}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.importantDetails}
            </h3>
            <p className="text-base leading-relaxed">
              {t.importantDetailsText}
            </p>
          </div>
        </div>

        {/* Кнопка "Назад" */}
        <div className="rounded-2xl bg-[#EDEAFF] p-2 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full h-[48px] rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgramScreen;
