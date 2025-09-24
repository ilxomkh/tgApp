import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import AdminNavigation from './AdminNavigation';
import AdminHeader from './AdminHeader';

// Custom Icons
const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VideoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const GiftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const TextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Custom DateTime Picker Component
const CustomDateTimePicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());
  const [viewMode, setViewMode] = useState('date'); // 'date' or 'time'

  const formatDateTime = (date) => {
    if (!date) return 'Выберите дату';
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(date.getFullYear());
    newDate.setMonth(date.getMonth());
    newDate.setDate(date.getDate());
    setTempDate(newDate);
    setViewMode('time');
  };

  const handleTimeChange = (type, value) => {
    const newDate = new Date(tempDate);
    if (type === 'hour') {
      newDate.setHours(parseInt(value));
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value));
    }
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    setSelectedDate(tempDate);
    onChange(tempDate.toISOString().slice(0, 16));
    setIsOpen(false);
    setViewMode('date');
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    setIsOpen(false);
    setViewMode('date');
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between text-sm ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent bg-gray-50 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {formatDateTime(selectedDate)}
          </span>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {viewMode === 'date' ? (
            <div className="p-3">
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth() - 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronDownIcon className="w-3 h-3 rotate-90 text-gray-600" />
                </button>
                
                <div className="text-sm font-semibold text-gray-900">
                  {monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}
                </div>
                
                <button
                  type="button"
                  onClick={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronDownIcon className="w-3 h-3 -rotate-90 text-gray-600" />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(tempDate).map((dayObj, index) => {
                  const isToday = dayObj.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(dayObj.date)}
                      className={`
                        p-1.5 text-xs rounded transition-all duration-150 hover:bg-gray-100
                        ${!dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                        ${isToday ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                        ${isSelected ? 'bg-[#7C65FF] text-white hover:bg-[#6B4FFF]' : ''}
                      `}
                    >
                      {dayObj.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="text-center text-sm font-medium text-gray-900 mb-3">
                Выберите время
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Часы</div>
                  <select
                    value={tempDate.getHours()}
                    onChange={(e) => handleTimeChange('hour', e.target.value)}
                    className="w-14 px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-lg text-gray-400 mt-3">:</div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Минуты</div>
                  <select
                    value={tempDate.getMinutes()}
                    onChange={(e) => handleTimeChange('minute', e.target.value)}
                    className="w-14 px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-600 mb-3">
                {formatDateTime(tempDate)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-3 bg-gray-50 border-t">
            {viewMode === 'time' && (
              <button
                type="button"
                onClick={() => setViewMode('date')}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Назад
              </button>
            )}
            
            <div className={`flex gap-2 ${viewMode === 'date' ? 'w-full justify-end' : ''}`}>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
              >
                Отмена
              </button>
              
              {viewMode === 'time' && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-3 py-1.5 bg-[#7C65FF] text-white text-xs rounded hover:bg-[#6B4FFF] transition-colors"
                >
                  Готово
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Toggle Component - iPhone Style
const CustomToggle = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C65FF] focus:ring-offset-2
          ${checked ? 'bg-gradient-to-r from-[#7C65FF] to-[#5538F9]' : 'bg-gray-300'}
        `}
      >
        <div
          className={`
            absolute top-0.5 w-7 h-7 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-0.5'}
          `}
        />
      </button>
      <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => onChange(!checked)}>
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
    title: '',
    prize_amount: '',
    video_url: '',
    is_active: true,
    end_date: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateTimeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      end_date: value
    }));
  };

  const handleToggleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      is_active: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      setError('Название обязательно для заполнения');
      return;
    }
    
    if (!formData.prize_amount || formData.prize_amount <= 0) {
      setError('Сумма приза должна быть больше 0');
      return;
    }
    
    if (!formData.video_url.trim()) {
      setError('Ссылка на видео обязательна');
      return;
    }
    
    if (!formData.end_date) {
      setError('Дата проведения обязательна');
      return;
    }

    // Проверка URL
    try {
      new URL(formData.video_url);
    } catch {
      setError('Неверный формат ссылки на видео');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const raffleData = {
        ...formData,
        prize_amount: parseInt(formData.prize_amount),
        end_date: new Date(formData.end_date).toISOString()
      };

      await adminApi.createRaffle(raffleData);
      
      setSuccess(true);
      setFormData({
        title: '',
        prize_amount: '',
        video_url: '',
        is_active: true,
        end_date: ''
      });
      
      // Скрыть сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error creating raffle:', err);
      setError(err.message || 'Ошибка при создании розыгрыша');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      {/* Header */}
      <AdminHeader 
        title="Розыгрыши"
        subtitle="добавление видео"
      />

      {/* Navigation */}
      <AdminNavigation />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5538F9] to-[#7C65FF] rounded-lg flex items-center justify-center">
                <GiftIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Создать новый розыгрыш</h1>
                <p className="text-xs text-gray-500 mt-1">Заполните все поля для создания розыгрыша</p>
              </div>
            </div>
            
            {/* Success Message */}
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

            {/* Error Message */}
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
                    <p className="text-xs text-red-600 mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Название розыгрыша *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TextIcon className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C65FF] transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="Например: Розыгрыш iPhone 15 Pro"
                    required
                  />
                </div>
              </div>


              <div className="grid md:grid-cols-2 gap-5">
                {/* Prize Amount */}
                <div className="group">
                  <label htmlFor="prize_amount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Сумма приза *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GiftIcon className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C65FF] transition-colors" />
                    </div>
                    <input
                      type="number"
                      id="prize_amount"
                      name="prize_amount"
                      value={formData.prize_amount}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                      placeholder="10000"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs font-medium">сум</span>
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Дата проведения *
                  </label>
                  <CustomDateTimePicker 
                    value={formData.end_date}
                    onChange={handleDateTimeChange}
                    error={error && !formData.end_date}
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="group">
                <label htmlFor="video_url" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ссылка на видео *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <VideoIcon className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C65FF] transition-colors" />
                  </div>
                  <input
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7C65FF] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="https://youtu.be/_RwD8PDZb7A?si=OeICMOWlQm9vRFgA"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <VideoIcon className="w-3 h-3" />
                  Поддерживаются ссылки YouTube, Vimeo и другие видео платформы
                </p>
              </div>

              {/* Active Status */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Статус розыгрыша</h3>
                    <p className="text-xs text-gray-600">
                      {formData.is_active ? 'Розыгрыш будет активен сразу после создания' : 'Розыгрыш будет создан в неактивном состоянии'}
                    </p>
                  </div>
                  <CustomToggle
                    checked={formData.is_active}
                    onChange={handleToggleChange}
                    label="Активен"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white font-semibold rounded-lg hover:from-[#4A2FE8] hover:to-[#6B4FFF] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm">Создание розыгрыша...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GiftIcon className="w-4 h-4" />
                      <span className="text-sm">Создать розыгрыш</span>
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