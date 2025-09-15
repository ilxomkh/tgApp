import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import { 
  isValidUzbekPhone, 
  isValidEmail, 
  isValidFullName,
  formatPhoneE164 
} from "../utils/validation";
import { getMessage } from "../constants/messages";
import Header from "./header";
import BottomNav from "./Main/BottomNav";

const OrderSurveyScreen = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { createOrder, loading, error } = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: user?.full_name || user?.name || '',
    organization: '',
    position: '',
    phone: user?.phone_number || user?.phoneNumber || '',
    email: user?.email || '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [hasFormData, setHasFormData] = React.useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

  const translations = {
    ru: {
      title: "Заказать опрос",
      fullName: "ФИО",
      organization: "Названия организации",
      position: "Должность в орагнизации",
      phone: "Номер телефона",
      email: "Email",
      submit: "Отправить заявку",
      submitting: "Отправка...",
      success: "Заявка успешно отправлена!",
      error: "Произошла ошибка. Попробуйте еще раз.",
      required: "Обязательное поле",
      invalidName: "Неверное имя",
      invalidPhone: "Неверный номер телефона",
      invalidEmail: "Неверный email адрес",
      networkError: "Ошибка сети. Проверьте соединение.",
      orderCreated: "Заказ успешно создан!",
    },
    uz: {
      title: "So'rov buyurtma qilish",
      fullName: "F.I.O",
      organization: "Tashkilot nomi",
      position: "Tashkilotdagi lavozim",
      phone: "Telefon raqami",
      email: "Email",
      submit: "Arizani yuborish",
      submitting: "Yuborilmoqda...",
      success: "Ariza muvaffaqiyatli yuborildi!",
      error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
      required: "Majburiy maydon",
      invalidName: "Noto'g'ri ism",
      invalidPhone: "Noto'g'ri telefon raqami",
      invalidEmail: "Noto'g'ri email manzil",
      networkError: "Tarmoq xatosi. Ulanishni tekshiring.",
      orderCreated: "Buyurtma muvaffaqiyatli yaratildi!",
    },
  };
  const t = translations[language || "ru"];


  const tabs = [
    { id: "home", label: language === "uz" ? "Asosiy" : "Главная" },
    { id: "invite", label: language === "uz" ? "Taklif qilish" : "Пригласить" },
    { id: "lottery", label: language === "uz" ? "Natijalar" : "Итоги" },
    { id: "profile", label: language === "uz" ? "Profil" : "Профиль" },
  ];

  const handleTabChange = async (tabId) => {
    await autoSubmitForm();
    
    if (tabId === "home") {
      navigate("/main");
    } else if (tabId === "invite") {
      navigate("/main?tab=invite");
    } else if (tabId === "lottery") {
      navigate("/main?tab=lottery");
    } else if (tabId === "profile") {
      navigate("/main?tab=profile");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = t.required;
    } else if (!isValidFullName(formData.fullName.trim())) {
      errors.fullName = t.invalidName;
    }

    if (!formData.phone.trim()) {
      errors.phone = t.required;
    } else if (!isValidUzbekPhone(formatPhoneE164(formData.phone))) {
      errors.phone = t.invalidPhone;
    }

    if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
      errors.email = t.invalidEmail;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasFormData(true);
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const autoSubmitForm = React.useCallback(async () => {
    if (isFormSubmitted || isSubmitting || !hasFormData) {
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      return;
    }

    setIsFormSubmitted(true);
    setIsSubmitting(true);
    
    try {
      const orderData = {
        full_name: formData.fullName.trim(),
        company_name: formData.organization.trim(),
        job_title: formData.position.trim(),
        phone_number: formatPhoneE164(formData.phone),
        email: formData.email.trim()
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        setSubmitSuccess(true);
      } else {
        console.error('Auto submit error:', result.error);
      }
    } catch (error) {
      console.error('Error auto submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormSubmitted, isSubmitting, hasFormData, formData, createOrder]);

  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData && !isFormSubmitted && !isSubmitting) {
        autoSubmitForm();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasFormData, isFormSubmitted, isSubmitting, autoSubmitForm]);


  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="px-6 pt-8 pb-24">
        <h2 className="text-2xl font-bold text-[#5E5AF6] text-center mb-8">
          {t.title}
        </h2>

        <form className="space-y-4">
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-600 text-sm font-medium">{t.orderCreated}</p>
            </div>
          )}

          {formErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{formErrors.submit}</p>
            </div>
          )}

          <div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder={t.fullName}
              required
              className={`w-full px-4 py-4 text-white bg-[#8888FC] rounded-xl border-2 border-transparent focus:outline-none  transition-colors ${
                formErrors.fullName ? 'border-red-300 bg-red-50' : ''
              }`}
            />
            {formErrors.fullName && (
              <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder={t.organization}
              className="w-full px-4 py-4 text-white bg-[#8888FC] rounded-xl border-2 border-transparent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder={t.position}
              className="w-full px-4 py-4 text-white bg-[#8888FC] rounded-xl border-2 border-transparent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t.phone}
              required
              className={`w-full px-4 py-4 text-white bg-[#8888FC] rounded-xl border-2 border-transparent focus:outline-none transition-colors ${
                formErrors.phone ? 'border-red-300 bg-red-50' : ''
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t.email}
              className={`w-full px-4 py-4 text-white bg-[#8888FC] rounded-xl border-2 border-transparent focus:outline-none transition-colors ${
                formErrors.email ? 'border-red-300 bg-red-50' : ''
              }`}
            />
            {formErrors.email && (
              <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

        </form>
      </div>

      <BottomNav tabs={tabs} activeTab="profile" onChange={handleTabChange} />
    </div>
  );
};

export default OrderSurveyScreen;
