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
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProSVG from './assets/Pro.svg';
import WaveOverlay from './components/WaveOverlay';
import CloseConfirmationModal from './components/CloseConfirmationModal';

const STARTAPP_PAYLOAD = 'home';

function useTelegramInit(setIsRedirecting, setIsCloseModalOpen) {
  const location = useLocation();
  const navigate = useNavigate();
  const backHandlerRef = useRef(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const redirectedKey = '__sa_redirect_done__';

    try {
      // 1. Берём start_param из initDataUnsafe
      let startParam = tg.initDataUnsafe?.start_param;

      // 2. Если пусто — берём из query параметра (Menu Button)
      if (!startParam) {
        const urlParams = new URLSearchParams(window.location.search);
        startParam = urlParams.get("tgWebAppStartParam");
      }

      const alreadyRedirected = sessionStorage.getItem(redirectedKey) === '1';

      if (startParam === STARTAPP_PAYLOAD && !alreadyRedirected) {
        sessionStorage.setItem(redirectedKey, '1');
        setIsRedirecting(true);

        setTimeout(() => {
          setIsRedirecting(false);
          navigate('/main');
        }, 500);

        return;
      }
    } catch (err) {
      console.error("Telegram init error:", err);
    }

    // --- Убираем MainButton ---
    const nukeMainButton = () => {
      try {
        tg.MainButton?.hide();
        if (tg.MainButton) {
          tg.MainButton.show = () => {};
          tg.MainButton.setParams = () => {};
        }
      } catch {}
    };
    nukeMainButton();
    [100, 300, 1000].forEach((delay) => setTimeout(nukeMainButton, delay));

    tg.onEvent('web_app_ready', nukeMainButton);
    tg.onEvent('mainButtonParamsChanged', nukeMainButton);
    tg.onEvent('mainButtonTextChanged', nukeMainButton);
    tg.onEvent('themeChanged', nukeMainButton);

    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
      setTimeout(() => tg.disableVerticalSwipes(), 300);
    }

    const preventPullToRefresh = (e) => {
      if (window.scrollY === 0 && e.touches?.length === 1) {
        const startY = e.touches[0].clientY;
        const onMove = (ev) => {
          const dy = ev.touches[0].clientY - startY;
          if (dy > 10) {
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

    const vibrateOnClick = () => tg.HapticFeedback?.impactOccurred?.('medium');
    document.addEventListener('click', vibrateOnClick);

    const handleCloseRequest = () => setIsCloseModalOpen(true);

    window.addEventListener('beforeunload', (e) => {
      const activeElement = document.activeElement;
      const isFormActive =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT');

      const hasUnsavedData = sessionStorage.getItem('hasUnsavedData') === 'true';

      if (isFormActive || hasUnsavedData) {
        const message = 'Вы действительно хотите покинуть страницу? Несохраненные данные будут потеряны.';
        e.returnValue = message;
        return message;
      }
    });

    if (tg.onEvent) {
      tg.offEvent('web_app_close', handleCloseRequest);
      tg.onEvent('web_app_close', handleCloseRequest);
    }

    const backPages = new Set([
      '/withdraw',
      '/profile-edit',
      '/project-info',
      '/public-offer',
      '/support',
      '/order-survey',
      '/test-tally',
    ]);

    const applyBackButtonForPath = (path) => {
      if (!tg.BackButton) return;
      if (backHandlerRef.current) {
        tg.BackButton.offClick(backHandlerRef.current);
        backHandlerRef.current = null;
      }
      if (backPages.has(path)) {
        tg.BackButton.show();
        const handler = () => navigate(-1);
        backHandlerRef.current = handler;
        tg.BackButton.onClick(handler);
      } else {
        tg.BackButton.hide();
      }
    };

    applyBackButtonForPath(location.pathname);

    return () => {
      tg.offEvent('web_app_ready', nukeMainButton);
      tg.offEvent('mainButtonParamsChanged', nukeMainButton);
      tg.offEvent('mainButtonTextChanged', nukeMainButton);
      tg.offEvent('themeChanged', nukeMainButton);
      if (tg.BackButton && backHandlerRef.current) {
        tg.BackButton.offClick(backHandlerRef.current);
        tg.BackButton.hide();
      }
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('click', vibrateOnClick);
      if (tg.onEvent) {
        tg.offEvent('web_app_close', handleCloseRequest);
      }
    };
  }, [location.pathname, navigate, setIsRedirecting, setIsCloseModalOpen]);
}

function AppContent() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  useTelegramInit(setIsRedirecting, setIsCloseModalOpen);

  if (isRedirecting) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#7C65FF] to-[#5538F9]">
        <WaveOverlay />
        <img
          src={ProSVG}
          className="absolute w-[250px] top-1/2 left-1/2 -translate-x-1/2 z-50"
        />
      </div>
    );
  }

  return (
    <>
      <RouterContent />
      <CloseConfirmationModal
        isOpen={isCloseModalOpen}
        onConfirm={() => {
          const tg = window.Telegram?.WebApp;
          if (tg?.close) tg.close();
          setIsCloseModalOpen(false);
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

  return (
    <div
      className="min-h-[100dvh] bg-gray-50"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #F9FAFB)' }}
    >
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/public-offer" element={<PublicOfferScreen />} />
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
