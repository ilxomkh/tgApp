import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const PublicOfferScreen = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // ---------- Переводы ----------
  const translations = {
    ru: {
      title: "Публичная оферта",
      back: "Назад",
      offerTitle: "Публичная оферта на оказание услуг",
      company: "ООО 'Pro Survey'",
      address: "Адрес: Республика Узбекистан, г. Ташкент",
      terms: "Условия оказания услуг:",
      term1: "• Услуги предоставляются на основании настоящей публичной оферты",
      term2: "• Пользователь принимает условия, начиная использовать сервис",
      term3: "• Оплата производится в соответствии с тарифами платформы",
      term4: "• Возврат средств осуществляется согласно политике платформы",
      term5: "• Все споры решаются в соответствии с законодательством РУз",
      contact: "Контактная информация:",
      contactText: "По всем вопросам обращайтесь в службу поддержки через приложение.",
    },
    uz: {
      title: "Ochiq taklif",
      back: "Orqaga",
      offerTitle: "Xizmat ko'rsatish bo'yicha ochiq taklif",
      company: "'Pro Survey' MChJ",
      address: "Manzil: O'zbekiston Respublikasi, Toshkent shahri",
      terms: "Xizmat ko'rsatish shartlari:",
      term1: "• Xizmatlar ushbu ochiq taklif asosida ko'rsatiladi",
      term2: "• Foydalanuvchi xizmatdan foydalanishni boshlash orqali shartlarni qabul qiladi",
      term3: "• To'lov platforma tariflariga muvofiq amalga oshiriladi",
      term4: "• Mablag'larni qaytarish platforma siyosatiga muvofiq amalga oshiriladi",
      term5: "• Barcha nizolar O'zR qonunchiligi asosida hal qilinadi",
      contact: "Aloqa ma'lumotlari:",
      contactText: "Barcha savollar bo'yicha ilovadagi qo'llab-quvvatlash xizmatiga murojaat qiling.",
    },
  };
  const t = translations[language || "ru"];

  return (
    <div className="">
      <Header />
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-6 py-8 overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
          {t.title}
        </h2>

        {/* Контент */}
        <div className="space-y-6 text-gray-800">
          {/* Заголовок оферты */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.offerTitle}
            </h3>
            <p className="text-base leading-relaxed font-semibold mb-2">
              {t.company}
            </p>
            <p className="text-base leading-relaxed">
              {t.address}
            </p>
          </div>

          {/* Условия */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.terms}
            </h3>
            <div className="space-y-2">
              <p className="text-base leading-relaxed">{t.term1}</p>
              <p className="text-base leading-relaxed">{t.term2}</p>
              <p className="text-base leading-relaxed">{t.term3}</p>
              <p className="text-base leading-relaxed">{t.term4}</p>
              <p className="text-base leading-relaxed">{t.term5}</p>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-3">
              {t.contact}
            </h3>
            <p className="text-base leading-relaxed">
              {t.contactText}
            </p>
          </div>
        </div>

        {/* Кнопка "Назад" */}
        <div className="rounded-2xl bg-[#EDEAFF] p-2 mt-10">
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

export default PublicOfferScreen;
