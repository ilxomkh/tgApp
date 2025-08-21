import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const OrderSurveyScreen = () => {
  const navigate = useNavigate();
  const { language, openLanguageModal } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    position: '',
    phone: '',
    email: '',
    description: ''
  });

  const orderSurveyText = {
    uz: {
      title: 'So\'rovnoma buyurtma qilish',
      fullName: 'F.I.O',
      organization: 'Tashkilot nomi',
      position: 'Tashkilotdagi lavozim',
      phone: 'Telefon raqam',
      email: 'Email',
      sendRequest: 'So\'rov yuborish',
      placeholder: 'Kiriting'
    },
    ru: {
      title: 'Заказать опрос',
      fullName: 'ФИО',
      organization: 'Названия организации',
      position: 'Должность в организации',
      phone: 'Номер телефона',
      email: 'Email',
      sendRequest: 'Отправить запрос',
      placeholder: 'Указать'
    }
  };

  const currentText = orderSurveyText[language];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки запроса
    console.log('Survey request:', formData);
    navigate('/main');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">
          {currentText.title}
        </h1>
      </div>

      {/* App header */}
      <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-white text-sm">16:36</span>
          <button className="text-white text-sm font-medium">
            X Закрыть
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={openLanguageModal}
            className="text-white text-sm hover:bg-white/20 px-2 py-1 rounded transition-colors"
          >
            {language === 'uz' ? '🇺🇿' : '🇷🇺'}
          </button>
          <span className="text-white text-sm">LTE</span>
          <div className="w-6 h-3 bg-white rounded-sm flex items-center justify-center">
            <span className="text-xs text-emerald-600 font-bold">32</span>
          </div>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110 4 2 2 0 010-4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      </div>

      <div className="p-6">
        {/* Main title */}
        <div className="bg-emerald-600 rounded-lg p-4 text-white text-center mb-6">
          <h2 className="text-lg font-semibold">
            {currentText.title}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-emerald-600 rounded-lg p-4">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder={currentText.placeholder}
              className="w-full bg-transparent text-white placeholder-white/70 outline-none text-lg"
            />
            <p className="text-white/80 text-sm mt-1">
              {currentText.fullName}
            </p>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4">
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder={currentText.placeholder}
              className="w-full bg-transparent text-white placeholder-white/70 outline-none text-lg"
            />
            <p className="text-white/80 text-sm mt-1">
              {currentText.organization}
            </p>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4">
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder={currentText.placeholder}
              className="w-full bg-transparent text-white placeholder-white/70 outline-none text-lg"
            />
            <p className="text-white/80 text-sm mt-1">
              {currentText.position}
            </p>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={currentText.placeholder}
              className="w-full bg-transparent text-white placeholder-white/70 outline-none text-lg"
            />
            <p className="text-white/80 text-sm mt-1">
              {currentText.phone}
            </p>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={currentText.placeholder}
              className="w-full bg-transparent text-white placeholder-white/70 outline-none text-lg"
            />
            <p className="text-white/80 text-sm mt-1">
              {currentText.email}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 text-lg"
          >
            {currentText.sendRequest}
          </button>
        </form>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-600 border-t border-emerald-700">
        <div className="flex">
          <button
            onClick={() => navigate('/main')}
            className="flex-1 py-4 px-2 text-center text-white/80 hover:text-white hover:bg-emerald-600 transition-all duration-200"
          >
            <div className="text-xl mb-1">🏠</div>
            <div className="text-xs font-medium">
              {language === 'uz' ? 'Asosiy' : 'Главная'}
            </div>
          </button>
          
          <button
            onClick={() => navigate('/main')}
            className="flex-1 py-4 px-2 text-center text-white/80 hover:text-white hover:bg-emerald-600 transition-all duration-200"
          >
            <div className="text-xl mb-1">👥</div>
            <div className="text-xs font-medium">
              {language === 'uz' ? 'Do\'stni taklif qilish' : 'Пригласить друга'}
            </div>
          </button>
          
          <button
            onClick={() => navigate('/main')}
            className="flex-1 py-4 px-2 text-center text-white/80 hover:text-white hover:bg-emerald-600 transition-all duration-200"
          >
            <div className="text-xl mb-1">🎰</div>
            <div className="text-xs font-medium">
              {language === 'uz' ? 'Lotereya natijalari' : 'Итоги розыгрыша'}
            </div>
          </button>
          
          <button
            onClick={() => navigate('/main')}
            className="flex-1 py-4 px-2 text-center text-white bg-emerald-700 transition-all duration-200"
          >
            <div className="text-xl mb-1">👤</div>
            <div className="text-xs font-medium">
              {language === 'uz' ? 'Profil' : 'Профиль'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSurveyScreen;
