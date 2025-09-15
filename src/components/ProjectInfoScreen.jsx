import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const ProjectInfoScreen = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // ---------- Переводы ----------
  const translations = {
    ru: {
      title: "Информация о проекте",
      back: "Назад",
      aboutProject: "О проекте Pro Survey",
      description:
        "Pro Survey - это инновационная платформа для проведения опросов и исследований, которая позволяет пользователям зарабатывать деньги, участвуя в различных опросах и приглашая друзей.",
      features: "Основные возможности:",
      feature1: "• Участие в опросах за вознаграждение",
      feature2: "• Реферальная программа с двухуровневой системой",
      feature3: "• Лотереи с крупными призами",
      feature4: "• Мгновенные выплаты на карту",
      feature5: "• Поддержка узбекского и русского языков",
      mission: "Наша миссия:",
      missionText:
        "Сделать участие в опросах доступным, выгодным и интересным для всех пользователей, создавая взаимовыгодные отношения между исследователями и респондентами.",
    },
    uz: {
      title: "Loyiha haqida ma'lumot",
      back: "Orqaga",
      aboutProject: "Pro Survey loyihasi haqida",
      description:
        "Pro Survey - bu foydalanuvchilarga turli so'rovlarda qatnashish va do'stlarini taklif qilish orqali pul topish imkonini beruvchi so'rovlarda va tadqiqotlar o'tkazish uchun innovatsion platforma.",
      features: "Asosiy imkoniyatlar:",
      feature1: "• Mukofot evaziga so'rovlarda qatnashish",
      feature2: "• Ikki darajali tizimli referral dasturi",
      feature3: "• Katta yutuqlar bilan lotereyalar",
      feature4: "• Kartaga darhol to'lovlar",
      feature5: "• O'zbek va rus tillarini qo'llab-quvvatlash",
      mission: "Bizning vazifamiz:",
      missionText:
        "So'rovlarda qatnashishni barcha foydalanuvchilar uchun qulay, foydali va qiziqarli qilish, tadqiqotchilar va respondentlar o'rtasida o'zaro foydali munosabatlarni yaratish.",
    },
  };
  const t = translations[language || "ru"];

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      {/* Фиксированный хедер */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header />
      </div>

      {/* Контейнер контента между хедером и кнопкой */}
      <div className="fixed top-40 bottom-32 left-0 right-0 z-10">
        <div className="h-full px-6 py-4 overflow-y-auto custom-scrollbar">
          {/* Заголовок страницы */}
          <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
            {t.title}
          </h2>

          {/* Контент */}
          <div className="space-y-6 text-gray-800">
            {/* О проекте */}
            <div>
              <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
                {t.aboutProject}
              </h3>
              <p className="text-base leading-relaxed">{t.description}</p>
            </div>

            {/* Возможности */}
            <div>
              <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
                {t.features}
              </h3>
              <div className="space-y-2">
                <p className="text-base leading-relaxed">{t.feature1}</p>
                <p className="text-base leading-relaxed">{t.feature2}</p>
                <p className="text-base leading-relaxed">{t.feature3}</p>
                <p className="text-base leading-relaxed">{t.feature4}</p>
                <p className="text-base leading-relaxed">{t.feature5}</p>
              </div>
            </div>

            {/* Миссия */}
            <div>
              <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
                {t.mission}
              </h3>
              <p className="text-base leading-relaxed">{t.missionText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фиксированная кнопка "Назад" */}
      <div className="fixed bottom-3 left-0 right-0 z-20 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-[#EDEAFF] p-2">
            <button
              onClick={() => navigate("/main?tab=profile")}
              className="w-full h-[48px] rounded-xl bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white font-semibold active:scale-[0.99] transition"
            >
              {t.back}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoScreen;
