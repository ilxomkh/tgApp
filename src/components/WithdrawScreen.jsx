import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from './header';
import BottomNav from './Main/BottomNav';

// Import SVG icons
import UzcardIcon from '../assets/uzcard.svg';
import VisaIcon from '../assets/visa.svg';
import MastercardIcon from '../assets/mastercard.svg';
import HumoIcon from '../assets/humo.svg';
import { EarthIcon } from './Main/icons';
import WaveOverlay from './WaveOverlay';
import ProSVG from '../assets/Pro.svg';

const MIN_WITHDRAW = 20000;

// ---------- Utils ----------
const digitsOnly = (v) => (v || '').replace(/\D/g, '');
const formatMoneyStr = (digits) =>
  String(Number(digits || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const detectBrand = (digits) => {
  if (digits.startsWith('5614') || digits.startsWith('8600')) return 'UZCARD';
  if (digits.startsWith('4')) return 'VISA';
  if (digits.startsWith('5')) return 'MASTERCARD';
  if (digits.startsWith('9860')) return 'HUMO';
  return null;
};

const getCardColor = (brand) => {
  switch (brand) {
    case 'UZCARD': return 'from-emerald-500 to-teal-600';
    case 'HUMO': return 'from-indigo-500 to-blue-600';
    case 'VISA': return 'from-purple-500 to-purple-600';
    case 'MASTERCARD': return 'from-orange-500 to-red-500';
    default: return 'from-[#5538F9] to-[#7C65FF]';
  }
};

const getCardIcon = (brand) => {
  switch (brand) {
    case 'UZCARD': return UzcardIcon;
    case 'HUMO': return HumoIcon;
    case 'VISA': return VisaIcon;
    case 'MASTERCARD': return MastercardIcon;
    default: return UzcardIcon;
  }
};

const maskCard = (digits) => {
  const d = digits.slice(0, 16);
  const start = d.slice(0, 4);
  const end = d.slice(-4);
  const mid = d.length > 8 ? '•'.repeat(d.length - 8) : '';
  return group4(`${start}${mid}${end}`);
};
const group4 = (v) => v.replace(/(.{4})/g, '$1 ').trim();

// caret helpers: сохраняем позицию каретки при форматировании
const countDigitsBefore = (str, caret) => (str.slice(0, caret).match(/\d/g) || []).length;
const caretFromDigitIndex = (formatted, digitIndex) => {
  if (digitIndex <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitIndex) return i + 1; // после этой цифры
    }
  }
  return formatted.length;
};

// ---------- Success Modal Component ----------
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
      onContinue(); // Вызываем функцию для перехода к списку карт
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-200 z-40 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeSoft}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mx-auto w-full">
          <div className="bg-white rounded-t-3xl p-8 text-center shadow-[0_8px_30px_rgba(2,6,23,0.06)]">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 border border-green-200 grid place-items-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-green-600">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.congratulations}</h2>
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

