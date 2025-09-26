import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import AdminPanel from './components/Admin/AdminPanel';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProSVG from './assets/Pro.svg';
import WaveOverlay from './components/WaveOverlay';
import CloseConfirmationModal from './components/CloseConfirmationModal';
import { useTracking } from './hooks/useTracking';
import trackingService from './services/trackingService';

import OpenRedirect from './components/OpenRedirect';

const STARTAPP_PAYLOAD = 'home';

function useTelegramInit(setIsCloseModalOpen) {
  const location = useLocation();
  const navigate = useNavigate();
  const backHandlerRef = useRef(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    try {
      tg.ready();
      tg.expand?.();
      setTimeout(() => tg.expand?.(), 250);

      tg.isClosingConfirmationEnabled = true;
    } catch {}

    const nukeMainButton = () => {
      try {
        tg.MainButton?.hide?.();
        if (tg.MainButton) {
          tg.MainButton.show = () => {};
          tg.MainButton.setParams = () => {};
        }
      } catch {}
    };
    nukeMainButton();
    [80, 160, 320, 640].forEach((d) => setTimeout(nukeMainButton, d));

    tg.onEvent?.('web_app_ready', nukeMainButton);
    tg.onEvent?.('mainButtonParamsChanged', nukeMainButton);
    tg.onEvent?.('mainButtonTextChanged', nukeMainButton);
    tg.onEvent?.('themeChanged', nukeMainButton);

    try {
      tg.disableVerticalSwipes?.();
      setTimeout(() => tg.disableVerticalSwipes?.(), 300);
    } catch {}

    const vibrateOnClick = () => tg.HapticFeedback?.impactOccurred?.('medium');
    document.addEventListener('click', vibrateOnClick);

    // Трекинг инициализации Telegram WebApp
    trackingService.track('telegram_webapp_init', {
      platform: tg.platform,
      version: tg.version,
      color_scheme: tg.colorScheme,
      theme_params: tg.themeParams
    });

    const backPages = new Set([
      '/withdraw',
      '/profile-edit',
      '/project-info',
      '/public-offer',
      '/support',
      '/order-survey',
      '/test-tally',
      '/admin',
    ]);

    let surveyModalState = null;
    window.setSurveyModalState = (state) => {
      surveyModalState = state;
      applyBackButtonForPath(location.pathname);
    };

    const applyBackButtonForPath = (path) => {
      if (!tg.BackButton) return;

      if (backHandlerRef.current) {
        try {
          tg.BackButton.offClick(backHandlerRef.current);
        } catch {}
        backHandlerRef.current = null;
      }

      if (surveyModalState && surveyModalState.isSurveyModalOpen) {
        tg.BackButton.show();
        const handler = () => {
          trackingService.track('telegram_back_button_click', {
            context: 'survey_modal'
          });
          if (surveyModalState.closeSurveyModal) {
            surveyModalState.closeSurveyModal();
          }
        };
        backHandlerRef.current = handler;
        tg.BackButton.onClick(handler);
      } else if (backPages.has(path)) {
        tg.BackButton.show();
        const handler = () => {
          trackingService.track('telegram_back_button_click', {
            context: 'page_navigation',
            current_page: path
          });
          navigate(-1);
        };
        backHandlerRef.current = handler;
        tg.BackButton.onClick(handler);
      } else {
        tg.BackButton.hide();
      }
    };

    applyBackButtonForPath(location.pathname);

    return () => {
      tg.offEvent?.('web_app_ready', nukeMainButton);
      tg.offEvent?.('mainButtonParamsChanged', nukeMainButton);
      tg.offEvent?.('mainButtonTextChanged', nukeMainButton);
      tg.offEvent?.('themeChanged', nukeMainButton);
      if (tg.BackButton && backHandlerRef.current) {
        try {
          tg.BackButton.offClick(backHandlerRef.current);
        } catch {}
        tg.BackButton.hide();
      }
      document.removeEventListener('click', vibrateOnClick);
    };
  }, [location.pathname, navigate, setIsCloseModalOpen]);
}


function AppContent() {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  useTelegramInit(setIsCloseModalOpen);

  return (
    <>
      <RouterContent />
      <CloseConfirmationModal
        isOpen={isCloseModalOpen}
        onConfirm={() => {
          setIsCloseModalOpen(false);
          const tg = window.Telegram?.WebApp;
          tg?.close?.();
          window.close();
        }}
        onCancel={() => setIsCloseModalOpen(false)}
      />
    </>
  );
}

function AuthInitializer({ children }) {
  const { isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#7C65FF] to-[#5538F9]">
        <WaveOverlay />
        <img
          src={ProSVG}
          alt="Loading"
          className="absolute w-[250px] top-1/2 left-1/2 -translate-x-1/2 z-50"
        />
      </div>
    );
  }
  return children;
}

function RouterContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  const location = useLocation();
  
  // Инициализируем трекинг для всего приложения
  useTracking({
    trackPageViews: true,
    trackTimeOnPage: true
  });

  return (
    <div
      className="min-h-[100dvh] bg-gray-50"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #F9FAFB)' }}
    >
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />

        <Route path="/open" element={<OpenRedirect />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/public-offer" element={<PublicOfferScreen />} />

        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <WithdrawScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-survey"
          element={
            <ProtectedRoute>
              <OrderSurveyScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referral-program"
          element={
            <ProtectedRoute>
              <ReferralProgramScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-info"
          element={
            <ProtectedRoute>
              <ProjectInfoScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-edit"
          element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-tally"
          element={
            <ProtectedRoute>
              <TallyFormsTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
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
        <Router>
          <AuthInitializer>
            <AppContent />
          </AuthInitializer>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
