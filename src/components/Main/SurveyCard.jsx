// tg-app/src/components/Main/SurveyCard.jsx
import React from 'react';
import { GradientCard } from './ui';
import { ArrowRightIcon } from './icons';

const SurveyCard = ({ title, subtitle, ctaLabel, onStart }) => (
  <GradientCard from="from-indigo-500" to="to-blue-600" className="relative overflow-hidden">
    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -right-10 top-10 w-36 h-36 rounded-full bg-white/10" />
    <h4 className="font-semibold text-white/95 mb-1">{title}</h4>
    <p className="text-lg font-bold mb-4">{subtitle}</p>
    <button
      onClick={onStart}
      className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition"
    >
      {ctaLabel}
      <ArrowRightIcon />
    </button>
  </GradientCard>
);

export default SurveyCard;
