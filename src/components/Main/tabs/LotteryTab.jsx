// tg-app/src/components/Main/tabs/LotteryTab.jsx
import { Play } from "lucide-react";
import React from "react";

const LotteryTab = ({ t }) => {
  return (
    <div className="min-h-screen">
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-2 py-2 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-md font-semibold text-gray-500 mb-6 text-left">
          {t.lottery}
        </h2>

        {/* Карточки розыгрышей */}
        <div className="space-y-6">
          {/* Карточка 1 */}
          <div className="bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">{t.lotThemeIntro}</h3>
            <p className="text-white/90 text-sm mb-2">
              {t.lotDate}: 12.08.2025
            </p>
            <p className="text-white/90 text-sm mb-4">
              {t.lotSum}: 3 000 000 {t.sum}
            </p>

            {/* Белое поле для будущего видео */}
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium shadow-inner">
              <Play className="mx-auto mb-2 text-gray-300 w-12 h-12" />
              <p className="text-sm">{t.videoPlaceholder}</p>
            </div>
          </div>

          {/* Карточка 2 */}
          <div className="bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">{t.lotThemeShop}</h3>
            <p className="text-white/90 text-sm mb-2">
              {t.lotDate}: 10.08.2025
            </p>
            <p className="text-white/90 text-sm mb-4">
              {t.lotSum}: 2 000 000 {t.sum}
            </p>

            {/* Белое поле для будущего видео */}
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium shadow-inner">
              <Play className="mx-auto mb-2 text-gray-300 w-12 h-12" />
              <p className="text-sm">{t.videoPlaceholder}</p>
            </div>
          </div>

          {/* Дополнительные карточки для демонстрации скролла */}
          <div className="bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">Тема: Банки</h3>
            <p className="text-white/90 text-sm mb-2">
              Дата проведения: 08.08.2025
            </p>
            <p className="text-white/90 text-sm mb-4">
              Сумма розыгрыша: 1 500 000 {t.sum}
            </p>

            {/* Белое поле для будущего видео */}
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium shadow-inner">
              <Play className="mx-auto mb-2 text-gray-300 w-12 h-12" />
              <p className="text-sm">Здесь будет видео</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">Тема: Путешествия</h3>
            <p className="text-white/90 text-sm mb-2">
              Дата проведения: 05.08.2025
            </p>
            <p className="text-white/90 text-sm mb-4">
              Сумма розыгрыша: 2 500 000 {t.sum}
            </p>

            {/* Белое поле для будущего видео */}
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium shadow-inner">
              <Play className="mx-auto mb-2 text-gray-300 w-12 h-12" />
              <p className="text-sm">Здесь будет видео</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryTab;
