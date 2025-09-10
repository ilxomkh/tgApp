// tg-app/src/components/Main/tabs/LotteryTab.jsx
import { Play } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { formatDate } from "../../../utils/validation";

const LotteryTab = ({ t }) => {
  const { getRaffles, loading, error } = useApi();
  const [raffles, setRaffles] = useState([]);

  // Загружаем лотереи при монтировании компонента
  useEffect(() => {
    const loadRaffles = async () => {
      const result = await getRaffles();
      if (result.success) {
        setRaffles(result.data);
      } else {
        console.error('Failed to load raffles:', result.error);
      }
    };

    loadRaffles();
  }, [getRaffles]);

  // Функция для форматирования даты
  const formatEndDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      return dateString;
    }
  };

  // Функция для форматирования суммы приза
  const formatPrizeAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-2 py-2 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-md font-semibold text-gray-500 mb-6 text-left">
          {t.lottery}
        </h2>

        {/* Индикатор загрузки */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E5AF6]"></div>
            <p className="text-gray-500 mt-2">{t.loadingLottery}</p>
          </div>
        )}

        {/* Ошибка загрузки */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{t.errorLoadingLottery}: {error}</p>
          </div>
        )}

        {/* Карточки розыгрышей */}
        <div className="space-y-6">
          {raffles.length === 0 && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t.noLotteriesFound}</p>
            </div>
          )}
          
          {raffles.map((raffle) => (
            <div 
              key={raffle.id} 
              className={`bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg ${
                !raffle.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{raffle.title}</h3>
                {!raffle.is_active && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {t.completed}
                  </span>
                )}
              </div>
              
              <p className="text-white/90 text-sm mb-2">
                {raffle.description}
              </p>
              
              <p className="text-white/90 text-sm mb-2">
                {t.lotDate}: {formatEndDate(raffle.end_date)}
              </p>
              
              <p className="text-white/90 text-sm mb-4">
                {t.lotSum}: {formatPrizeAmount(raffle.prize_amount)} {t.sum}
              </p>

              {/* Видео или плейсхолдер */}
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium shadow-inner">
                {raffle.video_url ? (
                  <div className="relative">
                    <video 
                      className="w-full rounded-lg"
                      controls
                      poster="/video-placeholder.jpg"
                    >
                      <source src={raffle.video_url} type="video/mp4" />
                      {t.browserNotSupportVideo}
                    </video>
                  </div>
                ) : (
                  <>
                    <Play className="mx-auto mb-2 text-gray-300 w-12 h-12" />
                    <p className="text-sm">{t.videoPlaceholder}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LotteryTab;
