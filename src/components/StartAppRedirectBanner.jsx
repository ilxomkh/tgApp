import React, { useEffect, useState } from "react";

const BOT_USERNAME = "pro_surveybot"; // 👈 замени на своего бота
const STARTAPP_LINK = `https://t.me/${BOT_USERNAME}/webapp?startapp=1`;

export default function StartAppRedirectBanner() {
  const [needsRedirect, setNeedsRedirect] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    // Проверяем, есть ли start_param
    const hasStartParam = Boolean(tg.initDataUnsafe?.start_param);
    if (!hasStartParam) {
      setNeedsRedirect(true);
    }
  }, []);

  if (!needsRedirect) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-50">
      <a
        href={STARTAPP_LINK}
        className="block w-full text-center bg-[#5538F9] text-white py-3 rounded-lg font-bold"
      >
        🔗 Открыть приложение правильно
      </a>
    </div>
  );
}
