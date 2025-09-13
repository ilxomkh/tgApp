// tg-app/src/components/Main/tabs/HomeTab.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { GradientCard, SoftButton } from '../ui';
import { SettingsIcon, WalletIcon } from '../icons';
import SurveyCard from '../SurveyCard';
import SurveyModal from '../SurveyModal';
import { useSurvey } from '../../../hooks/useSurvey';
import UserAvatar from '../../UserAvatar';


const HomeTab = ({ t, onOpenProfile, user }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const { getSurvey, submitSurvey, getAvailableSurveys, loading } = useSurvey();

  // Загружаем опросы из Tally при монтировании компонента
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        setSurveysLoading(true);
        const availableSurveys = await getAvailableSurveys();
        
        // Фильтруем опросы по языку
        const filteredSurveys = availableSurveys.filter(survey => {
          // Проверяем язык опроса
          const surveyLanguage = survey.language || 'ru'; // По умолчанию русский
          const matchesLanguage = surveyLanguage === language;
          
          return matchesLanguage;
        });
        
        setSurveys(filteredSurveys);
      } catch (error) {
        console.error('Error loading surveys:', error);
        // В случае ошибки показываем пустой список
        setSurveys([]);
      } finally {
        setSurveysLoading(false);
      }
    };

    loadSurveys();
  }, [getAvailableSurveys, language]); // Добавляем language в зависимости

  const handleSurveyStart = async (surveyId) => {
    try {
      // Загружаем опрос с бекенда
      const survey = await getSurvey(surveyId);
      setSelectedSurvey(survey);
      setIsSurveyModalOpen(true);
    } catch (error) {
      console.error('Error loading survey:', error);
      // Здесь можно показать уведомление об ошибке
    }
  };

  const handleSurveyComplete = async (surveyId, answers) => {
    try {
      // Отправляем ответы на бекенд
      const result = await submitSurvey(surveyId, answers);
      return result;
    } catch (error) {
      console.error('Error completing survey:', error);
      throw error;
    }
  };

  const closeSurveyModal = () => {
    setIsSurveyModalOpen(false);
    setSelectedSurvey(null);
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
              />
            </div>
            <div>
              <p className="text-white/90 text-sm">{t.balance}</p>
              <p className="text-3xl font-extrabold tracking-tight">
                {user?.balance || 0} {t.sum}
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
          // Показываем загрузку
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C65FF]"></div>
          </div>
        ) : surveys.length > 0 ? (
          // Показываем опросы
          surveys.map((survey) => {
            console.log('🎯 Отображаем опрос:', {
              surveyId: survey.id,
              surveyTitle: survey.title,
              surveyLanguage: survey.language,
              currentLanguage: language
            });
            
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
          // Показываем сообщение, если нет опросов
          <div className="text-center py-8 text-gray-500">
            {language === 'ru' 
              ? `Нет доступных опросов для языка: ${language}` 
              : `${language} tilida mavjud so'rovlar yo'q`
            }
          </div>
        )}
      </div>

      {/* Модальное окно опроса */}
      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={closeSurveyModal}
        survey={selectedSurvey}
        onComplete={handleSurveyComplete}
        t={t}
      />

    </div>
  );
};

export default HomeTab;
