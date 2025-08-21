// tg-app/src/components/Main/tabs/HomeTab.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { GradientCard, SoftButton } from '../ui';
import SurveyCard from '../SurveyCard';

const HomeTab = ({ t }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <GradientCard className="px-5 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90">{t.balance}</p>
            <p className="text-3xl font-extrabold mt-1 tracking-tight">
              {user?.bonusBalance || 0} {t.sum}
            </p>
          </div>
          <div className="h-12 w-12 grid place-items-center rounded-xl bg-white/15 border border-white/20 shadow-inner">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <SoftButton onClick={() => navigate('/withdraw')} className="mt-4 bg-white/10 text-white hover:bg-white/20">
          {t.withdraw}
        </SoftButton>
      </GradientCard>

      <div className="space-y-4">
        <SurveyCard title={t.themeIntro} subtitle={t.g12k} ctaLabel={t.survey} onStart={() => navigate('/survey/intro')} />
        <SurveyCard title={t.themeShop} subtitle={t.l3m} ctaLabel={t.survey} onStart={() => navigate('/survey/shops')} />
        <SurveyCard title={t.themeBank} subtitle={t.g10k_l1m} ctaLabel={t.survey} onStart={() => navigate('/survey/banks')} />
      </div>
    </div>
  );
};

export default HomeTab;