// ---------- Component ----------
const WithdrawScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState('select-card'); // select-card | enter-card | success | cards-list | enter-amount
  const [cardDigits, setCardDigits] = useState('');
  const [amountDigits, setAmountDigits] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const cardInputRef = useRef(null);
  const amountInputRef = useRef(null);

  // BottomNav props
  const tabs = [
    { id: 'home', label: language === 'uz' ? 'Asosiy' : 'Главная' },
    { id: 'invite', label: language === 'uz' ? 'Taklif qilish' : 'Пригласить' },
    { id: 'lottery', label: language === 'uz' ? 'Natijalar' : 'Итоги' },
    { id: 'profile', label: language === 'uz' ? 'Profil' : 'Профиль' }
  ];

  const handleTabChange = (tabId) => {
    if (tabId === 'home') {
      navigate('/main');
    } else if (tabId === 'profile') {
      navigate('/main?tab=profile');
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
      minWithdraw: `Minimal chiqarish ${MIN_WITHDRAW.toLocaleString('ru-RU')} so'm`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      notEnoughBalance: "Sizning balansingizda yetarli mablag' mavjud emas",
      withdraw: "Chiqarish"
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
      minWithdraw: `Минимальный вывод ${MIN_WITHDRAW.toLocaleString('ru-RU')} сум`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      notEnoughBalance: "У вас недостаточно средств на балансе для вывода",
      withdraw: "Вывести"
    }
  }[language];

  const bonus = Number(user?.bonusBalance || 0);

  const savedCards = useMemo(() => ([
    {
      digits: '8600123412345678',
      holder: user?.name || 'Ergashev Ahmad',
      brand: 'UZCARD',
      color: getCardColor('UZCARD')
    },
    {
      digits: '9860123412345678',
      holder: user?.name || 'Ergashev Ahmad',
      brand: 'HUMO',
      color: getCardColor('HUMO')
    }
  ]), [user?.name]);

  // ---- Validation ----
  const validateCard = () => cardDigits.length === 16;
  const amountNum = Number(amountDigits || 0);
  const validateAmount = () => amountNum >= MIN_WITHDRAW && amountNum <= bonus;

  // ---- Handlers ----
  const handleNewCard = () => {
    setSelectedCard(null);
    setCardDigits('');
    setStep('enter-card');
    setErrorText('');
    setTimeout(() => cardInputRef.current?.focus(), 0);
  };

  const onCardChange = (e) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitPos = countDigitsBefore(raw, caret);
    const newDigits = digitsOnly(raw).slice(0, 16);

    setCardDigits(newDigits);
    // Вернём каретку в «правильное» место после форматирования
    requestAnimationFrame(() => {
      const display = group4(newDigits);
      const newCaret = caretFromDigitIndex(display, digitPos);
      if (cardInputRef.current) {
        cardInputRef.current.focus();
        try { cardInputRef.current.setSelectionRange(newCaret, newCaret); } catch {}
      }
    });
    setErrorText('');
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
        try { amountInputRef.current.setSelectionRange(newCaret, newCaret); } catch {}
      }
    });
    setErrorText('');
  };

  const handleContinue = () => {
    if (step === 'enter-card') {
      if (!validateCard()) {
        setErrorText('Некорректный номер карты');
        return;
      }
      const brand = detectBrand(cardDigits);
      const newCard = {
        digits: cardDigits,
        holder: user?.name || 'Ergashev Ahmad',
        brand: brand,
        color: getCardColor(brand)
      };
      setSelectedCard(newCard);
      setStep('success');
      setIsSuccessModalOpen(true);
      return;
    }
    if (step === 'cards-list') {
      setStep('enter-amount');
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setCardDigits(card.digits);
    setStep('enter-amount');
    setErrorText('');
  };

  // ---- UI atoms ----
  const BalanceCard = () => (
    <div className="w-full rounded-2xl p-5 text-white bg-gradient-to-r from-[#5E5AF6] to-[#8888FC] shadow-[0_20px_40px_rgba(94,90,246,0.35)]">
      <div className='flex items-center justify-start gap-4'>
      <div className="flex items-center justify-between">
        <EarthIcon />
      </div>
      <div className="grid grid-cols-1 gap-0">
        <p className="text-white/90 text-xl">{t.balance}:</p>
        <p className="text-2xl font-bold">{bonus} {t.currency}</p>
      </div>
      </div>
    </div>
  );

  const BrandBadge = ({ brand }) => {
    if (!brand) return (
      <div className="px-2 py-1 rounded-md bg-white/15 border border-white/30">
        <span className="text-[10px] text-white/80">CARD</span>
      </div>
    );
    
    const cardIcon = getCardIcon(brand);
    
    return (
      <div className="px-2 py-1 rounded-md bg-white/15 border border-white/30">
        <img src={cardIcon} alt={brand} className="h-4 w-auto" />
      </div>
    );
  };

  const PrettyCard = ({ digits, holder, brand, color = 'from-[#5538F9] to-[#7C65FF]', active = false, onClick, showMask = false }) => (
    <button onClick={onClick} className={`w-full text-left ${active ? 'scale-[1.01]' : ''} transition`}>
      <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${brand ? 'bg-gradient-to-br' : 'bg-gradient-to-r'} ${color} shadow-[0_20px_40px_rgba(2,6,23,0.2)]`}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="flex items-center justify-between">

          <BrandBadge brand={brand} />
        </div>
        <p className="font-mono text-xl tracking-widest mt-6">
          {showMask ? maskCard(digits) : group4(digits)}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-white/90">{holder}</span>
          <span className="text-white/80">12/99</span>
        </div>
      </div>
    </button>
  );

  // ---- Step renderers ----
  const renderSelectCard = () => (
    <div className="min-h-[60vh] flex flex-col pb-24">
      <BalanceCard />

      <div className="flex-1 flex items-center justify-center">
        <button onClick={handleNewCard} className="w-full max-w-sm">
          <div className="rounded-2xl p-4 border-2 border-dashed border-gray-300 text-gray-600 transition">
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">{t.addCard}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderEnterCard = () => {
    const brand = detectBrand(cardDigits);
    const cardColor = getCardColor(brand);
    const cardIcon = getCardIcon(brand);
    
    return (
      <div className="space-y-6 pb-24">
        <BalanceCard />

        <h4 className="text-sm font-semibold text-gray-500">{t.enterCardNumber}</h4>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-10 px-3 rounded-xl bg-gray-50 border border-gray-200">
              {brand ? (
                <img src={cardIcon} alt={brand} className="h-6 w-auto" />
              ) : (
                <span className="text-sm font-medium text-gray-500">Card</span>
              )}
            </div>
            <input
              ref={cardInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={group4(cardDigits)}
              onChange={onCardChange}
              placeholder="0123 4567 8901 2345"
              className="flex-1 h-12 rounded-xl border-2 border-transparent bg-gray-50 px-3 text-lg font-medium text-gray-900
                         focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              maxLength={19}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Превью карты */}
        <PrettyCard
          digits={cardDigits.padEnd(16, '•')}
          holder={user?.name || 'Ergashev Ahmad'}
          brand={brand}
          color={cardColor}
          onClick={() => {}}
        />

        <div className="sticky bottom-0 left-0 right-0 pt-2">
          <button
            onClick={handleContinue}
            disabled={!validateCard()}
            className={`w-full h-12 rounded-xl font-medium transition
              ${validateCard()
                ? 'bg-[#5E5AF6] text-white hover:bg-[#4A46E8] active:scale-[0.99]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            {t.addCardButton}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#5538F9] to-[#7C65FF]">
      <WaveOverlay />
        <img src={ProSVG} alt="success" className="w-2/3 mb-20 z-999" />
    </div>
  );

  const renderCardsList = () => (
    <div className="space-y-6 pb-24">
      <BalanceCard />

      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-4">{t.myCards}</h4>
        <div className="space-y-4">
          {/* Новая добавленная карта (если есть) */}
          {selectedCard && (
            <PrettyCard
              digits={selectedCard.digits}
              holder={selectedCard.holder}
              brand={selectedCard.brand}
              color={selectedCard.color}
              onClick={() => handleCardSelect(selectedCard)}
              showMask={true}
            />
          )}
          
          {/* Остальные карты для выбора */}
          {[1, 2, 3].map((i) => (
            <PrettyCard
              key={i}
              digits="8600123412345678"
              holder="Ergashev Ahmad"
              brand="UZCARD"
              color={getCardColor('UZCARD')}
              onClick={() => handleCardSelect({
                digits: '8600123412345678',
                holder: 'Ergashev Ahmad',
                brand: 'UZCARD',
                color: getCardColor('UZCARD')
              })}
              showMask={true}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnterAmount = () => {
    const brand = detectBrand(cardDigits);
    const color = getCardColor(brand);
    const amountNum = Number(amountDigits || 0);
    
    return (
      <div className="space-y-6 pb-24">
        <BalanceCard />

        <h4 className="text-sm font-semibold text-gray-500">{t.enterWithdrawAmount}</h4>

        {/* Выбранная карта */}
        <PrettyCard
          digits={cardDigits}
          holder={selectedCard?.holder || user?.name || 'Ergashev Ahmad'}
          brand={brand}
          color={color}
          onClick={() => {}}
        />

        {/* Большая фиолетовая стрелка вверх */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#5E5AF6] grid place-items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Поле ввода суммы */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
          {/* Сообщение об ошибке сверху */}
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
                placeholder="20 000"
                className={`w-full h-12 rounded-xl border-2 px-3 text-lg font-semibold text-gray-900
                           focus:outline-none focus:border-blue-500 focus:bg-white transition-all
                           ${amountNum > bonus ? 'border-red-300 bg-red-50' : 'border-transparent bg-gray-50'}`}
              />
            </div>
            <span className="text-gray-600 font-medium text-lg">{t.currency}</span>
          </div>

          {/* Кнопки быстрого выбора суммы */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[20000, 30000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setAmountDigits(String(amount))}
                className={`h-10 rounded-xl text-sm font-medium transition ${
                  amountNum === amount
                    ? 'bg-[#5E5AF6] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {formatMoneyStr(amount)}
              </button>
            ))}
            <button
              onClick={() => setAmountDigits(String(bonus))}
              className={`h-10 rounded-xl text-sm font-medium transition ${
                amountNum === bonus
                  ? 'bg-[#5E5AF6] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Вся сумма
            </button>
          </div>

          {/* Информация о минимальной сумме */}
          <p className="mt-3 text-sm text-gray-500">
            {t.minWithdraw}
          </p>
        </div>

        {/* Кнопка вывода */}
        <button
          onClick={() => {
            if (amountNum >= MIN_WITHDRAW && amountNum <= bonus) {
              // TODO: Здесь будет логика вывода средств
              console.log('Вывод средств:', amountNum, 'на карту:', maskCard(cardDigits));
            }
          }}
          disabled={!validateAmount()}
          className={`w-full h-12 rounded-xl font-medium transition ${
            validateAmount()
              ? 'bg-[#5E5AF6] text-white hover:bg-[#4A46E8] active:scale-[0.99]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t.withdraw} {amountDigits ? formatMoneyStr(amountDigits) : ''} {t.currency}
        </button>
      </div>
    );
  };

  // ---- Render ----
  if (step === 'success') {
    return (
      <>
        {renderSuccess()}
        <SuccessModal 
          isOpen={isSuccessModalOpen} 
          onClose={() => setIsSuccessModalOpen(false)} 
          t={t} 
          onContinue={() => setStep('cards-list')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Content */}
      <div className="px-6 pt-8 pb-10">
        {step === 'select-card' && renderSelectCard()}
        {step === 'enter-card' && renderEnterCard()}
        {step === 'cards-list' && renderCardsList()}
        {step === 'enter-amount' && renderEnterAmount()}
      </div>
      <BottomNav tabs={tabs} activeTab="home" onChange={handleTabChange} />
    </div>
  );
};

export default WithdrawScreen;
