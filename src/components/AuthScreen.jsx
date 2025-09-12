// src/screens/AuthScreen.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { isValidUzbekPhone, isValidOtp, cleanOtp } from "../utils/validation";
import { getMessage, getApiErrorMessage } from "../constants/messages";
import { useHapticClick } from "../utils/hapticFeedback";
import { useKeyboard } from "../hooks/useKeyboard";
import PRO from "../assets/Pro.svg";
import error from "../assets/X.svg";

const OTP_LENGTH = 6;

const extractUzDigits = (val) => (val || "").replace(/\D/g, "").slice(0, 9);
/** 99 999 99 99 */
const formatUzPhone = (rawDigits) => {
  const d = rawDigits.slice(0, 9);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 7);
  const p4 = d.slice(7, 9);
  if (!d) return "";
  if (d.length <= 2) return p1;
  if (d.length <= 5) return `${p1} ${p2}`;
  if (d.length <= 7) return `${p1} ${p2} ${p3}`;
  return `${p1} ${p2} ${p3} ${p4}`;
};

const AuthScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { sendOtp, login } = useAuth();
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();

  const [phoneDigits, setPhoneDigits] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

  // Функция для закрытия клавиатуры
  const closeKeyboard = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  // Таймер для кнопки "Отправить код повторно"
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const T =
    {
      ru: {
        title: "Авторизоваться",
        phoneHint: "Введите номер телефона",
        phoneHintSubtext: "на него придет проверочный SMS-код",
        phonePlaceholder: "99 999 99 99",
        send: "Отправить код",
        sending: "Отправляется...",
        otpHint: "Введите код, отправленный на номер",
        otpHintSubtext: "",
        resendQ: "Не получили код?",
        resend: "Отправить код повторно",
        confirm: "Авторизоваться",
        confirming: "Проверяется...",
        privacy1: "Нажимая на кнопку “Авторизоваться”, вы соглашаетесь с ",
        privacyLink: "политикой конфиденциальности",
        privacyLink2: "",
        wrongOtp:
          "Введён неверный код или срок его действия истёк. Пожалуйста, запросите новый код",
        back: "Назад",
        phoneLabel: "Номер телефона",
        wrongNumberHint: "Вы неправильно ввели номер?",
        backToPhone: "Нажмите сюда!",
      },
      uz: {
        title: "Avtorizatsiya",
        phoneHint: "Telefon raqamini kiriting",
        phoneHintSubtext: "unga tekshiruv SMS kodi keladi",
        phonePlaceholder: "99 999 99 99",
        send: "Kod yuborish",
        sending: "Yuborilmoqda...",
        otpHint: "Ushbu raqamga yuborilgan kodni kiriting",
        otpHintSubtext: "",
        resendQ: "Kod kelmadimi?",
        resend: "Qayta yuborish",
        confirm: "Avtorizatsiya qilish",
        confirming: "Tekshirilmoqda...",
        privacy1: "“Avtorizatsiya qilish” tugmasini bosish orqali siz ",
        privacyLink: "maxfiylik siyosati",
        privacyLink2: "ga rozi bo'lasiz",
        wrongOtp:
          "Noto'g'ri kod yoki uning amal qilish muddati tugagan. Iltimos, yangi kod so'rang",
        back: "Orqaga",
        phoneLabel: "Telefon raqami",
        wrongNumberHint: "Telefon raqamini noto'g'ri kiritdingizmi?",
        backToPhone: "Bu yerga bosing!",
      },
    }[language || "ru"];

  const phoneE164 = `+998${phoneDigits}`;

  const otpToString = () => otp.join("");
  const handleOtpChange = (i, v) => {
    const val = v.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    
    if (val && i < OTP_LENGTH - 1) {
      otpRefs.current[i + 1]?.current?.focus();
    } else if (val && i === OTP_LENGTH - 1) {
      // Закрываем клавиатуру при заполнении последнего поля OTP
      setTimeout(closeKeyboard, 100);
    }
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.current?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.current?.focus();
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.current?.focus();
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!paste) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtp(next);
    
    const focusIndex = Math.min(paste.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.current?.focus();
    
    // Закрываем клавиатуру если вставлен полный код
    if (paste.length === OTP_LENGTH) {
      setTimeout(closeKeyboard, 100);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60); // 60 секунд = 1 минута
  };

  const onSendOtp = async () => {
    // Валидация номера телефона
    if (!isValidUzbekPhone(phoneE164)) {
      setErrorText(getMessage('INVALID_PHONE', language));
      return;
    }
    
    setIsLoading(true);
    setErrorText("");
    try {
      const ok = await sendOtp(phoneE164);
      if (ok) {
        setStep("otp");
        // Очищаем OTP поля при переходе к следующему шагу
        setOtp(Array(OTP_LENGTH).fill(""));
        // Запускаем таймер для повторной отправки
        startResendTimer();
      } else {
        setErrorText(getMessage('NETWORK_ERROR', language));
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = getApiErrorMessage(error, language);
      
      // Если ошибка связана с неправильным номером телефона, показываем специальное сообщение
      if (errorMessage.includes('phone') || errorMessage.includes('номер') || errorMessage.includes('raqam')) {
        setErrorText(getMessage('WRONG_PHONE_NUMBER', language));
      } else {
        setErrorText(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async () => {
    const code = otpToString();
    
    // Валидация OTP кода
    if (!isValidOtp(code)) {
      setErrorText(getMessage('INVALID_OTP', language));
      return;
    }
    
    setIsLoading(true);
    setErrorText("");
    try {
      const ok = await login(phoneE164, code);
      if (ok) {
        navigate("/main");
      } else {
        setErrorText(T.wrongOtp);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = getApiErrorMessage(error, language);
      setErrorText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(Array(OTP_LENGTH).fill(""));
    setErrorText("");
  };

  const onResendOtp = async () => {
    if (resendTimer > 0) return; // Не позволяем отправлять, если таймер активен
    
    setIsLoading(true);
    setErrorText("");
    try {
      const ok = await sendOtp(phoneE164);
      if (ok) {
        // Запускаем таймер заново
        startResendTimer();
      } else {
        setErrorText(getMessage('NETWORK_ERROR', language));
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = getApiErrorMessage(error, language);
      setErrorText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col">
      {/* Шапка */}
      <header className="h-36 bg-gradient-to-b from-[#6A4CFF] to-[#5936F2] text-white shadow-md">
        <div className="h-full max-w-[480px] mx-auto flex items-end justify-center pb-3">
          <img src={PRO} alt="Pro Survey" className="h-9" />
        </div>
      </header>

      {/* Контент */}
      <main className="flex-1 max-w-[480px] w-full mx-auto px-6 flex flex-col">
        {/* Заголовок сверху */}
        <h1
          className={[
            "text-center font-bold pt-20",
            "text-[32px] leading-[32px]",
            step === "otp" && errorText ? "text-[#C6C2FF]" : "text-[#5E5AF6]",
          ].join(" ")}
        >
          {T.title}
        </h1>

        {/* PHONE STEP — адаптивный макет для клавиатуры */}
        {step === "phone" && (
          <>
            <div className={`transition-all duration-300 ${isKeyboardOpen ? 'pt-8' : 'pt-40'}`}>
              <div className="w-full max-w-[320px] mx-auto">
                <div className="text-center mb-2">
                  <p className="text-[14px] leading-5 text-[#8B8B99] mb-1">
                    {T.phoneHint}
                  </p>
                  <p className="text-[14px] leading-5 text-[#8B8B99]">
                    {T.phoneHintSubtext}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-13 px-2 rounded-xl border border-[#E7E7F5] flex items-center gap-2 text-[#2B2B33]">
                    <span className="text-[24px] leading-none">🇺🇿</span>
                    <span className="font-semibold text-[24px]">+998</span>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={T.phonePlaceholder}
                    value={formatUzPhone(phoneDigits)}
                    onChange={(e) => {
                      const newDigits = extractUzDigits(e.target.value);
                      setPhoneDigits(newDigits);
                      // Закрываем клавиатуру при вводе 9-й цифры
                      if (newDigits.length === 9) {
                        setTimeout(closeKeyboard, 100);
                      }
                    }}
                    className="flex-1 h-13 w-full rounded-xl border border-[#E7E7F5] px-2 text-[24px] font-medium placeholder:text-[#D7D7E6] text-[#2B2B33] focus:outline-none focus:border-[#6A4CFF]"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Адаптивный отступ снизу для клавиатуры */}
            <div className={`transition-all duration-300 ${isKeyboardOpen ? 'h-[20px]' : 'flex-1'}`} />
          </>
        )}

        {/* OTP STEP — адаптивный макет для клавиатуры */}
        {step === "otp" && (
          <>
            <div className={`transition-all duration-300 flex flex-col items-center justify-start pb-4 ${isKeyboardOpen ? 'pt-4' : 'pt-8 flex-1'}`}>
              <div className="w-full max-w-[300px]">
                <div className="text-center">
                  <p className="text-[14px] leading-5 text-[#8B8B99] mb-1">
                    {T.otpHint}
                  </p>
                  <p className="text-[14px] leading-5 text-[#5E5AF6] font-semibold">
                    +998 {formatUzPhone(phoneDigits)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex gap-3" onPaste={handleOtpPaste}>
                  {otp.map((val, i) => (
                    <input
                      key={i}
                      ref={otpRefs.current[i]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-[48px] h-[48px] rounded-xl border bg-white text-center text-[22px] font-bold text-[#2B2B33] border-[#E1E1F3] focus:border-[#6A4CFF] focus:outline-none"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[#8B8B99] text-sm">{T.resendQ} </span>
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isLoading || resendTimer > 0}
                  className={`text-sm underline underline-offset-4 disabled:opacity-50 transition ${
                    resendTimer > 0 
                      ? 'text-[#8B8B99] cursor-not-allowed' 
                      : 'text-[#6A4CFF] hover:text-[#5A3CE8] hover:opacity-80'
                  }`}
                >
                  {resendTimer > 0 ? `${T.resend} (${resendTimer}с)` : T.resend}
                </button>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[#8B8B99] text-sm">{T.wrongNumberHint} </span>
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="text-sm text-[#6A4CFF] hover:text-[#5A3CE8] hover:opacity-80 underline underline-offset-4 transition"
                >
                  {T.backToPhone}
                </button>
              </div>
            </div>

            {/* Адаптивный отступ снизу для клавиатуры */}
            <div className={`transition-all duration-300 ${isKeyboardOpen ? 'h-[20px]' : 'h-[20px] sm:h-[112px]'}`} />
          </>
        )}
      </main>

      {/* НИЖНИЕ ПАНЕЛИ */}
      {/* PHONE: кнопка снизу с возможной ошибкой */}
      {step === "phone" && (
        <div className={`w-full max-w-[480px] mx-auto px-6 transition-all duration-300 ${isKeyboardOpen ? 'pb-2' : 'pb-6'}`}>
          {/* Показываем ошибку если есть */}
          {errorText && (
            <div className="mb-3 w-full max-w-[420px] mx-auto px-2">
              <div className="rounded-xl border border-[#FFD2D2] bg-[#FFE9E9] p-4 text-[#C03A3A] flex items-center justify-center gap-3">
                <div className="flex items-center justify-center gap-3">
                  <img src={error} alt="X" className="w-6 h-6" />
                  <p className="text-sm leading-[1.45]">{errorText}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-2xl w-full bg-[#EDEAFF] p-2">
            <button
              onClick={useHapticClick(onSendOtp, 'medium')}
              disabled={isLoading || phoneDigits.length !== 9}
              className={`w-full h-[48px] rounded-xl text-white font-semibold disabled:opacity-50 active:scale-[0.99] transition ${
                phoneDigits.length === 9 
                  ? 'bg-[#6A4CFF] hover:bg-[#5A3CE8]' 
                  : 'bg-[#8C8AF9]'
              }`}
            >
              {isLoading ? T.sending : T.send}
            </button>
          </div>
        </div>
      )}

      {/* OTP: текст политики + кнопка снизу (адаптивно) */}
      {step === "otp" && !errorText && (
        <div className={`w-full max-w-[480px] mx-auto px-6 transition-all duration-300 ${isKeyboardOpen ? 'pb-2' : 'pb-6'}`}>
          <p className="text-center text-[12px] text-[#8B8B99] mb-3">
            {T.privacy1}
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="text-[#5E5AF6] underline underline-offset-4"
            >
              {T.privacyLink} 
            </button>
            <span className="text-gray-400">{T.privacyLink2}</span>
          </p>
          <div className="rounded-2xl bg-[#EDEAFF] p-2">
            <button
              onClick={useHapticClick(onVerify, 'medium')}
              disabled={isLoading || otpToString().length !== OTP_LENGTH}
              className={`w-full h-[48px] rounded-xl text-white font-semibold disabled:opacity-50 active:scale-[0.99] transition ${
                otpToString().length === OTP_LENGTH 
                  ? 'bg-[#6A4CFF] hover:bg-[#5A3CE8]' 
                  : 'bg-[#8C8AF9]'
              }`}
            >
              {isLoading ? T.confirming : T.confirm}
            </button>
          </div>
        </div>
      )}

      {/* OTP error: текст ошибки + кнопка "Назад" снизу (адаптивно) */}
      {step === "otp" && errorText && (
        <div className={`w-full max-w-[480px] mx-auto px-6 transition-all duration-300 ${isKeyboardOpen ? 'pb-2' : 'pb-6'}`}>
          {/* Текст ошибки над кнопкой */}
          <div className="mb-3 w-full max-w-[420px] mx-auto px-2">
            <div className="rounded-xl border border-[#FFD2D2] bg-[#FFE9E9] p-4 text-[#C03A3A] flex items-center justify-center gap-3">
              <div className="flex items-center justify-center gap-3">
                <img src={error} alt="X" className="w-6 h-6" />
                <p className="text-sm leading-[1.45]">{errorText}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl bg-[#EDEAFF] p-2">
            <button
              onClick={useHapticClick(() => {
                setErrorText("");
                setStep("phone");
                setOtp(Array(OTP_LENGTH).fill(""));
              }, 'light')}
              className="w-full h-[48px] rounded-xl bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white font-semibold active:scale-[0.99] transition"
            >
              {T.back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
