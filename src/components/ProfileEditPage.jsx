import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  isValidUzbekPhone, 
  isValidEmail, 
  isValidBirthDate, 
  isValidFullName,
  formatPhoneE164 
} from '../utils/validation';
import { getMessage } from '../constants/messages';
import Header from './header';
import BottomNav from './Main/BottomNav';
import { SettingsIcon, UserIcon } from './Main/icons';
import UserAvatar from './UserAvatar';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { BackpackIcon, ChevronLeft, ChevronLeftCircle, Navigation, StepBackIcon } from 'lucide-react';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { user, updateProfile, logout } = useAuth();
  const { isKeyboardOpen } = useKeyboard();
  
  const [formData, setFormData] = useState({
    phone_number: '',
    full_name: '',
    email: '',
    birth_date: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user) {
      // Конвертируем дату из YYYY-MM-DD в DD.MM.YYYY для отображения
      let displayDate = '';
      if (user.birth_date) {
        const [year, month, day] = user.birth_date.split('T')[0].split('-');
        displayDate = `${day}.${month}.${year}`;
      }

      setFormData({
        phone_number: user.phone_number || '',
        full_name: user.full_name || '',
        email: user.email || '',
        birth_date: displayDate
      });
    }
  }, [user]);

  const t = {
    ru: {
      title: 'Мой профиль:',
      name: 'Имя:',
      phone: 'Номер телефона:',
      birthDate: 'Дата рождения:',
      email: 'E-mail:',
      save: 'Сохранить',
      cancel: 'Отмена',
      loading: 'Сохранение...',
      phonePlaceholder: '+998 90 123 45 67',
      namePlaceholder: 'Иван Иванов',
      emailPlaceholder: 'user@example.com',
      datePlaceholder: '1990-01-01',
      home: 'Главная',
      invite: 'Пригласить',
      lottery: 'Итоги',
      profile: 'Профиль',
      // Сообщения об ошибках
      errors: {
        nameRequired: 'Имя должно содержать минимум 2 символа',
        nameInvalid: 'Имя содержит недопустимые символы',
        emailRequired: 'Email обязателен',
        emailInvalid: 'Введите корректный email адрес',
        birthDateRequired: 'Дата рождения обязательна',
        birthDateFormat: 'Введите дату в формате ДД.ММ.ГГГГ',
        birthDateDay: 'День должен быть от 1 до 31',
        birthDateMonth: 'Месяц должен быть от 1 до 12',
        birthDateYear: 'Год должен быть от 1950 до 2050',
        birthDateInvalidDay: 'В этом месяце нет такого дня',
        birthDateNotExist: 'Такой даты не существует',
        birthDateFuture: 'Дата рождения не может быть в будущем',
        updateFailed: 'Ошибка при сохранении профиля'
      }
    },
    uz: {
      title: 'Mening profilim:',
      name: 'Ism:',
      phone: 'Telefon raqami:',
      birthDate: 'Tug\'ilgan sana:',
      email: 'E-mail:',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      loading: 'Saqlanmoqda...',
      phonePlaceholder: '+998 90 123 45 67',
      namePlaceholder: 'Ivan Ivanov',
      emailPlaceholder: 'user@example.com',
      datePlaceholder: '1990-01-01',
      home: 'Asosiy',
      invite: 'Taklif qilish',
      lottery: 'Natijalar',
      profile: 'Profil',
      // Сообщения об ошибках
      errors: {
        nameRequired: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
        nameInvalid: 'Ismda ruxsat etilmagan belgilar mavjud',
        emailRequired: 'Email majburiy',
        emailInvalid: 'To\'g\'ri email manzilini kiriting',
        birthDateRequired: 'Tug\'ilgan sana majburiy',
        birthDateFormat: 'Sanani DD.MM.YYYY formatida kiriting',
        birthDateDay: 'Kun 1 dan 31 gacha bo\'lishi kerak',
        birthDateMonth: 'Oy 1 dan 12 gacha bo\'lishi kerak',
        birthDateYear: 'Yil 1950 dan 2050 gacha bo\'lishi kerak',
        birthDateInvalidDay: 'Bu oyda bunday kun yo\'q',
        birthDateNotExist: 'Bunday sana mavjud emas',
        birthDateFuture: 'Tug\'ilgan sana kelajakda bo\'lishi mumkin emas',
        updateFailed: 'Profilni saqlashda xatolik'
      }
    }
  }[language];

  const validateForm = () => {
    const newErrors = {};

    // Валидация имени (только если заполнено)
    if (formData.full_name && formData.full_name.trim().length > 0) {
      if (formData.full_name.trim().length < 2) {
        newErrors.full_name = t.errors.nameRequired;
      } else if (!isValidFullName(formData.full_name)) {
        newErrors.full_name = t.errors.nameInvalid;
      }
    }

    // Валидация email (только если заполнено)
    if (formData.email && formData.email.trim().length > 0) {
      if (!isValidEmail(formData.email)) {
        newErrors.email = t.errors.emailInvalid;
      }
    }

    // Валидация даты рождения (только если заполнено)
    if (formData.birth_date && formData.birth_date.trim().length > 0) {
      // Проверяем формат DD.MM.YYYY
      const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const match = formData.birth_date.match(dateRegex);
      
      if (!match) {
        newErrors.birth_date = t.errors.birthDateFormat;
      } else {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        
        // Проверяем базовые ограничения
        if (day < 1 || day > 31) {
          newErrors.birth_date = t.errors.birthDateDay;
        } else if (month < 1 || month > 12) {
          newErrors.birth_date = t.errors.birthDateMonth;
        } else if (year < 1950 || year > 2050) {
          newErrors.birth_date = t.errors.birthDateYear;
        } else {
          // Проверяем количество дней в месяце
          const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          
          // Проверяем високосный год для февраля
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          if (month === 2 && isLeapYear) {
            daysInMonth[1] = 29;
          }
          
          if (day > daysInMonth[month - 1]) {
            newErrors.birth_date = t.errors.birthDateInvalidDay;
          } else {
            // Проверяем реальность даты
            const date = new Date(year, month - 1, day);
            
            if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
              newErrors.birth_date = t.errors.birthDateNotExist;
            } else {
              // Проверяем, что дата не в будущем
              const today = new Date();
              if (date > today) {
                newErrors.birth_date = t.errors.birthDateFuture;
              }
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e) => {
    // Разрешаем только цифры, Backspace, Delete, Tab, Enter, стрелки
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];
    
    // Разрешаем все управляющие клавиши
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Разрешаем только цифры
    if (e.key >= '0' && e.key <= '9') {
      return;
    }
    
    e.preventDefault();
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Специальная обработка для поля даты рождения
    if (field === 'birth_date') {
      // Удаляем все нецифровые символы
      let cleanValue = value.replace(/[^\d]/g, '');
      
      // Ограничиваем общую длину до 8 цифр (DDMMYYYY)
      if (cleanValue.length > 8) {
        cleanValue = cleanValue.slice(0, 8);
      }
      
      // Разбиваем на части: день (2), месяц (2), год (4)
      let day = cleanValue.slice(0, 2);
      let month = cleanValue.slice(2, 4);
      let year = cleanValue.slice(4, 8);
      
      // Валидация дня (1-31) только если введено 2 цифры
      if (day.length === 2) {
        const dayNum = parseInt(day, 10);
        if (dayNum > 31) {
          day = '31';
        } else if (dayNum < 1) {
          day = '01';
        }
      }
      
      // Валидация месяца (1-12) только если введено 2 цифры
      if (month.length === 2) {
        const monthNum = parseInt(month, 10);
        if (monthNum > 12) {
          month = '12';
        } else if (monthNum < 1) {
          month = '01';
        }
      }
      
      // Валидация года (1950-2050) только если введено 4 цифры
      if (year.length === 4) {
        const yearNum = parseInt(year, 10);
        if (yearNum > 2050) {
          year = '2050';
        } else if (yearNum < 1950) {
          year = '1950';
        }
      }
      
      // Формируем отображаемое значение с визуальными разделителями
      let displayValue = '';
      if (day) {
        displayValue = day;
        if (month) {
          displayValue += '.' + month;
          if (year) {
            displayValue += '.' + year;
          }
        }
      }
      
      // Проверяем реальность даты при полном вводе
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        // Проверяем количество дней в месяце
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Проверяем високосный год для февраля
        const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
        if (monthNum === 2 && isLeapYear) {
          daysInMonth[1] = 29;
        }
        
        // Если день больше максимального для месяца, корректируем
        if (dayNum > daysInMonth[monthNum - 1]) {
          day = daysInMonth[monthNum - 1].toString().padStart(2, '0');
          displayValue = day + '.' + month + '.' + year;
        }
        
        // Проверяем, что дата не в будущем
        const date = new Date(yearNum, monthNum - 1, dayNum);
        const today = new Date();
        if (date > today) {
          // Устанавливаем сегодняшнюю дату
          const todayDay = today.getDate().toString().padStart(2, '0');
          const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
          const todayYear = today.getFullYear().toString();
          displayValue = `${todayDay}.${todayMonth}.${todayYear}`;
        }
        
        // Автоматически закрываем клавиатуру при полном заполнении поля
        setTimeout(() => {
          const activeElement = document.activeElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }
        }, 100);
      }
      
      processedValue = displayValue;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    setHasChanges(true);
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const saveProfile = async () => {
    // Проверяем валидацию только если есть ошибки
    if (!validateForm()) {
      return false;
    }

    // Проверяем, есть ли изменения для сохранения
    if (!hasChanges) {
      return true; // Нет изменений, считаем успешным
    }

    setIsLoading(true);
    
    try {
      // Конвертируем дату из DD.MM.YYYY в YYYY-MM-DD для API
      let formattedDate = '';
      if (formData.birth_date && formData.birth_date.trim().length > 0) {
        const [day, month, year] = formData.birth_date.split('.');
        if (day && month && year) {
          formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }

      const updateData = {
        phone_number: user.phone_number, // Оставляем номер телефона неизменным
        full_name: formData.full_name.trim() || null,
        email: formData.email.trim() || null,
        birth_date: formattedDate || null
      };

      const success = await updateProfile(updateData);
      
      if (success) {
        setHasChanges(false);
        return true;
      } else {
        setErrors({ general: t.errors.updateFailed });
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // 401 ошибка уже обрабатывается глобально в API сервисе
      setErrors({ general: t.errors.updateFailed });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProfile();
  };

  // Определяем активный таб на основе источника перехода
  const getActiveTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const result = tabParam === 'profile' ? 'profile' : 'home';
    return result;
  };

  const activeTab = getActiveTab();

  const handleBack = async () => {
    // Просто возвращаемся без принудительного сохранения
    if (activeTab === 'profile') {
      navigate('/main?tab=profile');
    } else {
      navigate('/main?tab=home');
    }
  };

  // Настраиваем кнопку "Назад" в Telegram Mini App
  useTelegramBackButton(handleBack, true);

  // Убираем автосохранение - пользователь может свободно уходить

  const tabs = [
    { id: 'home', label: t.home },
    { id: 'invite', label: t.invite },
    { id: 'lottery', label: t.lottery },
    { id: 'profile', label: t.profile }
  ];

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      <Header />
      
      {/* Отступ под нижнюю навигацию - адаптируется к клавиатуре */}
      <div className={`p-4 transition-all duration-300 ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        <div className="max-w-md mx-auto">
          {/* Карточка профиля с фиолетовым градиентом */}
          <div className={`bg-gradient-to-r from-[#5E5AF6] to-[#7C65FF] rounded-2xl text-white shadow-lg mb-6 transition-all duration-300 ${isKeyboardOpen ? 'mt-4 p-4' : 'mt-0 p-6'}`}>
            {/* Заголовок формы с иконками */}
            <div className={`flex relative gap-2 items-center transition-all duration-300 ${isKeyboardOpen ? 'mb-4' : 'mb-6'}`}>
              {/* Аватарка пользователя слева */}
              <div className="w-12 h-12 flex items-center justify-center">
                <UserAvatar 
                  avatarUrl={user?.avatar_url} 
                  size="w-full h-full"
                  className="bg-white/15"
                  showBorder={false}
                />
              </div>
              
              {/* Заголовок по центру */}
              <h1 className="text-md font-extralight text-white">
                {t.title}
              </h1>
              
              {/* Иконка настроек справа */}
              <div className="w-14 h-14 absolute -right-5 -top-5">
              <button
                onClick={handleBack}
                className="w-14 h-14 flex items-center justify-center"
              >
                <ChevronLeftCircle className="w-8 h-8" /> 
              </button>
              </div>
            </div>

            {/* Форма редактирования профиля */}
            <form onSubmit={handleSubmit} className={`space-y-4 transition-all duration-300 ${isKeyboardOpen ? 'space-y-3' : 'space-y-4'}`}>
              {/* Имя */}
              <div>
                <label className="block text-white/90 text-sm mb-2 font-medium">
                  {t.name}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full px-4 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all ${isKeyboardOpen ? 'py-2' : 'py-3'}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white/70"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {errors.full_name && (
                  <p className="text-red-200 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              {/* Номер телефона */}
              <div>
                <label className="block text-white/90 text-sm mb-2 font-medium">
                  {t.phone}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone_number}
                    disabled
                    className={`w-full px-4 bg-white/10 rounded-xl text-white/60 cursor-not-allowed ${isKeyboardOpen ? 'py-2' : 'py-3'}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white/40"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Дата рождения */}
              <div>
                <label className="block text-white/90 text-sm mb-2 font-medium">
                  {t.birthDate}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="03.12.2002"
                    inputMode="numeric"
                    pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
                    maxLength="10"
                    autoComplete="bday"
                    className={`w-full px-4 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all ${isKeyboardOpen ? 'py-2' : 'py-3'}`}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white/70"
                    >
                      <path
                        d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {errors.birth_date && (
                  <p className="text-red-200 text-sm mt-1">{errors.birth_date}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/90 text-sm mb-2 font-medium">
                  {t.email}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={`w-full px-4 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all ${isKeyboardOpen ? 'py-2' : 'py-3'}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white/70"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-200 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Общая ошибка */}
              {errors.general && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-3">
                  <p className="text-red-200 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Кнопка сохранения */}
              {hasChanges && (
                <div className={`transition-all duration-300 ${isKeyboardOpen ? 'pt-2' : 'pt-4'}`}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-white/20 hover:bg-white/30 text-white font-medium px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isKeyboardOpen ? 'py-2' : 'py-3'}`}
                  >
                    {isLoading ? t.loading : t.save}
                  </button>
                </div>
              )}

              {/* Индикатор загрузки */}
              {isLoading && (
                <div className="text-center py-2">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <p className="text-white/80 text-sm mt-2">{t.loading}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Нижняя навигация */}
      <BottomNav 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={async (tabId) => {
          if (tabId === activeTab) return; // Остаемся на текущей странице
          
          // Просто переходим без принудительного сохранения
          if (activeTab === 'profile') {
            navigate('/main?tab=profile');
          } else {
            navigate('/main?tab=home');
          }
        }} 
      />
    </div>
  );
};

export default ProfileEditPage;
