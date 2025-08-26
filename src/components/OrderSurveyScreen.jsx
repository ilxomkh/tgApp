import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./header";

const OrderSurveyScreen = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: user?.name || '',
    organization: '',
    position: '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // ---------- Переводы ----------
  const translations = {
    ru: {
      title: "Заказать опрос",
      back: "Назад",
      formTitle: "Заполните форму для заказа опроса",
      fullName: "ФИО",
      fullNamePlaceholder: "Введите ваше полное имя",
      organization: "Организация",
      organizationPlaceholder: "Название вашей организации",
      position: "Должность",
      positionPlaceholder: "Ваша должность в организации",
      phone: "Телефон",
      phonePlaceholder: "Ваш номер телефона",
      email: "Email",
      emailPlaceholder: "Ваш email адрес",
      description: "Описание опроса",
      descriptionPlaceholder: "Опишите, какой опрос вам нужен",
      submit: "Отправить заявку",
      submitting: "Отправка...",
      success: "Заявка успешно отправлена!",
      error: "Произошла ошибка. Попробуйте еще раз.",
      required: "Обязательное поле",
    },
    uz: {
      title: "So'rov buyurtma qilish",
      back: "Orqaga",
      formTitle: "So'rov buyurtma qilish uchun formani to'ldiring",
      fullName: "F.I.O",
      fullNamePlaceholder: "To'liq ismingizni kiriting",
      organization: "Tashkilot",
      organizationPlaceholder: "Tashkilotingiz nomi",
      position: "Lavozim",
      positionPlaceholder: "Tashkilotdagi lavozimingiz",
      phone: "Telefon",
      phonePlaceholder: "Telefon raqamingiz",
      email: "Email",
      emailPlaceholder: "Email manzilingiz",
      description: "So'rov tavsifi",
      descriptionPlaceholder: "Qanday so'rov kerakligini tasvirlab bering",
      submit: "Arizani yuborish",
      submitting: "Yuborilmoqda...",
      success: "Ariza muvaffaqiyatli yuborildi!",
      error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
      required: "Majburiy maydon",
    },
  };
  const t = translations[language || "ru"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Имитация отправки на API
    setTimeout(() => {
      setIsSubmitting(false);
      alert(t.success);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Основной контент с кастомным скроллбаром */}
      <div className="px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        {/* Заголовок страницы */}
        <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
          {t.title}
        </h2>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#5E5AF6] mb-4 text-center">
              {t.formTitle}
            </h3>
          </div>

          {/* ФИО */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.fullName} *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder={t.fullNamePlaceholder}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors"
            />
          </div>

          {/* Организация */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.organization}
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder={t.organizationPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors"
            />
          </div>

          {/* Должность */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.position}
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder={t.positionPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.phone} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t.phonePlaceholder}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.description}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E5AF6] focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5E5AF6] text-white py-4 rounded-xl font-semibold hover:bg-[#4A46E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>

        {/* Кнопка "Назад" */}
        <div className="rounded-2xl bg-[#EDEAFF] p-2 mt-6">
          <button
            onClick={() => navigate('/main?tab=profile')}
            className="w-full h-[48px] rounded-xl bg-[#8C8AF9] text-white font-semibold active:scale-[0.99] transition"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSurveyScreen;
