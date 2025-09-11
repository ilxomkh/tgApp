import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ProfileEditPage = () => {
  const navigate = useNavigate();
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

    // Валидация имени (обязательное поле)
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      newErrors.full_name = t.errors.nameRequired;
    } else if (!isValidFullName(formData.full_name)) {
      newErrors.full_name = t.errors.nameInvalid;
    }

    // Валидация email (обязательное поле)
    if (!formData.email || formData.email.trim().length === 0) {
      newErrors.email = t.errors.emailRequired;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    // Валидация даты рождения (обязательное поле)
    if (!formData.birth_date || formData.birth_date.trim().length === 0) {
      newErrors.birth_date = t.errors.birthDateRequired;
    } else {
      // Проверяем формат DD.MM.YYYY
      const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
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
    // Разрешаем только цифры, точки, Backspace, Delete, Tab, Enter, стрелки
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key) || 
        (e.key >= '0' && e.key <= '9') || 
        e.key === '.') {
      return;
    }
    
    e.preventDefault();
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Специальная обработка для поля даты рождения
    if (field === 'birth_date') {
      // Удаляем все нецифровые символы кроме точек
      let cleanValue = value.replace(/[^\d.]/g, '');
      
      // Разбиваем на части по точкам
      const parts = cleanValue.split('.');
      
      // Ограничиваем длину каждой части
      if (parts.length > 0 && parts[0].length > 2) {
        parts[0] = parts[0].slice(0, 2);
      }
      if (parts.length > 1 && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      if (parts.length > 2 && parts[2].length > 4) {
        parts[2] = parts[2].slice(0, 4);
      }
      
      // Валидация дня (1-31)
      if (parts[0] && parts[0].length === 2) {
        const day = parseInt(parts[0], 10);
        if (day > 31) {
          parts[0] = '31';
        } else if (day < 1) {
          parts[0] = '01';
        }
      }
      
      // Валидация месяца (1-12)
      if (parts[1] && parts[1].length === 2) {
        const month = parseInt(parts[1], 10);
        if (month > 12) {
          parts[1] = '12';
        } else if (month < 1) {
          parts[1] = '01';
        }
      }
      
      // Валидация года (1950-2050)
      if (parts[2] && parts[2].length === 4) {
        const year = parseInt(parts[2], 10);
        if (year > 2050) {
          parts[2] = '2050';
        } else if (year < 1950) {
          parts[2] = '1950';
        }
      }
      
      // Собираем обратно
      processedValue = parts.join('.');
      
      // Автоматически добавляем точки при достижении нужной длины
      if (parts[0] && parts[0].length === 2 && !parts[1]) {
        processedValue = parts[0] + '.';
      } else if (parts[0] && parts[0].length === 2 && parts[1] && parts[1].length === 2 && !parts[2]) {
        processedValue = parts[0] + '.' + parts[1] + '.';
      }
      
      // Проверяем реальность даты при полном вводе
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        // Проверяем количество дней в месяце
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Проверяем високосный год для февраля
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (month === 2 && isLeapYear) {
          daysInMonth[1] = 29;
        }
        
        // Если день больше максимального для месяца, корректируем
        if (day > daysInMonth[month - 1]) {
          parts[0] = daysInMonth[month - 1].toString().padStart(2, '0');
          processedValue = parts.join('.');
        }
        
        // Проверяем, что дата не в будущем
        const date = new Date(year, month - 1, day);
        const today = new Date();
        if (date > today) {
          // Устанавливаем сегодняшнюю дату
          const todayDay = today.getDate().toString().padStart(2, '0');
          const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
          const todayYear = today.getFullYear().toString();
          processedValue = `${todayDay}.${todayMonth}.${todayYear}`;
        }
      }
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
    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);
    
    try {
      // Конвертируем дату из DD.MM.YYYY в YYYY-MM-DD для API
      const [day, month, year] = formData.birth_date.split('.');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const updateData = {
        phone_number: user.phone_number, // Оставляем номер телефона неизменным
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        birth_date: formattedDate
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

  const handleBack = async () => {
    if (hasChanges) {
      const saved = await saveProfile();
      if (saved) {
        navigate(-1); // Возврат на предыдущую страницу
      }
    } else {
      navigate(-1); // Возврат на предыдущую страницу
    }
  };

  // Автосохранение при переходе на другую страницу
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (hasChanges) {
        await saveProfile();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

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
      <div className={`p-4 ${isKeyboardOpen ? 'pb-4' : 'pb-[90px]'}`}>
        <div className="max-w-md mx-auto">
          {/* Карточка профиля с фиолетовым градиентом */}
          <div className="bg-gradient-to-r from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-6 text-white shadow-lg mb-6">
            {/* Заголовок формы с иконками */}
            <div className="flex relative gap-2 items-center mb-6">
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
              <div className="w-12 h-12 absolute right-0">
              <button
                onClick={handleBack}
                className="w-12 h-12 flex items-center justify-center"
              >
                <SettingsIcon />
              </button>
              </div>
            </div>

            {/* Форма редактирования профиля */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-3 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all"
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
                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white/60 cursor-not-allowed"
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
                    className="w-full px-4 py-3 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all"
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
                    className="w-full px-4 py-3 bg-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all"
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
        activeTab="profile" 
        onChange={async (tabId) => {
          if (tabId === 'profile') return; // Остаемся на текущей странице
          
          // Автосохранение перед переходом
          if (hasChanges) {
            const saved = await saveProfile();
            if (saved) {
              navigate(-1); // Возврат на предыдущую страницу
            }
          } else {
            navigate(-1); // Возврат на предыдущую страницу
          }
        }} 
      />
    </div>
  );
};

export default ProfileEditPage;
