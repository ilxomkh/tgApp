// src/screens/PrivacyPolicy.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import PRO from "../assets/Pro.svg";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const privacyText = {
    uz: {
      title: "Maxfiylik siyosati",
      content: `OMMAVIY OFERTA

Ushbu ommaviy oferta (keyingi o'rinlarda - "Oferta") ProSurvey xizmatidan foydalanish shartlarini belgilaydi.

1. UMUMIY QOIDALAR
1.1. Ushbu Oferta Oʻzbekiston Respublikasi Fuqarolik kodeksiga muvofiq ommaviy oferta hisoblanadi.
1.2. Ofermani aksept qilish Xizmatdan foydalanish bo'yicha harakatlarni amalga oshirish hisoblanadi.

2. OFERTA PREDMETI
2.1. Ushbu Ofermaning predmeti Foydalanuvchiga so'rovlarda qatnashish va mukofotlar olish uchun Xizmatdan foydalanish huquqini taqdim etishdir.

3. TOMONLARNING HUQUQ VA MAJBURIYATLARI
3.1. Foydalanuvchi quyidagi huquqlarga ega:
- So'rovlarda qatnashish
- Ishtirok uchun mukofot olish
- Xizmatning barcha funksiyalaridan foydalanish

3.2. Foydalanuvchi quyidagilarga majbur:
- Ishonchli ma'lumotlarni taqdim etish
- Xizmatdan foydalanish qoidalariga rioya qilish
- Boshqa foydalanuvchilarning huquqlarini buzmaslik

4. MAXFIYLIK
4.1. Biz foydalanuvchilarning shaxsiy ma'lumotlarini qonunchilikka muvofiq himoya qilishga majburmiz.
4.2. Shaxsiy ma'lumotlar faqatgina xizmatlarni taqdim etish uchun ishlatiladi.

5. YAKUNIY QOIDALAR
5.1. Oferta aksept qilingan paytdan boshlab kuchga kiradi.
5.2. Barcha savollar yuzasidan qo'llab-quvvatlash xizmatiga murojaat qiling.`,
      back: "Orqaga",
    },
    ru: {
      title: "Политика конфиденциальности",
      content: `ПУБЛИЧНАЯ ОФЕРТА

Настоящая публичная оферта (далее - "Оферта") определяет условия использования сервиса ProSurvey.

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Настоящая Оферта является публичной офертой в соответствии со статьёй 437 Гражданского кодекса Российской Федерации.
1.2. Акцептом Оферты является совершение действий по использованию Сервиса.

2. ПРЕДМЕТ ОФЕРТЫ
2.1. Предметом настоящей Оферты является предоставление Пользователю доступа к Сервису для участия в опросах и получения вознаграждений.

3. ПРАВА И ОБЯЗАННОСТИ СТОРОН
3.1. Пользователь имеет право:
- Участвовать в опросах
- Получать вознаграждения за участие
- Использовать все функции Сервиса

3.2. Пользователь обязуется:
- Предоставлять достоверную информацию
- Соблюдать правила использования Сервиса
- Не нарушать права других пользователей

4. КОНФИДЕНЦИАЛЬНОСТЬ
4.1. Мы обязуемся защищать персональные данные Пользователей в соответствии с законодательством.
4.2. Персональные данные используются исключительно для предоставления услуг.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
5.1. Оферта вступает в силу с момента акцепта.
5.2. По всем вопросам обращайтесь в службу поддержки.`,
      back: "Назад",
    },
  }[language || "ru"];

  const contentRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      setAtEnd(scrollTop + clientHeight >= scrollHeight - 2);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F6FF] flex flex-col">
      <header className="h-36 bg-gradient-to-b from-[#6A4CFF] to-[#5936F2] text-white shadow-md">
        <div className="h-full max-w-[480px] mx-auto flex items-end justify-center pb-2">
          <img src={PRO} alt="Pro Survey" className="h-10" />
        </div>
      </header>

      <style>{`
        .policy-scroll {
          scrollbar-width: thin;              /* Firefox */
          scrollbar-color: #B9B6FF #F1F1FF;   /* Firefox */
        }
        .policy-scroll::-webkit-scrollbar { width: 8px; }
        .policy-scroll::-webkit-scrollbar-track {
          background: #F1F1FF;
          border-radius: 12px;
        }
        .policy-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8F7BFF, #6A4CFF);
          border-radius: 12px;
        }
        .policy-scroll::-webkit-scrollbar-thumb:hover {
          filter: brightness(0.95);
        }
      `}</style>

      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 sm:px-6 pt-6 pb-28">
        <h1 className="text-center text-[28px] leading-8 font-bold text-[#6A4CFF] mb-4">
          {privacyText.title}
        </h1>

        <div
          ref={contentRef}
          className="policy-scroll min-h-[420px] max-h-[62vh] sm:max-h-[66vh] overflow-y-auto rounded-2xl bg-white border border-[#E7E7F5] px-4 py-3 text-[13px] leading-[20px] text-[#4B5563] shadow-[0_6px_20px_rgba(2,6,23,0.06)]"
        >
          <pre className="whitespace-pre-wrap font-sans">
            {privacyText.content}
          </pre>
        </div>
      </main>

      <div className="fixed left-0 right-0 bottom-0">
        <div className="mx-auto w-full max-w-[480px] px-4 sm:px-6 pb-5">
          <div className="rounded-2xl bg-[#EDEAFF] p-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full h-[48px] rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition"
            >
              {privacyText.back}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
