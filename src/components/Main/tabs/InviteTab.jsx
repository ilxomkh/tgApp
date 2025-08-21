import React from "react";
import { CTAButton, GradientCard, SectionCard, StatPill } from "../ui.jsx";
import BottomSheet from "../BottomSheet.jsx";

const InviteTab = ({ locale = "ru", refCode }) => {
  const [toast, setToast] = React.useState(null);
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);

  // ---------- Переводы ----------
  const translations = {
    ru: {
      inviteTitle: "Пригласить друга",
      inviteSubtitle: "Получите 10 000 сум за каждого приглашённого",
      whatToDo: "Что надо сделать?",
      inv1: "Пригласите друга по реферальной ссылке.",
      inv2: "Приглашённый должен пройти минимум 3 опроса и стать Актив.",
      inv3: "Выведите заработанные деньги на карту.",
      more: "Узнать подробнее",
      stats: "Статистика:",
      invited: "Кол-во приглашённых",
      activeInv: "В активе приглашённых",
      waitSum: "Сумма в ожидании",
      earned: "Заработанные деньги",
      sum: "сум",
      inviteFriend: "Пригласить друга",
      copyLink: "Скопировать ссылку",
      copied: "Ссылка скопирована",
      copyFail: "Не удалось скопировать",
      sharedOk: "Отправлено",
      termsTitle: "Условия реферальной программы",
      termsText:
        "Приглашайте друзей по вашей персональной ссылке. После того как друг выполнит условия (пройдёт минимум 3 опроса), вы получите бонус. Заработанные средства можно вывести на карту.",
      shareText: "Присоединяйся и зарабатывай вместе со мной!",
    },
    uz: {
      inviteTitle: "Do'stni taklif qilish",
      inviteSubtitle: "Har bir taklif qilingan do'st uchun 10 000 so'm oling",
      whatToDo: "Nima qilish kerak?",
      inv1: "Do'stingizni referal havola orqali taklif qiling.",
      inv2: "Taklif qilingan foydalanuvchi kamida 3 ta so'rovda qatnashib Aktiv bo‘lishi kerak.",
      inv3: "Topilgan pulni kartaga yechib oling.",
      more: "Batafsil",
      stats: "Statistika:",
      invited: "Taklif qilinganlar soni",
      activeInv: "Aktiv holатdagilar",
      waitSum: "Kutilayotgan summa",
      earned: "Topilgan pul",
      sum: "so'm",
      inviteFriend: "Do'stni taklif qilish",
      copyLink: "Havolani nusxalash",
      copied: "Havola nusхalandi",
      copyFail: "Nusхalab bo‘lmadi",
      sharedOk: "Yuborildi",
      termsTitle: "Referal dasturi shartlari",
      termsText:
        "Do‘stlaringizni shaxsiy havola orqali taklif qiling. Ular kamida 3 ta so‘rovda qatnashsa bonus olasiz. Topilgan mablag‘ni kartaga yechib olish mumkin.",
      shareText: "Qatnashing va birga daromad qilaylik!",
    },
  };
  const t = translations[locale];

  // ---------- Реферальная ссылка ----------
  const refLink = React.useMemo(() => {
    const code =
      refCode ||
      localStorage.getItem("ref_code") ||
      localStorage.getItem("user_ref_code") ||
      "demo123";
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://example.com";
    return `${origin}/invite/${code}`;
  }, [refCode]);

  const showToast = (msg) => {
    if (!msg) return;
    setToast(msg);
    window.clearTimeout(showToast.__t);
    showToast.__t = window.setTimeout(() => setToast(null), 1800);
  };

  const onInvite = async () => {
    const shareData = { title: t.inviteTitle, text: t.shareText, url: refLink };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast(t.sharedOk);
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

  return (
    <div className="space-y-5 pb-2">
      {/* Верхний блок */}
      <SectionCard className="p-5">
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-gray-900 mb-3">
            {t.inviteTitle}
          </h3>
          {t.inviteSubtitle && (
            <p className="text-sm text-gray-600">{t.inviteSubtitle}</p>
          )}
        </div>

        <GradientCard
          from="from-blue-600"
          to="to-indigo-600"
          className="p-5 mt-4"
        >
          <h4 className="font-semibold mb-3 text-white">{t.whatToDo}</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-white/95">
            <li>{t.inv1}</li>
            <li>{t.inv2}</li>
            <li>{t.inv3}</li>
          </ol>
        </GradientCard>

        <div className="mt-4">
          <CTAButton onClick={() => setIsTermsOpen(true)}>{t.more}</CTAButton>
        </div>
      </SectionCard>

      {/* Статистика */}
      <SectionCard className="p-5">
        <h4 className="font-semibold text-gray-800 mb-3">{t.stats}</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <StatPill label={t.invited} value="20" />
          <StatPill label={t.activeInv} value="3" />
          <StatPill label={t.waitSum} value={`170 000 ${t.sum}`} />
          <StatPill label={t.earned} value={`30 000 ${t.sum}`} />
        </div>
      </SectionCard>

      {/* Bottom actions */}
      <div className="sticky bottom-2 z-30 px-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch gap-3 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-2">
          <CTAButton
            onClick={onInvite}
            className="flex-1 h-14 sm:h-16 rounded-xl text-base font-semibold"
          >
            {t.inviteFriend}
          </CTAButton>

          <button
            onClick={onCopy}
            className="h-14 sm:h-16 aspect-square rounded-xl bg-emerald-600 text-white
                 hover:bg-emerald-700 active:scale-[0.98] transition shadow-sm
                 inline-flex items-center justify-center"
            aria-label={t.copyLink}
            title={t.copyLink}
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="10" height="10" rx="2" />
              <rect x="5" y="5" width="10" height="10" rx="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Тост */}
      <div
        className={`pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-20 transition-opacity duration-200 ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast && (
          <div className="px-3 py-2 rounded-xl bg-black/80 text-white text-sm shadow-lg">
            {toast}
          </div>
        )}
      </div>

      {/* Bottom Sheet: Условия */}
      <BottomSheet
        title={t.termsTitle}
        open={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      >
        <p className="text-sm text-gray-700 leading-relaxed">{t.termsText}</p>
        <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>{t.inv1}</li>
          <li>{t.inv2}</li>
          <li>{t.inv3}</li>
        </ul>
      </BottomSheet>
    </div>
  );
};

export default InviteTab;
