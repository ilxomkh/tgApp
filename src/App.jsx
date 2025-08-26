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
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { isLanguageModalOpen, closeLanguageModal } = useLanguage();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/main" element={<MainScreen />} />
          <Route path="/withdraw" element={<WithdrawScreen />} />
          <Route path="/order-survey" element={<OrderSurveyScreen />} />
          <Route path="/referral-program" element={<ReferralProgramScreen />} />
          <Route path="/project-info" element={<ProjectInfoScreen />} />
          <Route path="/public-offer" element={<PublicOfferScreen />} />
          <Route path="/support" element={<SupportScreen />} />
        </Routes>
        
        {/* Language Modal */}
        <LanguageSelector 
          isOpen={isLanguageModalOpen} 
          onClose={closeLanguageModal} 
        />
      </div>
    </Router>
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
