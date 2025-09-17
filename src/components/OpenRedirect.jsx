import { useEffect } from "react";

/**
 * Страница для открытия из меню Telegram (web_app URL).
 * Сразу перебрасывает в Mini App (startapp deeplink).
 * Без зацикливания, с фолбэком на ссылку.
 */
const BOT_USERNAME = "pro_surveybot";     // <-- ваш username бота
const DEFAULT_PAYLOAD = "home";          // <-- ваш payload (при необходимости)

export default function OpenRedirect() {
  useEffect(() => {
    // если уже пришли из t.me — не редиректим повторно (защита от цикла)
    const fromTelegram = document.referrer.includes("t.me");
    if (!fromTelegram) {
      // можно прокинуть свой payload через ?p=... в /open
      const params = new URLSearchParams(window.location.search);
      const payload = params.get("p") || DEFAULT_PAYLOAD;

      // помечаем, что уже редиректили в этой сессии
      sessionStorage.setItem("__sa_redirect_done__", "1");

      // мгновенный переход в Mini App
      window.location.replace(`https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(payload)}`);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, opacity: 0.8, marginBottom: 12 }}>
          Открываю Mini App…
        </div>
        <a
          href={`https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(DEFAULT_PAYLOAD)}`}
          style={{ fontSize: 14, textDecoration: "underline" }}
        >
          Если не открылось — нажмите здесь
        </a>
      </div>
    </div>
  );
}
