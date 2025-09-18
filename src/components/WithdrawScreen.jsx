import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import { useKeyboard } from "../hooks/useKeyboard";
import {
  isValidCardNumber,
  maskCardNumber,
  formatCardNumber,
} from "../utils/validation";
import Header from "./header";
import BottomNav from "./Main/BottomNav";

import UzcardIcon from "../assets/uzcard.svg";
import VisaIcon from "../assets/visa.svg";
import MastercardIcon from "../assets/mastercard.svg";
import HumoIcon from "../assets/humo.svg";
import { EarthIcon } from "./Main/icons";
import WaveOverlay from "./WaveOverlay";
import ProSVG from "../assets/Pro.svg";
import UserAvatar from "./UserAvatar";

const MIN_WITHDRAW = 20000;

const digitsOnly = (v) => (v || "").replace(/\D/g, "");
const formatMoneyStr = (digits) =>
  String(Number(digits || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const detectBrand = (digits) => {
  if (!digits) return null;
  const cleanDigits = digits.replace(/\s/g, "");
  const prefixDigits = cleanDigits.replace(/[^0-9]/g, "");

  if (
    prefixDigits.startsWith("5614") ||
    prefixDigits.startsWith("8600") ||
    prefixDigits.startsWith("6262")
  )
    return "UZCARD";
  if (prefixDigits.startsWith("9860")) return "HUMO";
  
  if (prefixDigits.startsWith("4")) return "VISA";
  if (prefixDigits.startsWith("5")) return "MASTERCARD";
  
  return null;
};

const getCardColor = (brand) => {
  switch (brand) {
    case "UZCARD":
      return "from-indigo-500 to-blue-600";
    case "HUMO":
      return "from-purple-500 to-purple-600";
    case "VISA":
      return "from-emerald-500 to-teal-600 ";
    case "MASTERCARD":
      return "from-orange-500 to-red-500";
    default:
      return "from-[#5538F9] to-[#7C65FF]";
  }
};

const getCardIcon = (brand) => {
  if (!brand) return null;
  switch (brand) {
    case "UZCARD":
      return UzcardIcon;
    case "HUMO":
      return HumoIcon;
    case "VISA":
      return VisaIcon;
    case "MASTERCARD":
      return MastercardIcon;
    default:
      return null;
  }
};

const maskCard = (digits) => {
  if (!digits) return "";
  const clean = digits.replace(/\s/g, "");
  const d = clean.slice(0, 16);
  
  if (d.length <= 8) {
    return group4(d);
  }
  
  const start = d.slice(0, 4);
  const end = d.slice(-4);
  const midLength = d.length - 8;
  const mid = "•".repeat(midLength);
  
  return group4(`${start}${mid}${end}`);
};

const formatMaskedCardNumber = (maskedNumber) => {
  if (!maskedNumber) return "";
  
  // Используем меньший кружочек
  const formatted = maskedNumber.replace(/\*/g, "•");
  
  return group4(formatted.replace(/\s/g, ""));
};

const renderCardNumber = (digits, showMask) => {
  if (!digits) return "";
  
  if (showMask) {
    const formatted = formatMaskedCardNumber(digits);
    return formatted.split('').map((char, index) => {
      if (char === '•') {
        return <span key={index} className="mask-dot">{char}</span>;
      }
      return char;
    });
  }
  
  return group4(digits);
};
const group4 = (v) => {
  if (!v) return "";
  const clean = v.replace(/\s/g, "");
  return clean.replace(/(.{4})/g, "$1 ").trim();
};

const countDigitsBefore = (str, caret) =>
  (str.slice(0, caret).match(/\d/g) || []).length;
const caretFromDigitIndex = (formatted, digitIndex) => {
  if (digitIndex <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitIndex) return i + 1;
    }
  }
  return formatted.length;
};

