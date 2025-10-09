import { useEffect } from "react";
import ProSVG from "../assets/Pro.svg";
import WaveOverlay from "./WaveOverlay";

const BOT_USERNAME = "pro_surveybot";
const DEFAULT_PAYLOAD = "home";

export default function OpenRedirect() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const url = `https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(DEFAULT_PAYLOAD)}`;

    window.location.href = url;

    const timer = setTimeout(() => {
      try {
        tg?.close?.();
      } catch (err) {}
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif",
        background: "linear-gradient(180deg,#7C65FF,#5538F9)",
        color: "white",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 12 }}>
          <WaveOverlay />
          <img src={ProSVG} alt="Pro" className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"/>
        </div>
      </div>
    </div>
  );
}
