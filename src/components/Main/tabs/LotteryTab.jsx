// tg-app/src/components/Main/tabs/LotteryTab.jsx
import React from 'react';
import { GradientCard } from '../ui';

const LotteryTab = ({ t }) => {
  return (
    <div className="space-y-5">
      <GradientCard from="from-violet-500" to="to-fuchsia-600">
        <h4 className="font-semibold mb-1">{t.lotThemeShop}</h4>
        <p className="text-sm text-white/90 mb-1">{t.lotDate}: 12.08.2025</p>
        <p className="text-sm text-white/90 mb-4">{t.lotSum}: 3 000 000 {t.sum}</p>
        <div className="bg-white rounded-xl p-8 text-center text-gray-700 font-medium shadow-inner">
          {t.yt}
        </div>
      </GradientCard>

      <GradientCard from="from-violet-500" to="to-fuchsia-600">
        <h4 className="font-semibold mb-1">{t.lotThemeBank}</h4>
        <p className="text-sm text-white/90 mb-1">{t.lotDate}: 08.08.2025</p>
        <p className="text-sm text-white/90 mb-4">{t.lotSum}: 1 000 000 {t.sum}</p>
        <div className="bg-white rounded-xl p-8 text-center text-gray-700 font-medium shadow-inner">
          {t.yt}
        </div>
      </GradientCard>
    </div>
  );
};

export default LotteryTab;
