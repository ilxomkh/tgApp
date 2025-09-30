import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { GradientCard, SoftButton } from '../ui';
import { SettingsIcon, WalletIcon } from '../icons';
import SurveyCard from '../SurveyCard';
import SurveyModal from '../SurveyModal';
import { useSurvey } from '../../../hooks/useSurvey';
import { useSurveyModal } from '../../../hooks/useSurveyModal';
import UserAvatar from '../../UserAvatar';
import { formatNumber } from '../../../utils/numberFormat';
import { isSurveyCompleted } from '../../../utils/completedSurveys';


const HomeTab = ({ t, onOpenProfile, user }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { refreshUserProfile } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const { getSurvey, submitSurvey, getAvailableSurveys, loading, surveyCache } = useSurvey();
  const { 
    isSurveyModalOpen, 
    selectedSurvey, 
    openSurveyModal, 
    closeSurveyModal 
  } = useSurveyModal();

  const loadSurveys = async () => {
    try {
      console.log('🔄 Загружаем список опросов...');
      setSurveysLoading(true);
      
      const availableSurveys = await getAvailableSurveys();
      
      const filteredSurveys = availableSurveys.filter(survey => {
        const surveyLanguage = survey.language || 'ru';
        const matchesLanguage = surveyLanguage === language;
        const isNotCompleted = !isSurveyCompleted(survey.id);
        
        
        if (!matchesLanguage) {
        }
        if (!isNotCompleted) {
        }
        
        return matchesLanguage && isNotCompleted;
      });
      
      setSurveys(filteredSurveys);
    } catch (error) {
      setSurveys([]);
    } finally {
      setSurveysLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, [getAvailableSurveys, language]);


  const handleSurveyStart = async (surveyId) => {
    try {
      if (surveyCache[surveyId]) {
        openSurveyModal(surveyCache[surveyId]);
        return;
      }

      const survey = await getSurvey(surveyId);
      openSurveyModal(survey);
    } catch (error) {
      if (error.message && error.message.includes('Вы уже прошли этот опрос')) {
        loadSurveys();
      }
    }
  };

  const handleSurveyComplete = async (surveyId, answers) => {
    try {
      const result = await submitSurvey(surveyId, answers);
      
      await Promise.all([
        refreshUserProfile(),
        loadSurveys()
      ]);
      
      return result;
    } catch (error) {
      throw error;
    }
  };



  const openProfile = () => {
    navigate('/profile-edit');
  };

  return (
    <div className="space-y-5">
      <GradientCard className="px-5 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-18 h-18 rounded-full bg-white/15 flex items-center justify-center relative">
              <UserAvatar 
                avatarUrl={user?.avatar_url} 
                size="w-full h-full"
                className="bg-white/15"
                showBorder={false}
                iconSize="w-10 h-10"
              />
            </div>
            <div>
              <p className="text-white/90 text-md font-semibold">{t.balance}</p>
              <p className="text-3xl font-extrabold tracking-tight">
                {formatNumber(user?.balance || 0)} {t.sum}
              </p>
            </div>
          </div>
          <button 
            onClick={openProfile}
            className="h-12 w-12 grid place-items-center absolute top-3 right-3 transition-colors"
          >
            <SettingsIcon />
          </button>
        </div>
        <SoftButton onClick={() => navigate('/withdraw')} className="w-full bg-[#8888FC] text-white hover:bg-white/20 flex items-center justify-center gap-2">
          <WalletIcon />
          <span>{t.withdraw}</span>
        </SoftButton>
      </GradientCard>

      <div className="space-y-4">
        {surveysLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                </div>
                
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : surveys.length > 0 ? (
          surveys.map((survey) => {
            
            return (
              <SurveyCard 
                key={survey.id}
                title={survey.title} 
                lines={survey.displayInfo?.lines || []} 
                ctaLabel={t.survey} 
                onStart={() => handleSurveyStart(survey.id)} 
              />
            );
          })
        ) : (
          <div className="text-center pt-50 text-gray-500 text-lg">
            {t.noSurveys}
          </div>
        )}
      </div>

      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={closeSurveyModal}
        survey={selectedSurvey}
        onComplete={handleSurveyComplete}
        onSurveyComplete={loadSurveys}
        t={t}
      />

    </div>
  );
};

export default HomeTab;
