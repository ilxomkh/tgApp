import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";

const InviteTab = ({ locale = "ru", user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { getInviteStats, loading, error } = useApi();
  const [toast, setToast] = React.useState(null);
  const [inviteStats, setInviteStats] = useState({
    total_invited: 0,
    active_invited: 0,
    pending_amount: 0,
    earned_amount: 0,
    referral_code: null,
  });

  const translations = {
    ru: {
      inviteTitle: "Пригласите друга и получайте средства",
      earn: "Зарабатывайте",
      earnAmount: "5 000 сум",
      earnSubtitle: "с каждого приглашенного друга",
      howItWorks: "Как это работает?",
      invited: "Кол-во приглашенных:",
      active: "Кол-во активных:",
      pending: "Сумма в ожидании:",
      earned: "Заработанные деньги:",
      invite: "Пригласить",
      copy: "Копировать",
      copied: "Ссылка скопирована",
      copyFail: "Не удалось скопировать",
      sent: "Отправлено",
      loading: "Загрузка...",
      error: "Ошибка загрузки статистики",
      currency: "сум",
    },
    uz: {
      inviteTitle: "Do'stingizni taklif qiling va mablag' oling",
      earn: "Daromad qiling",
      earnAmount: "5 000 so'm",
      earnSubtitle: "har bir taklif qilingan do'stdan",
      howItWorks: "Bu qanday ishlaydi?",
      invited: "Taklif qilinganlar soni:",
      active: "Faol soni:",
      pending: "Kutilayotgan summa:",
      earned: "Topilgan pul:",
      invite: "Taklif qilish",
      copy: "Nusxalash",
      copied: "Havola nusхalandi",
      copyFail: "Nusхalab bo'lmadi",
      sent: "Yuborildi",
      loading: "Yuklanmoqda...",
      error: "Statistikani yuklashda xatolik",
      currency: "so'm",
    },
  };
  const t = translations[language || locale];

  useEffect(() => {
    const loadInviteStats = async () => {
      const result = await getInviteStats();
      if (result.success) {
        setInviteStats({
          total_invited: result.data.total_invited ?? 0,
          active_invited: result.data.active_invited ?? 0,
          pending_amount: result.data.pending_amount ?? 0,
          earned_amount: result.data.earned_amount ?? 0,
          referral_code: result.data.referral_code ?? null,
        });
      } else {
        console.error("Failed to load invite stats:", result.error);
      }
    };

    loadInviteStats();
  }, [getInviteStats]);

  const refLink = React.useMemo(() => {
    const code = inviteStats.referral_code || user?.referral_code || "demo123";
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://example.com";
    return `${origin}/open/?referral_code=${code}`;
  }, [inviteStats.referral_code, user?.referral_code]);

  const showToast = (msg) => {
    if (!msg) return;
    setToast(msg);
    window.clearTimeout(showToast.__t);
    showToast.__t = window.setTimeout(() => setToast(null), 2500);
  };

  const onInvite = async () => {
    const shareData = {
      title: t.inviteTitle,
      text: "Присоединяйся и зарабатывай вместе со мной!",
      url: refLink,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast(t.sent);
      } else {
        await navigator.clipboard.writeText(refLink);
        showToast(t.copied);
      }
    } catch {}
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      showToast(t.copied);
    } catch {
      showToast(t.copyFail);
    }
  };

  const onHowItWorks = () => {
    navigate("/referral-program");
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#5E5AF6] mb-2">
          {t.inviteTitle}
        </h1>
      </div>

      <div className="bg-gradient-to-r from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg">
        <div className="text-start">
          <p className="text-white text-sm font-medium mb-1">{t.earn}</p>
          <p className="text-3xl font-bold mb-2">{t.earnAmount}</p>
          <p className="text-white text-sm">{t.earnSubtitle}</p>
        </div>
      </div>

      <button
        onClick={onHowItWorks}
        className="w-full bg-[#8888FC] rounded-2xl p-4 flex items-center justify-between hover:bg-[#8585fc] transition-colors"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#8888FC] flex items-center justify-center">
            <span className="text-3xl">📖</span>
          </div>
          <span className="text-white font-medium">{t.howItWorks}</span>
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
        >
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="grid grid-cols-2 gap-2">
        {loading && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-px border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">
              {t.error}: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white border border-px border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm mb-2">{t.invited}</p>
              <p className="text-[#5E5AF6] text-xl font-bold">
                {inviteStats.total_invited}
              </p>
            </div>
            <div className="bg-white border border-px border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm mb-2">{t.active}</p>
              <p className="text-[#5E5AF6] text-xl font-bold">
                {inviteStats.active_invited}
              </p>
            </div>
            <div className="bg-white border border-px border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm mb-2">{t.pending}</p>
              <p className="text-[#5E5AF6] text-xl font-bold">
                {inviteStats.pending_amount?.toLocaleString()} {t.currency}
              </p>
            </div>
            <div className="bg-white border border-px border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm mb-2">{t.earned}</p>
              <p className="text-[#5E5AF6] text-xl font-bold">
                {inviteStats.earned_amount?.toLocaleString()} {t.currency}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onInvite}
          className="flex-1 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 46 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.5523 18.675C35.3545 20.5773 37.3182 23.1545 37.3182 26.5909V32.7273H45.5V26.5909C45.5 22.1318 38.1977 19.4932 32.5523 18.675Z"
              fill="white"
            />
            <path
              d="M29.1364 16.3636C33.6568 16.3636 37.3182 12.7023 37.3182 8.18182C37.3182 3.66136 33.6568 0 29.1364 0C28.175 0 27.275 0.204545 26.4159 0.490909C28.1136 2.59773 29.1364 5.27727 29.1364 8.18182C29.1364 11.0864 28.1136 13.7659 26.4159 15.8727C27.275 16.1591 28.175 16.3636 29.1364 16.3636Z"
              fill="white"
            />
            <path
              d="M16.8636 16.3636C21.3841 16.3636 25.0455 12.7023 25.0455 8.18182C25.0455 3.66136 21.3841 0 16.8636 0C12.3432 0 8.68182 3.66136 8.68182 8.18182C8.68182 12.7023 12.3432 16.3636 16.8636 16.3636ZM16.8636 4.09091C19.1136 4.09091 20.9545 5.93182 20.9545 8.18182C20.9545 10.4318 19.1136 12.2727 16.8636 12.2727C14.6136 12.2727 12.7727 10.4318 12.7727 8.18182C12.7727 5.93182 14.6136 4.09091 16.8636 4.09091Z"
              fill="white"
            />
            <path
              d="M16.8636 18.4091C11.4023 18.4091 0.5 21.15 0.5 26.5909V32.7273H33.2273V26.5909C33.2273 21.15 22.325 18.4091 16.8636 18.4091ZM29.1364 28.6364H4.59091V26.6114C5 25.1386 11.3409 22.5 16.8636 22.5C22.3864 22.5 28.7273 25.1386 29.1364 26.5909V28.6364Z"
              fill="white"
            />
          </svg>

          <span className="font-medium">{t.invite}</span>
        </button>
        <div className="relative">
          <button
            onClick={onCopy}
            className="w-16 h-16 bg-[#8888FC] border-2 border-[#B1B2FC] text-white rounded-2xl flex items-center justify-center transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 53 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.7804 0.862061H6.03225C3.03033 0.862061 0.574219 3.27583 0.574219 6.22599V43.7735H6.03225V6.22599H38.7804V0.862061ZM46.9675 11.5899H16.9483C13.9464 11.5899 11.4903 14.0037 11.4903 16.9538V54.5013C11.4903 57.4515 13.9464 59.8652 16.9483 59.8652H46.9675C49.9694 59.8652 52.4255 57.4515 52.4255 54.5013V16.9538C52.4255 14.0037 49.9694 11.5899 46.9675 11.5899ZM46.9675 54.5013H16.9483V16.9538H46.9675V54.5013Z"
                fill="white"
              />
            </svg>
          </button>
          
          <div
            className={`absolute right-0 bottom-full mb-2 transition-all duration-300 ease-out z-50 pointer-events-none ${
              toast 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-2 scale-95"
            }`}
          >
            {toast && (
              <div className="relative">
                <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium shadow-2xl backdrop-blur-sm border border-gray-600/50 flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <span>{toast}</span>
                </div>
                
                <div className="absolute right-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default InviteTab;
