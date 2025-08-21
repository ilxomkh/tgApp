import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [dir, setDir] = useState('next'); // for slide animation
  const touchX = useRef(null);

  const t = {
    uz: {
      slides: [
        {
          title: "ProSurvey qanday ishlaydi?",
          desc: "Ro'yxatdan o'ting, so'rovnomalarni bajaring va haqiqiy pul oling.",
          emoji: '📊'
        },
        {
          title: "Ro'yxatdan o'ting",
          desc: "Telefon raqami orqali tez va xavfsiz avtorizatsiya.",
          emoji: '📱'
        },
        {
          title: "So'rovnomalarni o'ting",
          desc: "Qiziqarli mavzular, 3–5 daqiqada yakunlanadi.",
          emoji: '✅'
        },
        {
          title: "Kafolatli pul yoki lotereya",
          desc: "Ba’zi so’rovlar uchun kafolatli to’lov, boshqalari — yirik sovrinli.",
          emoji: '🎁'
        },
        {
          title: "Pulni kartaga oling",
          desc: "Mablag'larni darhol bank kartangizga yechib oling.",
          emoji: '💳'
        }
      ],
      back: 'Orqaga',
      next: 'Keyingi',
      start: 'Boshlash',
      skip: "O'tkazib yuborish",
      changeLangAria: 'Tilni tanlash'
    },
    ru: {
      slides: [
        {
          title: 'Как работает ProSurvey?',
          desc: 'Регистрируйтесь, проходите опросы и получайте реальные деньги.',
          emoji: '📊'
        },
        {
          title: 'Пройдите регистрацию',
          desc: 'Быстрая и безопасная авторизация по номеру телефона.',
          emoji: '📱'
        },
        {
          title: 'Проходите опросы',
          desc: 'Интересные темы, завершение за 3–5 минут.',
          emoji: '✅'
        },
        {
          title: 'Гарантированные выплаты или розыгрыши',
          desc: 'За часть опросов — фиксированная сумма, за другие — крупные призы.',
          emoji: '🎁'
        },
        {
          title: 'Вывод на банковскую карту',
          desc: 'Моментально выводите деньги на вашу карту.',
          emoji: '💳'
        }
      ],
      back: 'Назад',
      next: 'Далее',
      start: 'Начать',
      skip: 'Пропустить',
      changeLangAria: 'Выбор языка'
    }
  }[language];

  const slides = t.slides;
  const isLast = currentSlide === slides.length - 1;

  const goTo = (i) => {
    if (i === currentSlide) return;
    setDir(i > currentSlide ? 'next' : 'prev');
    setCurrentSlide(Math.max(0, Math.min(slides.length - 1, i)));
  };

  const nextSlide = () => {
    if (!isLast) {
      setDir('next');
      setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
    } else {
      navigate('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDir('prev');
      setCurrentSlide((s) => Math.max(s - 1, 0));
    }
  };

  const skipOnboarding = () => navigate('/auth');

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, isLast]);

  // Touch swipe
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    const threshold = 40; // px
    if (dx < -threshold) nextSlide();
    if (dx > threshold) prevSlide();
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl" />

      {/* Floating language button */}
      <button
        onClick={openLanguageModal}
        className="fixed top-4 right-4 z-20 h-10 w-10 rounded-full bg-emerald-600 text-white text-lg grid place-items-center shadow-lg active:scale-95 transition"
        aria-label={t.changeLangAria}
        title={t.changeLangAria}
      >
        {language === 'uz' ? '🇺🇿' : '🇷🇺'}
      </button>

      {/* Content */}
      <div className="flex flex-col h-screen">
        {/* Progress bar */}
        <div className="px-6 pt-16">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Slide area */}
        <div
          className="flex-1 flex items-center justify-center px-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full max-w-sm h-72">
            {/* Animated slide */}
            <div
              key={currentSlide} // re-mount for animation
              className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4
                          transition-all duration-300
                          ${dir === 'next' ? 'animate-[slideInFromRight_0.3s_ease]' : 'animate-[slideInFromLeft_0.3s_ease]'}`}
            >
              <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.08)] border border-gray-100">
                <span className="text-3xl">{slides[currentSlide].emoji}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3" aria-live="polite">
                {slides[currentSlide].title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {slides[currentSlide].desc}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="px-6 pb-6">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-emerald-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border transition 
                ${currentSlide === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.99]'
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t.back}</span>
            </button>

            <button
              onClick={nextSlide}
              className="flex-[1.6] h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.99] transition"
            >
              {isLast ? t.start : t.next}
            </button>
          </div>

          {/* Skip link */}
          {!isLast && (
            <button
              onClick={skipOnboarding}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4"
            >
              {t.skip}
            </button>
          )}
        </div>
      </div>

      {/* Keyframes (Tailwind arbitrary animations) */}
      <style>{`
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(24px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-24px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
