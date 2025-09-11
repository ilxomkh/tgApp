import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelector from './components/LanguageSelector';
import Onboarding from './components/Onboarding';
import AuthScreen from './components/AuthScreen';
import PrivacyPolicy from './components/PrivacyPolicy';
import MainScreen from './components/Main/MainScreen';
import WithdrawScreen from './components/WithdrawScreen';
import OrderSurveyScreen from './components/OrderSurveyScreen';
import ReferralProgramScreen from './components/ReferralProgramScreen';
import ProjectInfoScreen from './components/ProjectInfoScreen';
import PublicOfferScreen from './components/PublicOfferScreen';
import SupportScreen from './components/SupportScreen';
import ProfileEditPage from './components/ProfileEditPage';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  const { isInitializing } = useAuth();

  // === ВАЖНО: Инициализация Telegram WebApp и покраска шапки ===
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
    
    // Фиксируем нижнюю панель, чтобы она не скрывалась при скролле
    tg.MainButton.show();

    // Цвета шапки и фона WebView — под верхний цвет твоего градиента (#6A4CFF)
    tg.setHeaderColor?.('#6A4CFF');       // На iOS может игнорироваться, но на Android ок
    tg.setBackgroundColor?.('#6A4CFF');   // Фон под вебвью
  }, []);

  // Показываем индикатор загрузки во время инициализации
  if (isInitializing) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C65FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <RouterContent />
    </Router>
  );
}

function RouterContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  const location = useLocation();

  return (
    <>
      {/* Корневой контейнер */}
      <div
        className="
          min-h-[100dvh]
          bg-gray-50
        "
        style={{
          // на случай, если телеграм не применит цвет — делаем такой же фон у корня
          backgroundColor: 'var(--tg-theme-bg-color, #F9FAFB)'
        }}
      >
        <Routes>
          {/* Публичные маршруты (не требуют авторизации) */}
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/public-offer" element={<PublicOfferScreen />} />
          
          {/* Защищенные маршруты (требуют авторизации) */}
          <Route path="/main" element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          } />
          <Route path="/withdraw" element={
            <ProtectedRoute>
              <WithdrawScreen />
            </ProtectedRoute>
          } />
          <Route path="/order-survey" element={
            <ProtectedRoute>
              <OrderSurveyScreen />
            </ProtectedRoute>
          } />
          <Route path="/referral-program" element={
            <ProtectedRoute>
              <ReferralProgramScreen />
            </ProtectedRoute>
          } />
          <Route path="/project-info" element={
            <ProtectedRoute>
              <ProjectInfoScreen />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute>
              <SupportScreen />
            </ProtectedRoute>
          } />
          <Route path="/profile-edit" element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Language Modal */}
        <LanguageSelector
          isOpen={isLanguageModalOpen}
          onClose={closeLanguageModal}
          shouldNavigateToOnboarding={location.pathname === '/'}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
