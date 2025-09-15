// tg-app/src/components/Main/tabs/ProfileTab/ProfileTab.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLanguage } from "../../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { formatDate } from "../../../../utils/validation";
import { getMessage } from "../../../../constants/messages";
import LanguageSelector from "../../../LanguageSelector";
import UserAvatar from "../../../UserAvatar";
import { EditIcon, LogOutIcon, Pencil, PencilIcon } from "lucide-react";
import { SettingsIcon } from "../../icons";
import WaveOverlay from "../../../WaveOverlay";
import BottomNav from "../../BottomNav";
import ProSVG from "../../../../assets/Pro.svg";

const ProfileTab = ({ t = {}, onClose, onResetToOnboarding }) => {
  const { user, refreshUserProfile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { getUserProfile, loading, error } = useApi();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // ---------- Переводы ----------
  const translations = {
    ru: {
      phoneNumber: "Номер телефона:",
      fullName: "Полное имя:",
      email: "Email:",
      birthDate: "Дата рождения:",
      balance: "Баланс:",
      editProfile: "Редактировать профиль",
      projectInfo: "Информация о проекте",
      publicOffer: "Публичная оферта",
      changeLang: "Изменить язык",
      support: "Служба поддержки",
      orderSurvey: "Заказать опрос",
      resetToOnboarding: "Выйти",
      loading: "Загрузка...",
      error: "Ошибка загрузки профиля",
    },
    uz: {
      phoneNumber: "Telefon raqami:",
      fullName: "To'liq ism:",
      email: "Email:",
      birthDate: "Tug'ilgan sana:",
      balance: "Balans:",
      editProfile: "Profilni tahrirlash",
      projectInfo: "Loyiha haqida ma'lumot",
      publicOffer: "Ochiq taklif",
      changeLang: "Tilni o'zgartirish",
      support: "Qo'llab-quvvatlash xizmati",
      orderSurvey: "So'rov buyurtma qilish",
      resetToOnboarding: "Chiqish",
      loading: "Yuklanmoqda...",
      error: "Profilni yuklashda xatolik",
    },
  };
  const localT = translations[language || "ru"];

  // Загружаем профиль пользователя при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const result = await getUserProfile();
          if (result.success) {
            setUserProfile(result.data);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          // 401 ошибка уже обрабатывается глобально в API сервисе
        }
      }
    };

    loadProfile();
  }, [user, getUserProfile]);

  const handleMenuClick = (route) => {
    if (route === "/change-language") {
      setIsLanguageModalOpen(true);
    } else {
      navigate(route);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile-edit?tab=profile');
  };

  const handleLanguageClose = () => {
    setIsLanguageModalOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    onResetToOnboarding();
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="">
      {/* Основной контент */}
      <div className="px-2 py-2">
        {/* Карточка профиля */}
        <div className="bg-gradient-to-r relative from-[#5E5AF6] to-[#7C65FF] rounded-2xl px-4 py-2 text-white shadow-lg mb-8">
          <div className="text-center">
            {/* Аватарка пользователя */}
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <UserAvatar 
                avatarUrl={userProfile?.avatar_url} 
                size="w-full h-full"
                className="bg-white/20"
                showBorder={true}
              />
            </div>

            {/* Скелетон загрузки профиля */}
            {loading && (
              <div className="text-center py-4 animate-pulse">
                {/* Скелетон аватарки */}
                
                {/* Скелетон текста */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded-lg w-32 mx-auto"></div>
                  <div className="h-6 bg-white/20 rounded-lg w-24 mx-auto"></div>
                </div>
              </div>
            )}

            {/* Ошибка загрузки */}
            {error && (
              <div className="text-center py-4">
                <p className="text-red-200 text-sm">{localT.error}</p>
              </div>
            )}

            {/* Данные профиля */}
            {userProfile && !loading && !error && (
              <>
                {/* Номер телефона */}
                <p className="text-white/90 text-sm mb-1">{localT.phoneNumber}</p>
                <p className="text-xl font-bold">{userProfile.phone_number}</p>
              </>
            )}

            {/* Кнопка редактирования */}
            {userProfile && !loading && !error && (
              <button
                onClick={handleEditProfile}
                className="absolute top-2 right-2  text-white transition-colors"
              >
                <SettingsIcon />
              </button>
            )}
          </div>
        </div>

        {/* Меню опций */}
        <div className="space-y-2">
          {/* Информация о проекте */}
          <button
            onClick={() => handleMenuClick("/project-info")}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 69 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.05 17.25H37.95V24.15H31.05V17.25ZM31.05 31.05H37.95V51.75H31.05V31.05ZM34.5 0C15.456 0 0 15.456 0 34.5C0 53.544 15.456 69 34.5 69C53.544 69 69 53.544 69 34.5C69 15.456 53.544 0 34.5 0ZM34.5 62.1C19.2855 62.1 6.9 49.7145 6.9 34.5C6.9 19.2855 19.2855 6.9 34.5 6.9C49.7145 6.9 62.1 19.2855 62.1 34.5C62.1 49.7145 49.7145 62.1 34.5 62.1Z"
                  fill="url(#paint0_linear_102_1137)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_1137"
                    x1="69"
                    y1="34.5"
                    x2="20.54"
                    y2="66.0494"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="text-gray-800 font-medium">
                {localT.projectInfo}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Публичная оферта */}
          <button
            onClick={() => handleMenuClick("/public-offer")}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 62 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6 48.1H37.4V54.9H13.6V48.1ZM13.6 34.5H47.6V41.3H13.6V34.5ZM13.6 20.9H47.6V27.7H13.6V20.9ZM54.4 7.3H40.188C38.76 3.356 35.02 0.5 30.6 0.5C26.18 0.5 22.44 3.356 21.012 7.3H6.8C6.324 7.3 5.882 7.334 5.44 7.436C4.114 7.708 2.924 8.388 2.006 9.306C1.394 9.918 0.884 10.666 0.544 11.482C0.204 12.264 0 13.148 0 14.1V61.7C0 62.618 0.204 63.536 0.544 64.352C0.884 65.168 1.394 65.882 2.006 66.528C2.924 67.446 4.114 68.126 5.44 68.398C5.882 68.466 6.324 68.5 6.8 68.5H54.4C58.14 68.5 61.2 65.44 61.2 61.7V14.1C61.2 10.36 58.14 7.3 54.4 7.3ZM30.6 6.45C31.994 6.45 33.15 7.606 33.15 9C33.15 10.394 31.994 11.55 30.6 11.55C29.206 11.55 28.05 10.394 28.05 9C28.05 7.606 29.206 6.45 30.6 6.45ZM54.4 61.7H6.8V14.1H54.4V61.7Z"
                  fill="url(#paint0_linear_102_1164)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_1164"
                    x1="61.2"
                    y1="34.5"
                    x2="15.6413"
                    y2="61.1945"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="text-gray-800 font-medium">
                {localT.publicOffer}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Изменить язык */}
          <button
            onClick={() => handleMenuClick("/change-language")}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.965 0C15.645 0 0 15.68 0 35C0 54.32 15.645 70 34.965 70C54.32 70 70 54.32 70 35C70 15.68 54.32 0 34.965 0ZM59.22 21H48.895C47.775 16.625 46.165 12.425 44.065 8.54C50.505 10.745 55.86 15.225 59.22 21ZM35 7.14C37.905 11.34 40.18 15.995 41.685 21H28.315C29.82 15.995 32.095 11.34 35 7.14ZM7.91 42C7.35 39.76 7 37.415 7 35C7 32.585 7.35 30.24 7.91 28H19.74C19.46 30.31 19.25 32.62 19.25 35C19.25 37.38 19.46 39.69 19.74 42H7.91ZM10.78 49H21.105C22.225 53.375 23.835 57.575 25.935 61.46C19.495 59.255 14.14 54.81 10.78 49ZM21.105 21H10.78C14.14 15.19 19.495 10.745 25.935 8.54C23.835 12.425 22.225 16.625 21.105 21ZM35 62.86C32.095 58.66 29.82 54.005 28.315 49H41.685C40.18 54.005 37.905 58.66 35 62.86ZM43.19 42H26.81C26.495 39.69 26.25 37.38 26.25 35C26.25 32.62 26.495 30.275 26.81 28H43.19C43.505 30.275 43.75 32.62 43.75 35C43.75 37.38 43.505 39.69 43.19 42ZM44.065 61.46C46.165 57.575 47.775 53.375 48.895 49H59.22C55.86 54.775 50.505 59.255 44.065 61.46ZM50.26 42C50.54 39.69 50.75 37.38 50.75 35C50.75 32.62 50.54 30.31 50.26 28H62.09C62.65 30.24 63 32.585 63 35C63 37.415 62.65 39.76 62.09 42H50.26Z"
                  fill="url(#paint0_linear_102_1166)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_1166"
                    x1="70"
                    y1="35"
                    x2="20.8377"
                    y2="67.0067"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="text-gray-800 font-medium">
                {localT.changeLang}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Служба поддержки */}
          <button
            onClick={() => handleMenuClick("/support")}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 78 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M73.8889 36.3556C73.8889 15.0056 57.3222 0.5 38.8889 0.5C20.65 0.5 3.88889 14.6944 3.88889 36.5889C1.55556 37.9111 0 40.4 0 43.2778V51.0556C0 55.3333 3.5 58.8333 7.77778 58.8333H11.6667V35.1111C11.6667 20.0611 23.8389 7.88889 38.8889 7.88889C53.9389 7.88889 66.1111 20.0611 66.1111 35.1111V62.7222H35V70.5H66.1111C70.3889 70.5 73.8889 67 73.8889 62.7222V57.9778C76.1833 56.7722 77.7778 54.4 77.7778 51.6V42.6556C77.7778 39.9333 76.1833 37.5611 73.8889 36.3556Z"
                  fill="url(#paint0_linear_102_1175)"
                />
                <path
                  d="M27.2222 43.2778C29.37 43.2778 31.1111 41.5367 31.1111 39.3889C31.1111 37.2411 29.37 35.5 27.2222 35.5C25.0744 35.5 23.3333 37.2411 23.3333 39.3889C23.3333 41.5367 25.0744 43.2778 27.2222 43.2778Z"
                  fill="url(#paint1_linear_102_1175)"
                />
                <path
                  d="M50.5556 43.2778C52.7033 43.2778 54.4444 41.5367 54.4444 39.3889C54.4444 37.2411 52.7033 35.5 50.5556 35.5C48.4078 35.5 46.6667 37.2411 46.6667 39.3889C46.6667 41.5367 48.4078 43.2778 50.5556 43.2778Z"
                  fill="url(#paint2_linear_102_1175)"
                />
                <path
                  d="M62.224 31.7278C60.3573 20.6444 50.7129 12.1667 39.0851 12.1667C27.3018 12.1667 14.624 21.9278 15.6351 37.25C25.2407 33.3222 32.474 24.7667 34.5351 14.3444C39.6296 24.5722 50.0907 31.6111 62.224 31.7278Z"
                  fill="url(#paint3_linear_102_1175)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_1175"
                    x1="77.7778"
                    y1="35.5"
                    x2="26.7183"
                    y2="72.4354"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_102_1175"
                    x1="77.7778"
                    y1="35.5"
                    x2="26.7183"
                    y2="72.4354"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_102_1175"
                    x1="77.7778"
                    y1="35.5"
                    x2="26.7183"
                    y2="72.4354"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_102_1175"
                    x1="77.7778"
                    y1="35.5"
                    x2="26.7183"
                    y2="72.4354"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="text-gray-800 font-medium">
                {localT.support}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Заказать опрос */}
          <button
            onClick={() => handleMenuClick("/order-survey")}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 70 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M70 11.5526V18.9211H58.9474V29.9737H51.5789V18.9211H40.5263V11.5526H51.5789V0.5H58.9474V11.5526H70ZM58.9474 63.1316H7.36842V11.5526H29.4737V4.18421H7.36842C3.31579 4.18421 0 7.5 0 11.5526V63.1316C0 67.1842 3.31579 70.5 7.36842 70.5H58.9474C63 70.5 66.3158 67.1842 66.3158 63.1316V41.0263H58.9474V63.1316ZM44.2105 41.0263V55.7632H51.5789V41.0263H44.2105ZM29.4737 55.7632H36.8421V26.2895H29.4737V55.7632ZM22.1053 55.7632V33.6579H14.7368V55.7632H22.1053Z"
                  fill="url(#paint0_linear_102_1176)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_1176"
                    x1="70"
                    y1="35.5"
                    x2="20.8377"
                    y2="67.5067"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7C65FF" />
                    <stop offset="1" stop-color="#5538F9" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="text-gray-800 font-medium">
                {localT.orderSurvey}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Кнопка сброса для разработки */}
          {/* <button
            onClick={handleLogoutClick}
            className="w-full bg-[#F7F8FA] rounded-xl p-3 flex items-center justify-between transition-colors border-px border border-[#D8D7FD]"
          >
            <div className="flex items-center gap-4">
              <LogOutIcon className="text-red-600" />

              <span className="text-red-600 font-medium">
                {localT.resetToOnboarding}
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-400"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}
        </div>
      </div>

      {/* Используем существующий LanguageSelector */}
      <LanguageSelector 
        isOpen={isLanguageModalOpen} 
        onClose={handleLanguageClose} 
      />

      {/* Модальное окно подтверждения выхода */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="absolute inset-0 z-30 bg-gradient-to-b from-[#6A4CFF] to-[#4D2DE0]">
          <WaveOverlay />
          <img src={ProSVG} alt="Pro" className="absolute w-[260px] top-1/5 right-1/2 left-1/2 -translate-x-1/2 z-999"/>
          </div>
          <div className="absolute bottom-0 bg-white rounded-t-2xl p-6 w-full z-40 min-h-[300px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOutIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getMessage('LOGOUT_CONFIRMATION_TITLE', language)}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {getMessage('LOGOUT_CONFIRMATION_MESSAGE', language)}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-200"
                >
                  {getMessage('LOGOUT_CANCEL', language)}
                </button>
                
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium transition-colors hover:bg-red-700"
                >
                  {getMessage('LOGOUT_CONFIRM', language)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
