import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";
import AdminNavigation from "./AdminNavigation";
import AdminHeader from "./AdminHeader";

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const VideoIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const GiftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);

const TextIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h7"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CustomDateTimePicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  );

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDisplayDate = () => {
    if (!value) return "Выберите дату";
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleApply = () => {
    const finalDate = new Date(selectedDate);
    finalDate.setHours(23);
    finalDate.setMinutes(59);
    finalDate.setSeconds(59);
    onChange(finalDate.toISOString().slice(0, 16));
    setIsOpen(false);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return (
      date &&
      selectedDate &&
      date.toDateString() === selectedDate.toDateString()
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <CalendarIcon className="w-5 h-5 text-blue-500" />
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-10 py-4 border-2 rounded-xl focus:ring-0 transition-all duration-300 text-sm font-medium text-left ${
          error
            ? "border-red-500"
            : "border-gray-100 focus:border-blue-500 bg-gray-50/50 focus:bg-white text-gray-900"
        } ${!value ? "text-gray-400" : "text-gray-900"}`}
      >
        {formatDisplayDate()}
      </button>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-full left-0">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-xs font-bold text-gray-900">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-semibold text-gray-500 py-0.5"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0.5 mb-3">
              {days.map((date, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={!date}
                  className={`
                    p-1.5 text-xs rounded transition-all duration-200
                    ${!date ? "invisible" : ""}
                    ${
                      isSelected(date)
                        ? "bg-gradient-to-br from-[#5538F9] to-[#7C65FF] text-white font-bold shadow-md scale-105"
                        : isToday(date)
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {date ? date.getDate() : ""}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white rounded hover:shadow-lg transition-all text-xs font-semibold"
              >
                Применить
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CustomToggle = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C65FF] focus:ring-offset-2
          ${
            checked
              ? "bg-gradient-to-r from-[#7C65FF] to-[#5538F9]"
              : "bg-gray-300"
          }
        `}
      >
        <div
          className={`
            absolute top-0.5 w-7 h-7 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out
            ${checked ? "translate-x-6" : "translate-x-0.5"}
          `}
        />
      </button>
      <label
        className="text-sm font-medium text-gray-700 cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
};

const AdminRaffles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title_ru: "",
    title_uz: "",
    prize_amount: "",
    video_url_ru: "",
    video_url_uz: "",
    is_active: true,
    end_date: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateTimeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      end_date: value,
    }));
  };

  const handleToggleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      is_active: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title_ru.trim()) {
      setError("Название (RU) обязательно для заполнения");
      return;
    }

    if (!formData.title_uz.trim()) {
      setError("Название (UZ) обязательно для заполнения");
      return;
    }

    if (!formData.prize_amount || formData.prize_amount <= 0) {
      setError("Сумма приза должна быть больше 0");
      return;
    }

    if (!formData.video_url_ru.trim() && !formData.video_url_uz.trim()) {
      setError("Ссылка на видео обязательна (хотя бы для одного языка)");
      return;
    }

    if (!formData.end_date) {
      setError("Дата проведения обязательна");
      return;
    }

    // Проверяем валидность URL для заполненных полей
    if (formData.video_url_ru.trim()) {
      try {
        new URL(formData.video_url_ru);
      } catch {
        setError("Неверный формат ссылки на видео (RU)");
        return;
      }
    }

    if (formData.video_url_uz.trim()) {
      try {
        new URL(formData.video_url_uz);
      } catch {
        setError("Неверный формат ссылки на видео (UZ)");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const raffleData = {
        title_ru: formData.title_ru,
        title_uz: formData.title_uz,
        prize_amount: parseInt(formData.prize_amount),
        video_url_ru: formData.video_url_ru || formData.video_url_uz, // Fallback логика
        video_url_uz: formData.video_url_uz || formData.video_url_ru, // Fallback логика
        is_active: formData.is_active,
        end_date: new Date(formData.end_date).toISOString(),
      };

      await adminApi.createRaffle(raffleData);

      setSuccess(true);
      setFormData({
        title_ru: "",
        title_uz: "",
        prize_amount: "",
        video_url_ru: "",
        video_url_uz: "",
        is_active: true,
        end_date: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Ошибка при создании розыгрыша");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Розыгрыши" subtitle="добавление видео" />

      <AdminNavigation />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C65FF]/3 via-transparent to-[#5538F9]/2"></div>

          <div className="relative px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5538F9] to-[#7C65FF] rounded-lg flex items-center justify-center">
                <GiftIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Создать новый розыгрыш
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Заполните все поля для создания розыгрыша
                </p>
              </div>
            </div>

            {success && (
              <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-semibold text-green-800">
                      Розыгрыш успешно создан!
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Новый розыгрыш добавлен в систему
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">⚠</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-semibold text-red-800">
                      Ошибка при создании розыгрыша
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                <div className="bg-white border-1 border-gray-200 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">RU</span>
                          </div>
                          <input
                            type="text"
                            id="title_ru"
                            name="title_ru"
                            value={formData.title_ru}
                            onChange={handleInputChange}
                            className="w-full pl-16 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#7C65FF] transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                            placeholder="Название розыгрыша на русском..."
                            required
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UZ</span>
                          </div>
                          <input
                            type="text"
                            id="title_uz"
                            name="title_uz"
                            value={formData.title_uz}
                            onChange={handleInputChange}
                            className="w-full pl-16 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#7C65FF] transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                            placeholder="Lotereya nomi o'zbekcha..."
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <GiftIcon className="h-5 w-5 text-green-500" />
                          </div>
                          <input
                            type="number"
                            id="prize_amount"
                            name="prize_amount"
                            value={formData.prize_amount}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full pl-12 pr-16 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-green-500 transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                            placeholder="10000"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-gray-600 text-sm font-bold bg-gray-100 px-2 py-1 rounded-lg">
                              сум
                            </span>
                          </div>
                        </div>

                        <div>
                          <CustomDateTimePicker
                            value={formData.end_date}
                            onChange={handleDateTimeChange}
                            error={error && !formData.end_date}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">RU</span>
                          <span className="text-sm font-medium text-gray-700">Ссылка на видео (русский)</span>
                        </div>
                        <div className="relative">
                          <input
                            type="url"
                            id="video_url_ru"
                            name="video_url_ru"
                            value={formData.video_url_ru}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                            placeholder="https://youtu.be/_RwD8PDZb7A?si=OeICMOWlQm9vRFgA"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UZ</span>
                          <span className="text-sm font-medium text-gray-700">Video havolasi (o'zbekcha)</span>
                        </div>
                        <div className="relative">
                          <input
                            type="url"
                            id="video_url_uz"
                            name="video_url_uz"
                            value={formData.video_url_uz}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                            placeholder="https://youtu.be/_RwD8PDZb7A?si=OeICMOWlQm9vRFgA"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                      {formData.video_url_ru && (
                        <div className="flex-1 bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">RU</span>
                            <span className="text-sm font-medium text-gray-700">Предпросмотр видео (русский)</span>
                          </div>
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {(() => {
                              const getYouTubeVideoId = (url) => {
                                const regExp =
                                  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                return match && match[2].length === 11
                                  ? match[2]
                                  : null;
                              };

                              const videoId = getYouTubeVideoId(formData.video_url_ru);

                              if (videoId) {
                                return (
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  ></iframe>
                                );
                              } else {
                                return (
                                  <div className="w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                      <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">
                                        Неверная ссылка на видео
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      {formData.video_url_uz && (
                        <div className="flex-1 bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UZ</span>
                            <span className="text-sm font-medium text-gray-700">Video ko'rish (o'zbekcha)</span>
                          </div>
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {(() => {
                              const getYouTubeVideoId = (url) => {
                                const regExp =
                                  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                return match && match[2].length === 11
                                  ? match[2]
                                  : null;
                              };

                              const videoId = getYouTubeVideoId(formData.video_url_uz);

                              if (videoId) {
                                return (
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  ></iframe>
                                );
                              } else {
                                return (
                                  <div className="w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                      <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">
                                        Noto'g'ri video havolasi
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    {!formData.video_url_ru && !formData.video_url_uz && (
                      <div className="bg-gray-50 rounded-xl p-8 text-center mt-4">
                        <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Введите ссылку на видео для предпросмотра
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-[#7C65FF]/5 via-[#5538F9]/5 to-[#7C65FF]/5 rounded-2xl border-2 border-[#7C65FF]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#7C65FF] to-[#5538F9] rounded-full"></div>
                      Статус розыгрыша
                    </h3>
                    <p className="text-xs text-gray-600 font-medium bg-white/60 px-3 py-1.5 rounded-lg">
                      {formData.is_active
                        ? "Розыгрыш будет активен сразу после создания"
                        : "Розыгрыш будет создан в неактивном состоянии"}
                    </p>
                  </div>
                  <CustomToggle
                    checked={formData.is_active}
                    onChange={handleToggleChange}
                    label="Активен"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-3 py-3 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">Создание розыгрыша...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <GiftIcon className="w-5 h-5" />
                      <span className="text-base">Создать розыгрыш</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRaffles;