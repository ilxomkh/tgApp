import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const OTP_LENGTH = 6;

/** Формат отображения: +998 99 999 99 99 */
const formatUzPhone = (rawDigits) => {
  const d = rawDigits.slice(0, 9);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 7);
  const p4 = d.slice(7, 9);
  let tail = '';
  if (d.length <= 2) tail = p1;
  else if (d.length <= 5) tail = `${p1} ${p2}`;
  else if (d.length <= 7) tail = `${p1} ${p2} ${p3}`;
  else tail = `${p1} ${p2} ${p3} ${p4}`;
  return `+998${tail ? ' ' + tail : ''}`;
};

/** Достаём только 9 локальных цифр после 998 */
const extractUzDigits = (val) => {
  const digits = (val || '').replace(/\D/g, '');
  if (digits.startsWith('998')) return digits.slice(3, 12);
  if (digits.length === 12 && digits.startsWith('8')) return digits.slice(1, 10);
  return digits.slice(0, 9);
};

const AuthScreen = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();
  const { sendOtp, login } = useAuth();

  const [phoneLocalDigits, setPhoneLocalDigits] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

  const t = {
    uz: {
      back: 'Orqaga',
      title: 'Avtorizatsiya',
      phoneInstruction: 'Telefon raqamingizni kiriting, unga tekshiruv SMS kodi keladi',
      phonePlaceholder: '99 999 99 99',
      privacyText1: '"Avtorizatsiya qilish" tugmasini bosish orqali siz ',
      privacyLink: 'maxfiylik siyosati',
      privacyText2: ' bilan tanishganingizni tasdiqlaysiz',
      sendOtp: 'Avtorizatsiya qilish',
      sending: 'Yuborilmoqda...',
      otpInstruction: 'Raqamga yuborilgan kodni kiriting',
      resendText: 'Kod kelmadimi?',
      resendLink: 'Qayta yuborish',
      confirm: 'Tasdiqlash',
      verifying: 'Tekshirilmoqda...',
      wrongOtp: "Noto'g'ri OTP kodi",
      badPhone: "Telefon raqamini to'g'ri kiriting",
      error: 'Xatolik yuz berdi',
      langAria: 'Tilni tanlash',
      phoneLabel: 'Telefon raqami'
    },
    ru: {
      back: 'Назад',
      title: 'Авторизация',
      phoneInstruction: 'Введите номер телефона, на него придет проверочный SMS-код',
      phonePlaceholder: '99 999 99 99',
      privacyText1: 'Нажимая на кнопку «Авторизоваться», вы соглашаетесь с ',
      privacyLink: 'политикой конфиденциальности',
      privacyText2: '',
      sendOtp: 'Авторизоваться',
      sending: 'Отправляется...',
      otpInstruction: 'Введите код, отправленный на номер',
      resendText: 'Не получили код?',
      resendLink: 'Отправить повторно',
      confirm: 'Подтвердить',
      verifying: 'Проверяется...',
      wrongOtp: 'Неверный код OTP',
      badPhone: 'Введите правильный номер телефона',
      error: 'Произошла ошибка',
      langAria: 'Выбор языка',
      phoneLabel: 'Номер телефона'
    }
  }[language];

  const phoneFormatted = formatUzPhone(phoneLocalDigits);
  const phoneE164 = `+998${phoneLocalDigits}`;

  // OTP helpers
  const otpToString = () => otp.join('');
  const handleOtpChange = (i, v) => {
    const val = v.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.current?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.current?.focus();
    if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.current?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.current?.focus();
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!paste) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtp(next);
    otpRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.current?.focus();
  };

  // Actions
  const handleSendOtp = async () => {
    if (phoneLocalDigits.length !== 9) {
      setError(t.badPhone);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const ok = await sendOtp(phoneE164);
      if (ok) setIsOtpSent(true);
      else setError(t.error);
    } catch {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpToString();
    if (code.length < OTP_LENGTH) {
      setError(t.wrongOtp);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const ok = await login(phoneE164, code);
      if (ok) navigate('/privacy');
      else setError(t.wrongOtp);
    } catch {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Плавающие экшены сверху */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="h-10 px-4 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 shadow-sm active:scale-95 transition flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-medium">{t.back}</span>
        </button>
      </div>

      <button
        onClick={openLanguageModal}
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-emerald-600 text-white text-lg grid place-items-center shadow-lg active:scale-95 transition"
        aria-label={t.langAria}
        title={t.langAria}
      >
        {language === 'uz' ? '🇺🇿' : '🇷🇺'}
      </button>

      {/* Контент: делим экран на центр и нижнюю панель */}
      <div className="flex flex-col min-h-screen px-6 pt-6 pb-6">
        {!isOtpSent ? (
          <>
            {/* Центр: заголовок опущен ниже, поле строго по центру */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">{t.title}</h1>
                <p className="text-gray-600 text-lg">{t.phoneInstruction}</p>
              </div>

              {/* Поле — в центре */}
              <div className="w-full max-w-sm">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 ">
                  <label className="block text-xs text-gray-500 mb-2">{t.phoneLabel}</label>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 text-xl">
                      🇺🇿
                    </span>
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                        +998
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneFormatted}
                        onChange={(e) => setPhoneLocalDigits(extractUzDigits(e.target.value))}
                        onFocus={(e) => {
                          if (!phoneLocalDigits) setPhoneLocalDigits('');
                          setTimeout(() => e.target.setSelectionRange(e.target.value.length, e.target.value.length), 0);
                        }}
                        placeholder={t.phonePlaceholder}
                        className="w-full h-12 pl-16 pr-4 rounded-xl border-2 border-transparent bg-gray-50 text-lg font-medium text-gray-900
                                   focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Низ: политика + кнопка */}
            <div className="mt-8">
              <p className="text-gray-600 text-sm text-center mb-4">
                {t.privacyText1}
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
                >
                  {t.privacyLink}
                </button>
                {t.privacyText2}
              </p>
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isLoading ? t.sending : t.sendOtp}
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Шаг OTP: центр и низ сохранены в той же логике */
          <>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">{t.title}</h1>
                <p className="text-gray-600 text-lg">
                  {t.otpInstruction} <span className="font-semibold">{phoneFormatted}</span>
                </p>
              </div>

              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={otpRefs.current[i]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold
                               focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-center mb-4">
                <span className="text-gray-600 text-sm">{t.resendText} </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-sm text-blue-600 underline underline-offset-4 hover:text-blue-700 disabled:opacity-50"
                >
                  {t.resendLink}
                </button>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isLoading ? t.verifying : t.confirm}
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
