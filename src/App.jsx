// App.jsx
import { useEffect, useRef } from 'react';
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

function useTelegramInit() {
  const location = useLocation();      // теперь внутри Router
  const navigate = useNavigate();
  const backHandlerRef = useRef(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    // ——— Base init
    tg.ready();
    tg.expand();
    console.log('Telegram WebApp version:', tg.version);

    // ——— Kill MainButton навсегда
    const nukeMainButton = () => {
      try {
        tg.MainButton?.hide();
        // делаем методы no-op, чтобы никто случайно не включил
        if (tg.MainButton) {
          tg.MainButton.show = () => {};
          tg.MainButton.setParams = () => {};
        }
      } catch (e) {
        console.warn('MainButton disable error:', e);
      }
    };
    nukeMainButton();
    // страховочные повторы
    setTimeout(nukeMainButton, 100);
    setTimeout(nukeMainButton, 300);
    setTimeout(nukeMainButton, 1000);

    tg.onEvent('web_app_ready', nukeMainButton);
    tg.onEvent('mainButtonParamsChanged', nukeMainButton);
    tg.onEvent('mainButtonTextChanged', nukeMainButton);
    tg.onEvent('themeChanged', nukeMainButton);

    // ——— Disable vertical swipes
    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
      setTimeout(() => tg.disableVerticalSwipes(), 300);
    }

    // ——— iOS pull-to-refresh fallback
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
        document.addEventListener('touchend', () => {
          document.removeEventListener('touchmove', onMove);
        }, { once: true });
      }
    };
    document.addEventListener('touchstart', preventPullToRefresh, { passive: true });

    // ——— Haptics
    const vibrateOnClick = () => {
      tg.HapticFeedback?.impactOccurred?.('medium');
    };
    document.addEventListener('click', vibrateOnClick);

    // ——— BackButton logic per route
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

      // чистим старый обработчик, если был
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

    // применяем при монтировании и при каждом смене маршрута
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]); // реагируем только на изменение пути
}

function AppContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();
  useTelegramInit();

  return <RouterContent />;
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
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #F9FAFB)' }}
    >
      <Routes>
        {/* public */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/public-offer" element={<PublicOfferScreen />} />
        {/* protected */}
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
        {/* ВАЖНО: Router здесь, чтобы все хуки получали контекст */}
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
