import React from 'react';
import { ArrowRightIcon } from './icons';

const SurveyCard = ({ title, lines = [], ctaLabel, onStart }) => (
  <div className="rounded-2xl p-5 text-white bg-gradient-to-tr from-[#5538F9] to-[#7C65FF] shadow-[0_16px_36px_rgba(90,80,230,0.35)] relative overflow-hidden">
    {/* мягкие блики как на макете */}
    <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
    <div className="absolute -right-16 top-6 w-40 h-40 rounded-full bg-white/10" />

    <h4 className="font-semibold text-white/95 mb-2">{title}</h4>
    {lines.map((line, idx) => (
      <p key={idx} className="text-[15px] text-white/90 mb-1">
        {line}
      </p>
    ))}

    {/* CTA кнопка */}
    <button
      onClick={onStart}
      className="
        mt-4 w-full h-12 rounded-xl bg-white text-[#7C65FF]
        font-semibold px-4 flex items-center justify-between
        hover:bg-white/30 active:scale-[0.99] transition
      "
    >
      <span>{ctaLabel}</span>
      <span className="w-8 h-8 rounded-full grid place-items-center bg-white/20">
        <ArrowRightIcon />
      </span>
    </button>
  </div>
);

export default SurveyCard;
