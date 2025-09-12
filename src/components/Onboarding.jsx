import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useHapticClick } from "../utils/hapticFeedback";
import PRO from '../assets/Pro.svg';
import WaveOverlay from "./WaveOverlay";
import FilePNG from '../assets/File Folder 1.png';
import MemoPNG from '../assets/Memo 1.png';
import RocketPNG from '../assets/Rocket 1.png';
import TrophyPNG from '../assets/Trophy 1.png';

// Небольшой SVG‑логотип (как в макете слева от "Pro Survey")
const Logo = ({ className = "" }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M38.7 8.2c-4.6 8.5-9.8 12.9-16.1 14.6l10.2-14h-9.5L9.3 39.8h9.6l6.5-8.9c9.1-1.9 15.1-7.7 19.3-18.9h-6z" />
  </svg>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isLast = currentSlide === 4;
  const touchX = useRef(null);

  const t =
    {
      uz: {
        slides: [
          {
            title: "Pro Survey qanday ishlaydi?",
          },
          {
            title: "Ro'yxatdan o'ting",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Memo.webp",
          },
          {
            title: "So'rovnomalarni o'ting",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/File%20Folder.webp",
          },
          {
            title:
              "Kafolatli pul yoki yutuqlar\nro'yxatidan birini oling",
              image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Trophy.webp",
            },
          {
            title:
              "Pulni darhol o'zingizning\nbank kartangizga yechib oling",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Travel%20and%20Places/Rocket.webp",
          },
        ],
        next: "Keyingi",
        start: "Boshlash",
        skip: "O'tkazib yuborish",
      },
      ru: {
        slides: [
          {
            title: "Как работает\nPro Survey?",
          },
          {
            title: "Пройдите\nрегистрацию",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Memo.webp",
          },
          {
            title: "Проходите\nопросы",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/File%20Folder.webp",
          },
          {
            title: "Получите гарантированные\nденьги или станьте участником\nрозыгрыша",
            image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Trophy.webp",
          },
          
          {
            title:
              "Моментально выведите свои\nсредства на свою банковскую карту",
              image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Travel%20and%20Places/Rocket.webp",
            },
        ],
        next: "Далее",
        start: "Начать",
        skip: "Пропустить",
      },
    }[language || "ru"];

  const slides = t.slides;

  const next = () => (isLast ? navigate("/auth") : setCurrentSlide((s) => s + 1));
  const prev = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const skip = () => navigate("/auth");

  // Клавиатура
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, isLast]);

  // Свайпы
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx < -40) next();
    if (dx > 40) prev();
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0] flex flex-col text-white overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <WaveOverlay />
      {/* Фон: фиолетовый градиент + волны */}


      {/* Шапка: логотип и сегменты прогресса */}
      <div className="px-5 pt-20">

        {/* Сегменты (как на макете — 5 тонких полосок) */}
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: slides.length }).map((_, i) => (
            <div
              key={i}
              className={`h-[4px] rounded-full transition-all ${
                i <= currentSlide ? "bg-white" : "bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center pt-12 w-full">
        <img src={PRO} alt="Pro Survey" className="w-[204px]" />
      </div>

      {/* Контент с картинкой */}
      <div className="flex-1 px-8 flex items-center">
        <div className="w-full">
          {/* Центровка изображения как в макете — крупно, по центру */}
          <div className="flex justify-center mt-6 mb-6">
            {slides[currentSlide].image && (
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-[200px] h-[200px] object-contain z-50"
              />
            )}
          </div>
        </div>
      </div>

      {/* Нижние кнопки как на макете — две белые с фиолетовым текстом */}
      <div className="px-5 pb-8">
      <h1 className="whitespace-pre-line text-[38px] font-extrabold pb-8">
            {slides[currentSlide].title}
          </h1>

          {/* Описание (в макете его почти не видно — делаем полупрозрачным) */}
          {slides[currentSlide].desc && (
            <p className="mt-3 text-white/80">{slides[currentSlide].desc}</p>
          )}
        <button
          onClick={useHapticClick(next, 'medium')}
          className="w-full h-11 rounded-xl bg-[#F9FAFC] text-[#5527E9] font-semibold shadow-[0_8px_24px_rgba(0,0,0,.15)] active:scale-[0.99] transition"
        >
          {isLast ? t.start : t.next}
        </button>

        {!isLast && (
          <button
            onClick={useHapticClick(skip, 'light')}
            className="mt-3 w-full h-11 rounded-xl bg-[#B1B2FC] text-white font-semibold shadow-[0_6px_20px_rgba(0,0,0,.12)] active:scale-[0.99] transition"
          >
            {t.skip}
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
