import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  isValidUzbekPhone, 
  isValidEmail, 
  isValidBirthDate, 
  isValidFullName,
  formatPhoneE164 
} from '../utils/validation';
import { getMessage } from '../constants/messages';

const ProfileEditForm = ({ onSave, onCancel }) => {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    phone_number: '',
    full_name: '',
    email: '',
    birth_date: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user) {
      setFormData({
        phone_number: user.phone_number || '',
        full_name: user.full_name || '',
        email: user.email || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Валидация номера телефона
    if (formData.phone_number && !isValidUzbekPhone(formatPhoneE164(formData.phone_number))) {
      newErrors.phone_number = getMessage('INVALID_PHONE', language);
    }

    // Валидация имени
    if (formData.full_name && !isValidFullName(formData.full_name)) {
      newErrors.full_name = getMessage('INVALID_NAME', language);
    }

    // Валидация email
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = getMessage('INVALID_EMAIL', language);
    }

    // Валидация даты рождения
    if (formData.birth_date && !isValidBirthDate(formData.birth_date)) {
      newErrors.birth_date = getMessage('INVALID_BIRTH_DATE', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const updateData = {
        phone_number: formatPhoneE164(formData.phone_number),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        birth_date: formData.birth_date
      };

      const success = await updateProfile(updateData);
      
      if (success) {
        onSave && onSave();
      } else {
        setErrors({ general: getMessage('UPDATE_FAILED', language) });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: getMessage('UPDATE_FAILED', language) });
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    ru: {
      title: 'Редактировать профиль',
      phone: 'Номер телефона',
      fullName: 'Полное имя',
      email: 'Email',
      birthDate: 'Дата рождения',
      save: 'Сохранить',
      cancel: 'Отмена',
      loading: 'Сохранение...',
      phonePlaceholder: '+998 90 123 45 67',
      namePlaceholder: 'Иван Иванов',
      emailPlaceholder: 'user@example.com',
      datePlaceholder: '1990-01-01'
    },
    uz: {
      title: 'Profilni tahrirlash',
      phone: 'Telefon raqami',
      fullName: 'To\'liq ism',
      email: 'Email',
      birthDate: 'Tug\'ilgan sana',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      loading: 'Saqlanmoqda...',
      phonePlaceholder: '+998 90 123 45 67',
      namePlaceholder: 'Ivan Ivanov',
      emailPlaceholder: 'user@example.com',
      datePlaceholder: '1990-01-01'
    }
  }[language];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#5E5AF6]">
        {t.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Номер телефона */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.phone}
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            placeholder={t.phonePlaceholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A4CFF] ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
          )}
        </div>

        {/* Полное имя */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fullName}
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder={t.namePlaceholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A4CFF] ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.email}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t.emailPlaceholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A4CFF] ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Дата рождения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.birthDate}
          </label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleInputChange('birth_date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A4CFF] ${
              errors.birth_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birth_date && (
            <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
          )}
        </div>

        {/* Общая ошибка */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#6A4CFF] text-white rounded-lg hover:bg-[#5936F2] disabled:opacity-50"
          >
            {isLoading ? t.loading : t.save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
