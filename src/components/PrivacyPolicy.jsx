import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();

  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const contentRef = useRef(null);

  // Авто-отметка чекбокса при прокрутке до конца
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 4; // небольшой допуск
      if (atBottom) {
        setHasScrolledToEnd(true);
        setHasAccepted(true); // авто-акцепт при полном прочтении
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleAccept = () => {
    if (hasAccepted) navigate('/main');
  };

  const handleBrowse = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const privacyText = {
    uz: {
      title: 'Maxfiylik siyosati',
      content: `OMMAVIY OFERTA

Ushbu ommaviy oferta (keyingi o'rinlarda - "Oferta") ProSurvey xizmatidan foydalanish shartlarini belgilaydi.

1. UMUMIY QOIDALAR
1.1. Ushbu Oferta Oʻzbekiston Respublikasi Fuqarolik kodeksiga muvofiq ommaviy oferta hisoblanadi.
1.2. Ofermani aksept qilish Xizmatdan foydalanish bo'yicha harakatlarni amalga oshirish hisoblanadi.

2. OFERTA PREDMETI
2.1. Ushbu Ofermaning predmeti Foydalanuvchiga so'rovlarda qatnashish va mukofotlar olish uchun Xizmatdan foydalanish huquqini taqdim etishdir.

3. TOMONLARNING HUQUQ VA MAJBURIYATLARI
3.1. Foydalanuvchi quyidagi huquqlarga ega:
- So'rovlarda qatnashish
- Ishtirok uchun mukofot olish
- Xizmatning barcha funksiyalaridan foydalanish

3.2. Foydalanuvchi quyidagilarga majbur:
- Ishonchli ma'lumotlarni taqdim etish
- Xizmatdan foydalanish qoidalariga rioya qilish
- Boshqa foydalanuvchilarning huquqlarini buzmaslik

4. MAXFIYLIK
4.1. Biz foydalanuvchilarning shaxsiy ma'lumotlarini qonunchilikka muvofiq himoya qilishga majburmiz.
4.2. Shaxsiy ma'lumotlar faqatgina xizmatlarni taqdim etish uchun ishlatiladi.

5. YAKUNIY QOIDALAR
5.1. Oferta aksept qilingan paytdan boshlab kuchga kiradi.
5.2. Barcha savollar yuzasidan qo'llab-quvvatlash xizmatiga murojaat qiling.`,
      accept: 'Shartlarga roziman',
      browse: 'Prolist qilish',
      confirm: 'Tasdiqlash',
      back: 'Orqaga',
      langAria: 'Tilni tanlash',
      readHint: 'Davom etish uchun matnni oxirigacha o‘qing'
    },
    ru: {
      title: 'Политика конфиденциальности',
      content: `ПУБЛИЧНАЯ ОФЕРТА

Настоящая публичная оферта (далее - "Оферта") определяет условия использования сервиса ProSurvey.

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Настоящая Оферта является публичной офертой в соответствии со статьёй 437 Гражданского кодекса Российской Федерации.
1.2. Акцептом Оферты является совершение действий по использованию Сервиса.

2. ПРЕДМЕТ ОФЕРТЫ
2.1. Предметом настоящей Оферты является предоставление Пользователю доступа к Сервису для участия в опросах и получения вознаграждений.

3. ПРАВА И ОБЯЗАННОСТИ СТОРОН
3.1. Пользователь имеет право:
- Участвовать в опросах
- Получать вознаграждения за участие
- Использовать все функции Сервиса

3.2. Пользователь обязуется:
- Предоставлять достоверную информацию
- Соблюдать правила использования Сервиса
- Не нарушать права других пользователей

4. КОНФИДЕНЦИАЛЬНОСТЬ
4.1. Мы обязуемся защищать персональные данные Пользователей в соответствии с законодательством.
4.2. Персональные данные используются исключительно для предоставления услуг.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
5.1. Оферта вступает в силу с момента акцепта.
5.2. По всем вопросам обращайтесь в службу поддержки.`,
      accept: 'Принимаю условия',
      browse: 'Пролистать',
      confirm: 'Подтвердить',
      back: 'Назад',
      langAria: 'Выбор языка',
      readHint: 'Дочитайте текст до конца, чтобы продолжить'
    }
  };

  const currentText = privacyText[language];

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
          <span className="text-sm font-medium">{currentText.back}</span>
        </button>
      </div>

      <button
        onClick={openLanguageModal}
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-emerald-600 text-white text-lg grid place-items-center shadow-lg active:scale-95 transition"
        aria-label={currentText.langAria}
        title={currentText.langAria}
      >
        {language === 'uz' ? '🇺🇿' : '🇷🇺'}
      </button>

      {/* Контент */}
      <div className="flex flex-col min-h-screen px-6 pt-20 pb-6">
        {/* Заголовок */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600">
            {currentText.title}
          </h1>
        </div>

        {/* Текст политики — основная прокручиваемая область */}
        <div
          ref={contentRef}
          className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-[0_6px_20px_rgba(2,6,23,0.06)] overflow-y-auto"
        >
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {currentText.content}
            </p>
          </div>

          {!hasScrolledToEnd && (
            <div className="mt-4 text-xs text-gray-500 text-center select-none">
              {currentText.readHint}
            </div>
          )}
        </div>

        {/* Чекбокс */}
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAccepted}
              onChange={(e) => setHasAccepted(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {currentText.accept}
            </span>
          </label>
        </div>

        {/* Кнопки снизу */}
        <div className="mt-4 flex gap-3">

          <button
            onClick={handleAccept}
            disabled={!hasAccepted}
            className={`flex-1 py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 ${
              hasAccepted
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentText.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
