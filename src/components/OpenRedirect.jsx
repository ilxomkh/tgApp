import { useEffect } from "react";

const BOT_USERNAME = "pro_surveybot";   // замени на твой username бота
const DEFAULT_PAYLOAD = "home";        // можешь поменять payload если нужно

export default function OpenRedirect() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    try {
      // Попробовать закрыть текущий web_app, чтобы не оставался "чёрный фон"
      tg?.close?.();
    } catch (err) {
      console.warn("Ошибка при закрытии WebApp:", err);
    }

    // Небольшая задержка перед редиректом, чтобы Telegram успел закрыть контейнер
    const timer = setTimeout(() => {
      const url = `https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(DEFAULT_PAYLOAD)}`;
      window.location.replace(url);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif",
        background: "linear-gradient(180deg,#7C65FF,#5538F9)",
        color: "white"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 12 }}>
          Открываю Mini App…
        </div>
        <a
          href={`https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(DEFAULT_PAYLOAD)}`}
          style={{ fontSize: 14, textDecoration: "underline", color: "#fff" }}
        >
          Если не открылось — нажмите здесь
        </a>
      </div>
    </div>
  );
}
