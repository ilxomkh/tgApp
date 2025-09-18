import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useReferralCode } from "../hooks/useReferralCode";
import PRO from "../assets/Pro.svg";
import WaveOverlay from "./WaveOverlay";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { openLanguageModal } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { referralCode } = useReferralCode();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/main");
    } else {
      const timer = setTimeout(() => {
        openLanguageModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, openLanguageModal]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7C65FF] to-[#5538F9] p-6 flex flex-col">
      <WaveOverlay />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center text-white max-w-sm">
          <img src={PRO} alt="Pro" className="w-[254px] h-[85px] mx-auto mb-6" />
        </div>
        
        <button
          onClick={openLanguageModal}
          className="mt-8 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-medium hover:bg-white/30 transition-colors"
        >
          Выберите язык / Tilni tanlang
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
