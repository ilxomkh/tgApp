import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const MIN_WITHDRAW = 20000;

// ---------- Utils ----------
const digitsOnly = (v) => (v || '').replace(/\D/g, '');
const formatMoneyStr = (digits) =>
  String(Number(digits || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const detectBrand = (digits) => {
  if (digits.startsWith('9860')) return 'HUMO';
  if (digits.startsWith('8600')) return 'UZCARD';
  return null;
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

// ---------- Component ----------
const WithdrawScreen = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState('select-card'); // select-card | enter-card | enter-amount | success | error
  const [cardDigits, setCardDigits] = useState('');
  const [amountDigits, setAmountDigits] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [errorText, setErrorText] = useState('');

  const cardInputRef = useRef(null);
  const amountInputRef = useRef(null);

  const t = {
    uz: {
      balance: "Sizning balansingiz",
      withdrawToCard: "Kartaga chiqarish",
      selectCard: "Chiqarish uchun kartani tanlang",
      savedCards: "Saqlangan kartalar",
      addNewCard: "Yangi karta qo'shish",
      enterCard: "Karta raqamini kiriting",
      enterAmount: "Chiqarish summasini kiriting",
      continue: "Davom etish",
      withdraw: "Chiqarish",
      success: "Muvaffaqiyatli!",
      error: "Xatolik",
      toMainMenu: "Asosiy menyuga",
      tryLater: "Keyinroq urinib ko'ring",
      minWithdraw: `Minimal chiqarish ${MIN_WITHDRAW.toLocaleString('ru-RU')} so'm`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      currency: "so'm",
      invalidCard: "Karta raqami noto'g'ri",
      amountTooLow: `Minimal summa ${MIN_WITHDRAW.toLocaleString('ru-RU')} so'm`,
      amountTooHigh: "Balansdan ko'p summa kiritildi",
      back: "Orqaga",
      changeLang: "Tilni tanlash",
      brandUzcard: "UZCARD",
      brandHumo: "HUMO",
      all: "Hammasi"
    },
    ru: {
      balance: "Ваш баланс",
      withdrawToCard: "Вывод на карту",
      selectCard: "Выберите карту для вывода",
      savedCards: "Сохранённые карты",
      addNewCard: "Добавить карту",
      enterCard: "Введите номер карты",
      enterAmount: "Введите сумму вывода",
      continue: "Продолжить",
      withdraw: "Вывести",
      success: "Успешно!",
      error: "Ошибка",
      toMainMenu: "На главное меню",
      tryLater: "Попробуйте позже",
      minWithdraw: `Минимальный вывод ${MIN_WITHDRAW.toLocaleString('ru-RU')} сум`,
      cardPlaceholder: "8600 0000 0000 0000",
      amountPlaceholder: "30 000",
      currency: "сум",
      invalidCard: "Некорректный номер карты",
      amountTooLow: `Минимальная сумма ${MIN_WITHDRAW.toLocaleString('ru-RU')} сум`,
      amountTooHigh: "Сумма больше доступного баланса",
      back: "Назад",
      changeLang: "Выбор языка",
      brandUzcard: "UZCARD",
      brandHumo: "HUMO",
      all: "Всё"
    }
  }[language];

  const bonus = Number(user?.bonusBalance || 0);

  const savedCards = useMemo(() => ([
    {
      digits: '8600123412345678',
      holder: user?.name || 'Ruslanbek Rakhmonov',
      brand: 'UZCARD',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      digits: '9860123412345678',
      holder: user?.name || 'Ruslanbek Rakhmonov',
      brand: 'HUMO',
      color: 'from-indigo-500 to-blue-600'
    }
  ]), [user?.name]);

  // ---- Validation ----
  const validateCard = () => cardDigits.length === 16;
  const amountNum = Number(amountDigits || 0);
  const validateAmount = () => amountNum >= MIN_WITHDRAW && amountNum <= bonus;

  // ---- Handlers ----
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setCardDigits(card.digits);
    setStep('enter-amount');
    setErrorText('');
  };

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

  const quickSetAmount = (val) => {
    const digits = val === 'max' ? String(bonus) : String(val);
    setAmountDigits(digits);
    requestAnimationFrame(() => {
      const display = formatMoneyStr(digits);
      const pos = display.length;
      amountInputRef.current?.focus();
      try { amountInputRef.current?.setSelectionRange(pos, pos); } catch {}
    });
  };

  const handleContinue = () => {
    if (step === 'enter-card') {
      if (!validateCard()) {
        setErrorText(t.invalidCard);
        return;
      }
      setSelectedCard({
        digits: cardDigits,
        holder: user?.name || 'Card Holder',
        brand: detectBrand(cardDigits) || undefined,
        color: detectBrand(cardDigits) === 'HUMO' ? 'from-indigo-500 to-blue-600' : 'from-emerald-500 to-teal-600'
      });
      setStep('enter-amount');
      return;
    }
    if (step === 'enter-amount') {
      if (!validateAmount()) {
        if (amountNum < MIN_WITHDRAW) setErrorText(t.amountTooLow);
        else if (amountNum > bonus) setErrorText(t.amountTooHigh);
        setStep('error');
        return;
      }
      // TODO: здесь вызвать API вывода
      setStep('success');
    }
  };

  // ---- UI atoms ----
  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="h-10 px-4 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 shadow-sm active:scale-95 transition flex items-center gap-2"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-sm font-medium">{t.back}</span>
    </button>
  );

  const BalanceCard = () => (
    <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_20px_40px_rgba(16,185,129,0.35)]">
      <p className="text-white/90">{t.balance}</p>
      <p className="text-3xl font-extrabold mt-1 tracking-tight">
        {formatMoneyStr(bonus)} {t.currency}
      </p>
    </div>
  );

  const BrandBadge = ({ brand }) => {
    if (!brand) return <span className="px-2 py-1 text-[11px] rounded-md bg-gray-100 text-gray-500 border border-gray-200">CARD</span>;
    const label = brand === 'UZCARD' ? t.brandUzcard : brand === 'HUMO' ? t.brandHumo : brand;
    return (
      <span className="px-2 py-1 text-[11px] rounded-md bg-white/15 border border-white/30">{label}</span>
    );
  };

  const PrettyCard = ({ digits, holder, brand, color = 'from-emerald-500 to-teal-600', active = false, onClick }) => (
    <button onClick={onClick} className={`w-full text-left ${active ? 'scale-[1.01]' : ''} transition`}>
      <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${color} shadow-[0_20px_40px_rgba(2,6,23,0.2)]`}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-12 rounded-md bg-white/20 border border-white/30 grid place-items-center">
            {/* chip */}
            <div className="h-3 w-8 rounded-sm bg-white/60" />
          </div>
          <BrandBadge brand={brand} />
        </div>
        <p className="font-mono text-xl tracking-widest mt-6">{maskCard(digits)}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-white/90">{holder}</span>
          <span className="text-white/80">12/27</span>
        </div>
      </div>
    </button>
  );

  // ---- Step renderers ----
  const renderSelectCard = () => (
    <div className="space-y-6">
      <BalanceCard />

      <div>
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{t.savedCards}</h4>
        {/* GRID вместо flex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedCards.map((c, i) => (
            <PrettyCard
              key={i}
              digits={c.digits}
              holder={c.holder}
              brand={c.brand}
              color={c.color}
              onClick={() => handleCardSelect(c)}
            />
          ))}
          {/* Добавить новую */}
          <button onClick={handleNewCard} className="w-full">
            <div className="rounded-2xl p-5 bg-white border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition h-full grid place-items-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 grid place-items-center mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">{t.addNewCard}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEnterCard = () => {
    const brand = detectBrand(cardDigits);
    return (
      <div className="space-y-6">
        <BalanceCard />

        <h4 className="text-lg font-semibold text-gray-800">{t.enterCard}</h4>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
          <label className="block text-xs text-gray-500 mb-2">{t.withdrawToCard}</label>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 px-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
              <BrandBadge brand={brand} />
            </span>
            <input
              ref={cardInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={group4(cardDigits)}
              onChange={onCardChange}
              placeholder={t.cardPlaceholder}
              className="flex-1 h-12 rounded-xl border-2 border-transparent bg-gray-50 px-3 text-lg font-medium text-gray-900
                         focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              maxLength={19}
              autoComplete="cc-number"
            />
          </div>
          {!!errorText && <p className="mt-2 text-sm text-red-600">{errorText}</p>}
        </div>

        {/* Превью карты */}
        <PrettyCard
          digits={cardDigits.padEnd(16, '•')}
          holder={user?.name || 'Card Holder'}
          brand={brand}
          color={brand === 'HUMO' ? 'from-indigo-500 to-blue-600' : 'from-emerald-500 to-teal-600'}
          onClick={() => {}}
        />

        <div className="sticky bottom-0 left-0 right-0 pt-2">
          <button
            onClick={handleContinue}
            disabled={!validateCard()}
            className={`w-full h-12 rounded-xl font-medium transition
              ${validateCard()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            {t.continue}
          </button>
        </div>
      </div>
    );
  };

  const renderEnterAmount = () => {
    const brand = detectBrand(cardDigits);
    const color = brand === 'HUMO' ? 'from-indigo-500 to-blue-600' : 'from-emerald-500 to-teal-600';
    return (
      <div className="space-y-6">
        <BalanceCard />

        {/* Выбранная карта */}
        <PrettyCard
          digits={cardDigits}
          holder={selectedCard?.holder || user?.name || 'Card Holder'}
          brand={brand}
          color={color}
          onClick={() => {}}
        />

        <h4 className="text-lg font-semibold text-gray-800">{t.enterAmount}</h4>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-4">
          <div className="flex items-center gap-2">
            <input
              ref={amountInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formatMoneyStr(amountDigits)}
              onChange={onAmountChange}
              placeholder={t.amountPlaceholder}
              className="flex-1 h-12 rounded-xl border-2 border-transparent bg-gray-50 px-3 text-lg font-semibold text-gray-900
                         focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <span className="text-gray-600 font-medium">{t.currency}</span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[20000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => quickSetAmount(v)}
                className="h-10 rounded-xl bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 active:scale-95 transition"
              >
                {formatMoneyStr(v)}
              </button>
            ))}
            <button
              onClick={() => quickSetAmount('max')}
              className="h-10 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition"
            >
              {t.all}
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500">{t.minWithdraw}</p>
          {!!errorText && <p className="mt-2 text-sm text-red-600">{errorText}</p>}
        </div>

        <div className="sticky bottom-0 left-0 right-0 pt-2">
          <button
            onClick={handleContinue}
            disabled={!validateAmount()}
            className={`w-full h-12 rounded-xl font-medium transition
              ${validateAmount()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            {t.withdraw}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-emerald-100 border border-emerald-200 grid place-items-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-emerald-600 mb-2">{t.success}</h2>
        <p className="text-gray-600">
          {formatMoneyStr(amountDigits)} {t.currency} → {maskCard(cardDigits)}
        </p>
        <button
          onClick={() => navigate('/main')}
          className="mt-6 w-full h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.99] transition"
        >
          {t.toMainMenu}
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-red-100 border border-red-200 grid place-items-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-red-600">
            <path d="M12 8v5M12 17h.01M5 19h14a2 2 0 0 0 1.73-3L13.73 5a2 2 0 0 0-3.46 0L3.27 16A2 2 0 0 0 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-red-600 mb-2">{t.error}</h2>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 max-w-sm mx-auto mb-4">
          <p className="text-gray-600">
            {errorText || (language === 'uz' ? "Balansingizda yetarli mablag' yo'q" : 'Недостаточно средств на балансе')}
          </p>
        </div>
        <button
          onClick={() => navigate('/main')}
          className="h-12 px-6 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:scale-95 transition"
        >
          {t.tryLater}
        </button>
      </div>
    </div>
  );

  // ---- Render ----
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl" />

      {/* Floating actions */}
      <div className="absolute top-4 left-4 z-20">
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
        className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-emerald-600 text-white text-lg grid place-items-center shadow-lg active:scale-95 transition"
        aria-label={t.changeLang}
        title={t.changeLang}
      >
        {language === 'uz' ? '🇺🇿' : '🇷🇺'}
      </button>

      {/* Content */}
      <div className="px-6 pt-20 pb-10">
        {/* Progress */}
        {['select-card','enter-card','enter-amount'].includes(step) && (
          <div className="mb-5">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{
                  width:
                    step === 'select-card' ? '33%' :
                    step === 'enter-card' ? '66%' :
                    '100%'
                }}
              />
            </div>
          </div>
        )}

        {step === 'select-card' && renderSelectCard()}
        {step === 'enter-card' && renderEnterCard()}
        {step === 'enter-amount' && renderEnterAmount()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
      </div>
    </div>
  );
};

export default WithdrawScreen;
