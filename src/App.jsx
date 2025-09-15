import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import TallyFormsTest from './components/TallyFormsTest';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function useTelegramInit() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    // ✅ Отключаем свайпы (новый API)
    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
    }

    // ✅ Повтор через 300мс (иногда первый вызов игнорится)
    setTimeout(() => {
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
      }
    }, 300);

    // ✅ Фолбэк для iOS Safari
    const preventPullToRefresh = (e) => {
      if (window.scrollY === 0 && e.touches.length === 1) {
        const startY = e.touches[0].clientY;
        const onMove = (ev) => {
          const deltaY = ev.touches[0].clientY - startY;
          if (deltaY > 10) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        };
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener(
          'touchend',
          () => document.removeEventListener('touchmove', onMove),
          { once: true }
        );
      }
    };
    document.addEventListener('touchstart', preventPullToRefresh, { passive: true });

    // ✅ Вибрация при любом клике
    const vibrateOnClick = () => {
      if (tg.HapticFeedback?.impactOccurred) {
        tg.HapticFeedback.impactOccurred('medium');
      }
    };
    document.addEventListener('click', vibrateOnClick);

    // Очистка
    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('click', vibrateOnClick);
    };
  }, []);
}

function AppContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  useTelegramInit();

  return (
    <Router>
      <RouterContent />
    </Router>
  );
}

function AuthInitializer({ children }) {
  const { isInitializing } = useAuth();

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

  return children;
}

function RouterContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  const location = useLocation();

  return (
    <div
      className="min-h-[100dvh] bg-gray-50"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #F9FAFB)'
      }}
    >
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/public-offer" element={<PublicOfferScreen />} />

        {/* Защищённые маршруты */}
        <Route path="/main" element={<ProtectedRoute><MainScreen /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><WithdrawScreen /></ProtectedRoute>} />
        <Route path="/order-survey" element={<ProtectedRoute><OrderSurveyScreen /></ProtectedRoute>} />
        <Route path="/referral-program" element={<ProtectedRoute><ReferralProgramScreen /></ProtectedRoute>} />
        <Route path="/project-info" element={<ProtectedRoute><ProjectInfoScreen /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportScreen /></ProtectedRoute>} />
        <Route path="/profile-edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/test-tally" element={<ProtectedRoute><TallyFormsTest /></ProtectedRoute>} />
      </Routes>

      <LanguageSelector
        isOpen={isLanguageModalOpen}
        onClose={closeLanguageModal}
        shouldNavigateToOnboarding={location.pathname === '/'}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthInitializer>
          <AppContent />
        </AuthInitializer>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
