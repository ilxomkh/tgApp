import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useHapticClick } from "../utils/hapticFeedback";
import PRO from "../assets/Pro.svg";
import WaveOverlay from "./WaveOverlay";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Проверяем авторизацию при загрузке
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/main");
    }
  }, [isAuthenticated, navigate]);

  const handleStart = () => {
    navigate("/onboarding");
  };

  const handleLanguageSelect = () => {
    openLanguageModal();
  };

  const welcomeText = {
    uz: {
      title: "Pro Survey",
      subtitle:
        'Siz kerakli so\'rovnomalarda ishtirok etib pul topishingiz mumkin. "PROSURVEY" MChJ rasmiy Telegram boti.',
      buttonText: "Botdan foydalanish uchun bosing",
      startButton: "Старт",
      languageButton: "Tilni tanlash",
    },
    ru: {
      title: "Pro Survey",
      subtitle:
        'Вы можете заработать деньги, участвуя в необходимых опросах. Официальный Telegram бот ООО "PROSURVEY".',
      buttonText: "Чтобы использовать бота, нажмите сюда",
      startButton: "Старт",
      languageButton: "Выбрать язык",
    },
  };

  const currentText = welcomeText[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7C65FF] to-[#5538F9] p-6 flex flex-col">
        <WaveOverlay />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center text-white max-w-sm">
          <img src={PRO} alt="Pro" className="w-[254px] h-[85px] mx-auto mb-6" />
          <div className="space-y-3"></div>
        </div>
      </div>
      <div className="w-full flex justify-center pb-6">
        <button
          onClick={useHapticClick(handleLanguageSelect, 'light')}
          className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 text-base w-full max-w-xs border border-white/30"
        >
          {currentText.languageButton}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