const SuccessModal = ({ isOpen, onClose, t, onContinue }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const closeSoft = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onContinue();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-200 z-40 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeSoft}
      />

      <div
        className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mx-auto w-full">
          <div className="bg-white rounded-t-3xl p-8 text-center shadow-[0_8px_30px_rgba(2,6,23,0.06)]">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 border border-green-200 grid place-items-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                className="text-green-600"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t.congratulations}
            </h2>
            <p className="text-gray-600 mb-6">{t.cardAddedSuccess}</p>

            <button
              onClick={closeSoft}
              className="w-full h-12 rounded-xl bg-[#5E5AF6] text-white font-medium hover:bg-[#4A46E8] active:scale-[0.99] transition"
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const WithdrawScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, refreshUserProfile } = useAuth();
  const { getCards, addCard, createPayment, loading, error } = useApi();
  const { isKeyboardOpen } = useKeyboard();

  const [step, setStep] = useState("cards-list");
  const [cardDigits, setCardDigits] = useState("");
  const [amountDigits, setAmountDigits] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  const cardInputRef = useRef(null);
  const amountInputRef = useRef(null);

  const scrollToActiveInput = (inputElement) => {
    if (!inputElement) return;
    
    const scrollToInput = () => {
      const rect = inputElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      let keyboardHeight = 0;
      if (isKeyboardOpen) {
        keyboardHeight = Math.min(viewportHeight * 0.4, 300);
      }
      
      const availableHeight = viewportHeight - keyboardHeight;
      
      const inputCenter = rect.top + rect.height / 2;
      const targetPosition = availableHeight / 2;
      
      if (inputCenter !== targetPosition) {
        const scrollAmount = inputCenter - targetPosition + 50;
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    };
    
    scrollToInput();
    
    setTimeout(scrollToInput, 100);
    setTimeout(scrollToInput, 300);
    setTimeout(scrollToInput, 600);
  };

  useEffect(() => {
    const loadUserCards = async () => {
      const result = await getCards();
      if (result.success) {
        setUserCards(result.data);
      } else {
        console.error("Failed to load cards:", result.error);
      }
    };

    loadUserCards();
  }, [getCards]);

  useEffect(() => {
    if (isKeyboardOpen) {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        scrollToActiveInput(activeElement);
      }
    }
  }, [isKeyboardOpen]);

  const tabs = [
    { id: "home", label: language === "uz" ? "Asosiy" : "Главная" },
    { id: "invite", label: language === "uz" ? "Taklif qilish" : "Пригласить" },
    { id: "lottery", label: language === "uz" ? "Natijalar" : "Итоги" },
    { id: "profile", label: language === "uz" ? "Profil" : "Профиль" },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === "home") {
      navigate("/main");
    } else if (tabId === "invite") {
      navigate("/main?tab=invite");
    } else if (tabId === "lottery") {
      navigate("/main?tab=lottery");
    } else if (tabId === "profile") {
      navigate("/main?tab=profile");
    }
  };

  const t = {
    uz: {
      balance: "Mening balansim",
      myCards: "Mening kartalarim",
      addCard: "Karta qo'shish +",
      enterCardNumber: "Karta raqamini kiriting",
      addCardButton: "Kartani qo'shish",
      congratulations: "Tabriklaymiz!",
      cardAddedSuccess: "Kartangiz muvaffaqiyatli qo'shildi",
      next: "Davom etish",
      enterWithdrawAmount: "Kartaga chiqarish summasini kiriting",
      brandUzcard: "UZCARD",
      brandHumo: "HUMO",
      brandVisa: "VISA",
      brandMastercard: "MASTERCARD",
      currency: "so'm",
      minWithdraw: `Minimal chiqarish ${MIN_WITHDRAW.toLocaleString(
        "ru-RU"
      )} so'm`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      notEnoughBalance: "Sizning balansingizda yetarli mablag' mavjud emas",
      withdraw: "Chiqarish",
      loading: "Yuklanmoqda...",
      error: "Xatolik yuz berdi",
      invalidCard: "Noto'g'ri karta raqami",
      cardExists: "Bu karta allaqachon qo'shilgan",
      onlyUzcardHumo: "Faqat UZCARD va HUMO kartalarini qo'shish mumkin",
      back: "Orqaga",
      username: "To'liq ism",
    },
    ru: {
      balance: "Мой баланс",
      myCards: "Мои карты",
      addCard: "Добавить карту +",
      enterCardNumber: "Введите номер карты",
      addCardButton: "Добавить карту",
      congratulations: "Поздравляем!",
      cardAddedSuccess: "Ваша карта успешно добавлена",
      next: "Далее",
      enterWithdrawAmount: "Введите сумму вывода на карту",
      brandUzcard: "UZCARD",
      brandHumo: "HUMO",
      brandVisa: "VISA",
      brandMastercard: "MASTERCARD",
      currency: "сум",
      minWithdraw: `Минимальный вывод ${MIN_WITHDRAW.toLocaleString(
        "ru-RU"
      )} сум`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      notEnoughBalance: "У вас недостаточно средств на балансе для вывода",
      withdraw: "Вывести",
      processing: "Обработка...",
      paymentSuccess: "Платеж успешно выполнен!",
      paymentError: "Произошла ошибка при платеже",
      insufficientFunds: "Недостаточно средств на балансе",
      loading: "Загрузка...",
      error: "Произошла ошибка",
      invalidCard: "Неверный номер карты",
      cardExists: "Эта карта уже добавлена",
      onlyUzcardHumo: "Можно добавить только UZCARD и HUMO карты",
      back: "Назад",
      username: "Полное имя",
    },
  }[language];

  const bonus = Number(user?.balance || 0);

  const savedCards = useMemo(
    () => [
      {
        digits: "8600123412345678",
        holder: user?.full_name || "User",
        brand: "UZCARD",
        color: getCardColor("UZCARD"),
      },
      {
        digits: "9860123412345678",
        holder: user?.full_name || "User",
        brand: "HUMO",
        color: getCardColor("HUMO"),
      },
    ],
    [user?.full_name]
  );


  const validateCard = () => {
    if (!cardDigits || cardDigits.length === 0) return false;
    
    if (cardDigits.length < 16) return false;
    
    const brand = detectBrand(cardDigits);
    if (brand === "UZCARD" || brand === "HUMO") {
      return cardDigits.length >= 16 && cardDigits.length <= 16;
    }
    
    return isValidCardNumber(cardDigits);
  };

  const validateCardType = () => {
    const brand = detectBrand(cardDigits);
    return brand === "UZCARD" || brand === "HUMO";
  };
  const amountNum = Number(amountDigits || 0);
  const validateAmount = () => amountNum >= MIN_WITHDRAW && amountNum <= bonus;

  const handleNewCard = () => {
    setSelectedCard(null);
    setCardDigits("");
    setErrorText("");
    setShowAddCardForm(true);
    setTimeout(() => cardInputRef.current?.focus(), 0);
  };

  const handleBack = () => {
    setShowAddCardForm(false);
    setCardDigits("");
    setErrorText("");
  };

  const onCardChange = (e) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitPos = countDigitsBefore(raw, caret);
    const newDigits = digitsOnly(raw).slice(0, 16);

    setCardDigits(newDigits);
    
    const brand = detectBrand(newDigits);
    if (brand !== "UZCARD" && brand !== "HUMO") {
      setErrorText(t.onlyUzcardHumo);
    } else {
      setErrorText("");
    }
    
    requestAnimationFrame(() => {
      const display = group4(newDigits);
      const newCaret = caretFromDigitIndex(display, digitPos);
      if (cardInputRef.current) {
        cardInputRef.current.focus();
        try {
          cardInputRef.current.setSelectionRange(newCaret, newCaret);
        } catch {}
      }
    });
  };

  const onAmountChange = (e) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitPos = countDigitsBefore(raw, caret);
    const newDigits = digitsOnly(raw).slice(0, 9);

    setAmountDigits(newDigits);
    requestAnimationFrame(() => {
      const display = formatMoneyStr(newDigits);
      const newCaret = caretFromDigitIndex(display, digitPos);
      if (amountInputRef.current) {
        amountInputRef.current.focus();
        try {
          amountInputRef.current.setSelectionRange(newCaret, newCaret);
        } catch {}
      }
    });
    setErrorText("");
  };

  const handleContinue = async () => {

    if (!validateCard()) {
      setErrorText(t.invalidCard);
      return;
    }

    if (!validateCardType()) {
      setErrorText(t.onlyUzcardHumo);
      return;
    }

    const existingCard = userCards.find(
      (card) =>
        card.card_number &&
        card.card_number.replace(/\s/g, "") === cardDigits.replace(/\s/g, "")
    );

    if (existingCard) {
      setErrorText(t.cardExists);
      return;
    }

    try {
      const result = await addCard(cardDigits);
      if (result.success) {
        const brand = detectBrand(cardDigits);
        const newCard = {
          id: result.data.id,
          digits: result.data.card_number_masked || result.data.card_number,
          holder: result.data.holder_name || user?.full_name || user?.name || "User",
          brand: brand,
          color: getCardColor(brand),
          card_type: result.data.card_type,
        };
        setSelectedCard(newCard);
        setStep("success");
        setIsSuccessModalOpen(true);
        setShowAddCardForm(false);

        const cardsResult = await getCards();
        if (cardsResult.success) {
          setUserCards(cardsResult.data);
        }
      } else {
        if (result.error && result.error.includes("already been added")) {
          setErrorText(t.cardExists);
        } else {
          setErrorText(result.error || t.error);
        }
      }
    } catch (error) {
      console.error("Error adding card:", error);
      setErrorText(t.error);
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setCardDigits(card.digits);
    setStep("enter-amount");
    setErrorText("");
  };

  const handlePayment = async () => {
    if (!validateAmount()) {
      return;
    }

    if (!selectedCard) {
      setPaymentError("Пожалуйста, выберите карту для вывода");
      return;
    }

    setIsPaymentProcessing(true);
    setPaymentError("");

    try {
      const paymentData = {
        card_id: selectedCard?.id,
        amount: Number(amountDigits),
      };

      const result = await createPayment(paymentData);

      if (result.success) {
        alert(t.paymentSuccess);
        alert(t.paymentSuccess);
        await refreshUserProfile();
        setStep("cards-list");
      } else {
        setPaymentError(result.error || t.paymentError);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(t.paymentError);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const BalanceCard = () => (
    <div className="w-full rounded-2xl p-5 text-white bg-gradient-to-r from-[#5E5AF6] to-[#8888FC] shadow-[0_20px_40px_rgba(94,90,246,0.35)] relative">
      <div className="flex items-center justify-start gap-4">
        <div className="flex items-center justify-between">
          <div className="w-18 h-18 rounded-full bg-white/15 flex items-center justify-center relative">
            <UserAvatar
              avatarUrl={user?.avatar_url}
              size="w-full h-full"
              className="bg-white/15"
              showBorder={false}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-0">
          <p className="text-white/90 text-md font-semibold">{t.balance}:</p>
          <p className="text-2xl font-bold">
            {bonus} {t.currency}
          </p>
        </div>
      </div>
    </div>
  );

  const BrandBadge = ({ brand }) => {

    if (!brand)
      return (
        <div className="px-2 py-1 rounded-md bg-white/15 border border-white/30">
          <span className="text-[10px] text-white/80">CARD</span>
        </div>
      );

    const cardIcon = getCardIcon(brand);

    return (
      <div className="px-2 py-1 rounded-md bg-white/15 border border-white/30">
        {cardIcon ? (
          <img src={cardIcon} alt={brand} className="h-4 w-auto" />
        ) : (
          <span className="text-[10px] text-white/80">{brand}</span>
        )}
      </div>
    );
  };

  const PrettyCard = ({
    digits,
    holder,
    brand,
    color = "from-[#5538F9] to-[#7C65FF]",
    active = false,
    onClick,
    showMask = false,
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left ${active ? "scale-[1.01]" : ""} transition`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl p-5 text-white ${
          brand ? "bg-gradient-to-br" : "bg-gradient-to-r"
        } ${color} shadow-[0_20px_40px_rgba(2,6,23,0.2)]`}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="flex items-center justify-between">
          <BrandBadge brand={brand} />
        </div>
        <p className="card-number text-xl mt-6">
          {renderCardNumber(digits, showMask)}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-white/90">{holder}</span>
        </div>
      </div>
    </button>
  );


  const renderSuccess = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#5538F9] to-[#7C65FF] allow-scroll custom-scrollbar">
      <WaveOverlay />
      <img src={ProSVG} alt="success" className="w-2/3 mb-20 z-999" />
    </div>
  );

  const renderCardsList = () => {
    const brand = detectBrand(cardDigits);
    const cardColor = getCardColor(brand);
    const cardIcon = getCardIcon(brand);
    const shouldShowAddForm = userCards.length === 0 || showAddCardForm;

    return (
      <div className={`space-y-6 transition-all duration-300 custom-scrollbar ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        <BalanceCard />

        <div>
          {!shouldShowAddForm && (
            <h4 className="text-sm font-semibold text-gray-500 mb-4">
              {t.myCards}
            </h4>
          )}

          {loading && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_20px_40px_rgba(2,6,23,0.2)] animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-5 shadow-[0_20px_40px_rgba(2,6,23,0.2)] animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">
                {t.error}: {error}
              </p>
            </div>
          )}

          {!loading && !error && shouldShowAddForm && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-500">
                {t.enterCardNumber}
              </h4>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center h-10 px-3 rounded-xl bg-gray-50 border border-gray-200">
                    {brand ? (
                      <img src={cardIcon} alt={brand} className="h-6 w-auto" />
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        Card
                      </span>
                    )}
                  </div>
                  <input
                    ref={cardInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={group4(cardDigits)}
                    onChange={onCardChange}
                    onFocus={(e) => scrollToActiveInput(e.target)}
                    placeholder="0123 4567 8901 2345"
                    className={`flex-1 rounded-xl border-2 border-transparent bg-gray-50 px-3 text-lg font-medium text-gray-900
                               focus:outline-none focus:border-blue-500 focus:bg-white transition-all ${isKeyboardOpen ? 'h-10' : 'h-12'}`}
                    maxLength={19}
                    autoComplete="off"
                  />
                </div>
                {user?.full_name && (
                <div className="text-lg mt-2 font-medium text-gray-900">
                  {user.full_name}
                </div>
              )}
              </div>
              {cardDigits.length > 0 && (
                <PrettyCard
                  digits={cardDigits.padEnd(16, "•")}
                  holder={user?.full_name || "User"}
                  brand={brand}
                  color={cardColor}
                  onClick={() => {}}
                />
              )}

              {errorText && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{errorText}</p>
                </div>
              )}

              <div className="sticky bottom-0 left-0 right-0 pt-2">
                <button
                  onClick={handleContinue}
                  disabled={!validateCard() || !validateCardType()}
                  className={`w-full rounded-xl font-medium transition
                    ${
                      validateCard() && validateCardType()
                        ? "bg-[#5E5AF6] text-white hover:bg-[#4A46E8] active:scale-[0.99]"
                        : "bg-[#8888FC] text-white/80 cursor-not-allowed"
                    } ${isKeyboardOpen ? 'h-10' : 'h-12'}
                  `}
                >
                  {t.addCardButton}
                </button>
              </div>
            </div>
          )}

          {!loading && !error && userCards.length > 0 && !shouldShowAddForm && (
            <div className="space-y-4">
              {userCards.map((card) => {
                const cardBrand =
                  card.card_type?.toUpperCase() ||
                  detectBrand(
                    card.card_number_masked || card.card_number
                  )?.toUpperCase();

                return (
                  <PrettyCard
                    key={card.id}
                    digits={card.card_number_masked || card.card_number}
                    holder={card.holder_name || user?.full_name || user?.name || "User"}
                    brand={cardBrand}
                    color={getCardColor(cardBrand)}
                    onClick={() =>
                      handleCardSelect({
                        id: card.id,
                        digits: card.card_number_masked || card.card_number,
                        holder: card.holder_name || user?.full_name || user?.name || "User",
                        brand: cardBrand,
                        color: getCardColor(cardBrand),
                      })
                    }
                    showMask={true}
                  />
                );
              })}

              {selectedCard &&
                !userCards.find((card) => card.id === selectedCard.id) && (
                  <PrettyCard
                    digits={selectedCard.digits}
                    holder={selectedCard.holder}
                    brand={selectedCard.brand}
                    color={selectedCard.color}
                    onClick={() => handleCardSelect(selectedCard)}
                    showMask={true}
                  />
                )}

              <button
                onClick={handleNewCard}
                className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#5E5AF6] hover:text-[#5E5AF6] transition-colors"
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium">{t.addCard}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEnterAmount = () => {
    const brand = detectBrand(cardDigits);
    const color = getCardColor(brand);
    const amountNum = Number(amountDigits || 0);

    return (
      <div className={`space-y-6 transition-all duration-300 custom-scrollbar ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        <BalanceCard />

        <h4 className="text-sm font-semibold text-gray-500">
          {t.enterWithdrawAmount}
        </h4>

        <PrettyCard
          digits={selectedCard?.digits || cardDigits}
          holder={selectedCard?.holder || user?.full_name || "User"}
          brand={brand}
          color={color}
          onClick={() => {}}
          showMask={true}
        />

        <div className="flex justify-center">
          <button 
            onClick={() => setStep("cards-list")}
            className="w-12 h-12 rounded-full bg-[#5E5AF6] grid place-items-center hover:bg-[#4A46E8] active:scale-95 transition-all duration-200"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M7 14l5-5 5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
          {amountNum > bonus && (
            <p className="text-sm text-red-600 mb-4 font-medium">
              {t.notEnoughBalance}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                ref={amountInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formatMoneyStr(amountDigits)}
                onChange={onAmountChange}
                onFocus={(e) => scrollToActiveInput(e.target)}
                placeholder="20 000"
                className={`w-full rounded-xl border-2 px-3 text-lg font-semibold text-gray-900
                           focus:outline-none focus:border-blue-500 focus:bg-white transition-all
                           ${
                             amountNum > bonus
                               ? "border-red-300 bg-red-50"
                               : "border-transparent bg-gray-50"
                           } ${isKeyboardOpen ? 'h-10' : 'h-12'}`}
              />
            </div>
            <span className="text-gray-600 font-medium text-lg">
              {t.currency}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[20000, 30000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setAmountDigits(String(amount))}
                className={`rounded-xl text-sm font-medium transition ${
                  amountNum === amount
                    ? "bg-[#5E5AF6] text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } ${isKeyboardOpen ? 'h-8' : 'h-10'}`}
              >
                {formatMoneyStr(amount)}
              </button>
            ))}
            <button
              onClick={() => setAmountDigits(String(bonus))}
              className={`rounded-xl text-sm font-medium transition ${
                amountNum === bonus
                  ? "bg-[#5E5AF6] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } ${isKeyboardOpen ? 'h-8' : 'h-10'}`}
            >
              Вся сумма
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500">{t.minWithdraw}</p>
        </div>

        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{paymentError}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={!validateAmount() || isPaymentProcessing}
          className={`w-full rounded-xl font-medium transition ${
            validateAmount() && !isPaymentProcessing
              ? "bg-[#5E5AF6] text-white hover:bg-[#4A46E8] active:scale-[0.99]"
              : "bg-[#8888FC] text-white/80 cursor-not-allowed"
          } ${isKeyboardOpen ? 'h-10' : 'h-12'}`}
        >
          {isPaymentProcessing
            ? t.processing
            : `${t.withdraw} ${
                amountDigits ? formatMoneyStr(amountDigits) : ""
              } ${t.currency}`}
        </button>
      </div>
    );
  };

  if (step === "success") {
    return (
      <>
        {renderSuccess()}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          t={t}
          onContinue={() => {
            setStep("cards-list");
            setCardDigits("");
            setErrorText("");
            setShowAddCardForm(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 allow-scroll custom-scrollbar">
      <Header />
      <div className={`px-6 pt-8 transition-all duration-300 custom-scrollbar ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        {step === "cards-list" && renderCardsList()}
        {step === "enter-amount" && renderEnterAmount()}
      </div>
      <BottomNav tabs={tabs} activeTab="home" onChange={handleTabChange} />
    </div>
  );
};

export default WithdrawScreen;
